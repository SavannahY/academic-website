"""Contained-element, stock-and-flow stress test for a fixed Nd/Dy basket.

Deployment × intensity follows Cheng et al. (2025). The monthly network,
capacity proxies, inventories, yields, and equal abstract budget policies are
explicit exploratory extensions. This is not a replication of published TRI
results or a calibrated forecast of US/global magnet deliveries.
"""

from __future__ import annotations

from copy import deepcopy
import json
import math
from pathlib import Path

ELEMENTS = ("Nd", "Dy")
STAGES = ("mining", "refining", "manufacturing")
POLICIES = ("none", "mining", "refining", "manufacturing", "finished-inventory")
INTENSITIES = {
    "direct-drive-pm": {"Nd": 180.0, "Dy": 17.0},
    "geared-pm": {"Nd": 51.0, "Dy": 6.0},
}


def default_config() -> dict:
    """Return fresh, JSON-safe flat inputs; capacity and costs are assumptions."""
    return {
        "wind_mw_per_year": 1000.0,
        "ev_per_year": 1_000_000.0,
        "wind_design": "direct-drive-pm",
        "ev_nd_kg": 0.3865,
        "ev_dy_kg": 0.0885,
        "horizon_months": 24,
        "shock_start_month": 4,
        "shock_duration_months": 3,
        "shock_stage": "refining",
        "shock_retention": 0.5,
        "shock_region": "China",
        "shock_element": "both",
        "capacity_headroom": 0.1,
        "inventory_months": 1.0,
        "working_inventory_months": 0.25,
        "budget": 100.0,
        "intervention": "none",
        "qualification_months": 6,
        "intervention_start_month": 1,
        "mining_lead_months": 1,
        "refining_lead_months": 1,
        "manufacturing_lead_months": 1,
        "mining_yield": 0.98,
        "refining_yield": 0.95,
        "manufacturing_yield": 0.90,
        "china_mining_share": 0.60,
        "china_refining_share": 0.91,
        "china_manufacturing_share": 0.94,
        "mining_capacity_gain_per_budget": 0.003,
        "refining_capacity_gain_per_budget": 0.0025,
        "manufacturing_capacity_gain_per_budget": 0.002,
        "inventory_month_gain_per_budget": 0.02,
    }


def _config(config: dict | None) -> dict:
    c = default_config()
    if config is not None:
        if not isinstance(config, dict):
            raise ValueError("config must be an object")
        unknown = set(config) - set(c)
        if unknown:
            raise ValueError("Unknown config inputs: " + ", ".join(sorted(unknown)))
        c.update(deepcopy(config))
    if c["wind_design"] not in INTENSITIES:
        raise ValueError("wind_design must be direct-drive-pm or geared-pm")
    if c["shock_stage"] not in STAGES or c["intervention"] not in POLICIES:
        raise ValueError("Unknown shock stage or intervention")
    if c["shock_region"] not in ("China", "Rest of world"):
        raise ValueError("shock_region must be China or Rest of world")
    if c["shock_element"] not in ("both", "Nd", "Dy"):
        raise ValueError("shock_element must be both, Nd, or Dy")
    nonnegative = (
        "wind_mw_per_year", "ev_per_year", "ev_nd_kg", "ev_dy_kg",
        "capacity_headroom", "inventory_months", "working_inventory_months",
        "budget", "mining_capacity_gain_per_budget",
        "refining_capacity_gain_per_budget", "manufacturing_capacity_gain_per_budget",
        "inventory_month_gain_per_budget",
    )
    for key in nonnegative:
        val = c[key]
        if isinstance(val, bool) or not isinstance(val, (int, float)) or not math.isfinite(val) or val < 0:
            raise ValueError(key + " must be finite and nonnegative")
    for key in ("shock_retention", "china_mining_share", "china_refining_share", "china_manufacturing_share"):
        if isinstance(c[key], bool) or not isinstance(c[key], (int, float)) or not math.isfinite(c[key]) or not 0 <= c[key] <= 1:
            raise ValueError(key + " must be between zero and one")
    for stage in STAGES:
        key = stage + "_yield"
        if isinstance(c[key], bool) or not isinstance(c[key], (int, float)) or not math.isfinite(c[key]) or not 0 < c[key] <= 1:
            raise ValueError(key + " must be greater than zero and at most one")
    integers = {
        "horizon_months": 1, "shock_start_month": 1,
        "shock_duration_months": 0, "qualification_months": 0,
        "intervention_start_month": 1, "mining_lead_months": 1,
        "refining_lead_months": 1, "manufacturing_lead_months": 1,
    }
    for key, minimum in integers.items():
        if isinstance(c[key], bool) or not isinstance(c[key], (int, float)) or not math.isfinite(c[key]) or int(c[key]) != c[key] or c[key] < minimum:
            raise ValueError(key + " must be an integer >= " + str(minimum))
        c[key] = int(c[key])
    if c["horizon_months"] > 600:
        raise ValueError("horizon_months is limited to 600 in this prototype")
    return c


def demand_from_deployment(config: dict | None = None) -> dict:
    """Gross annual tonnes of Nd and Dy, not finished magnet tonnage.

    Passenger vehicles here all use the selected permanent-magnet design.
    No retired cohort is supplied to this short-run disruption model, so no
    recycling credit is subtracted. See trade_risk.py for the separate method.
    """
    c = _config(config)
    wind = INTENSITIES[c["wind_design"]]
    return {
        e: (c["wind_mw_per_year"] * wind[e] + c["ev_per_year"] * c["ev_" + e.lower() + "_kg"]) / 1000
        for e in ELEMENTS
    }


def _zero() -> dict:
    return {e: 0.0 for e in ELEMENTS}


def _sources() -> dict:
    path = Path(__file__).resolve().parents[1] / "data" / "baseline.json"
    return json.loads(path.read_text(encoding="utf-8"))


def simulate(config: dict | None = None) -> dict:
    """Simulate monthly contained-element inventories and balanced deliveries.

    Production is pulled toward forecast lead-time demand plus target stocks.
    Refining works on Nd and Dy separately; manufacturing and delivery require
    both in the fixed technology basket. Stocks are global/fungible, not a
    measured map of supply routes. All flow capacities are output tonnes/month.
    """
    c = _config(config)
    annual = demand_from_deployment(c)
    need = {e: annual[e] / 12.0 for e in ELEMENTS}
    active = tuple(e for e in ELEMENTS if need[e] > 0)
    yields = {stage: c[stage + "_yield"] for stage in STAGES}
    leads = {stage: c[stage + "_lead_months"] for stage in STAGES}
    # Output required at each stage, including subsequent processing losses.
    normal = {
        "manufacturing": dict(need),
        "refining": {e: need[e] / yields["manufacturing"] for e in ELEMENTS},
        "mining": {e: need[e] / yields["manufacturing"] / yields["refining"] for e in ELEMENTS},
    }
    base_capacity = {
        stage: {e: normal[stage][e] * (1 + c["capacity_headroom"]) for e in ELEMENTS}
        for stage in STAGES
    }
    policy = c["intervention"]
    stock_gain = c["budget"] * c["inventory_month_gain_per_budget"] if policy == "finished-inventory" else 0.0
    # Inventory purchase is made before the simulation; this finite stock is in
    # the initial material ledger, not an untracked recurring supply source.
    # A stockpiling policy raises the operating reserve target as well as the
    # initial stock. Replenishing it still consumes actual upstream throughput;
    # it is not a recurring exogenous input or unlimited emergency purchase.
    finished_target = c["inventory_months"] + stock_gain
    stocks = {
        "raw": {e: normal["mining"][e] * c["working_inventory_months"] for e in ELEMENTS},
        "refined": {e: normal["refining"][e] * c["working_inventory_months"] for e in ELEMENTS},
        "finished": {e: need[e] * finished_target for e in ELEMENTS},
    }
    # Initial pipeline contains the steady-state flow already in transit.
    queue = {
        stage: [{"due_month": i + 1, "tonnes": dict(normal[stage])} for i in range(leads[stage])]
        for stage in STAGES
    }

    def pipeline_totals() -> dict:
        return {stage: {e: sum(item["tonnes"][e] for item in queue[stage]) for e in ELEMENTS} for stage in STAGES}

    def total_material() -> dict:
        pipe = pipeline_totals()
        return {e: sum(stocks[k][e] for k in stocks) + sum(pipe[k][e] for k in STAGES) for e in ELEMENTS}

    initial_material = total_material()
    cumulative_input, cumulative_loss, cumulative_delivered = _zero(), _zero(), _zero()
    backlog = 0.0
    rows = []
    qual_month = c["intervention_start_month"] + c["qualification_months"]
    for month in range(1, c["horizon_months"] + 1):
        shock = c["shock_start_month"] <= month < c["shock_start_month"] + c["shock_duration_months"]
        intervention_active = policy in STAGES and month >= qual_month
        destination = {"mining": "raw", "refining": "refined", "manufacturing": "finished"}
        for stage in STAGES:
            matured = [x for x in queue[stage] if x["due_month"] <= month]
            queue[stage] = [x for x in queue[stage] if x["due_month"] > month]
            for item in matured:
                for e in ELEMENTS:
                    stocks[destination[stage]][e] += item["tonnes"][e]

        # One new monthly portfolio basket; backlog is fulfilled at most once.
        new_demand = 1.0 if active else 0.0
        backlog += new_demand
        delivered_baskets = min([backlog] + [stocks["finished"][e] / need[e] for e in active]) if active else 0.0
        backlog = max(0.0, backlog - delivered_baskets)
        delivered = {e: delivered_baskets * need[e] for e in ELEMENTS}
        for e in ELEMENTS:
            stocks["finished"][e] = max(0.0, stocks["finished"][e] - delivered[e])
            cumulative_delivered[e] += delivered[e]

        capacity = {}
        regional_capacity = {}
        for stage in STAGES:
            share = c["china_" + stage + "_share"]
            regional_capacity[stage] = {"China": {}, "Rest of world": {}}
            capacity[stage] = {}
            gain = c["budget"] * c[stage + "_capacity_gain_per_budget"] if policy == stage and intervention_active else 0.0
            for e in ELEMENTS:
                china = base_capacity[stage][e] * share
                other = base_capacity[stage][e] * (1 - share)
                # Diversification investment is built outside the disrupted
                # region. The gain is a share of unshocked baseline capacity.
                addition = base_capacity[stage][e] * gain
                if c["shock_region"] == "China":
                    other += addition
                else:
                    china += addition
                if shock and stage == c["shock_stage"] and c["shock_element"] in ("both", e):
                    if c["shock_region"] == "China":
                        china *= c["shock_retention"]
                    else:
                        other *= c["shock_retention"]
                regional_capacity[stage]["China"][e] = china
                regional_capacity[stage]["Rest of world"][e] = other
                capacity[stage][e] = china + other

        throughput = {stage: _zero() for stage in STAGES}
        losses, external = _zero(), _zero()
        # Process downstream first: no within-month instantaneous pass-through.
        pending = pipeline_totals()
        target_baskets = backlog + leads["manufacturing"] + finished_target
        desired_manufacture = max(0.0, target_baskets - min([ (stocks["finished"][e] + pending["manufacturing"][e]) / need[e] for e in active])) if active else 0.0
        manufacture_baskets = min([desired_manufacture] + [capacity["manufacturing"][e] / need[e] for e in active] + [stocks["refined"][e] * yields["manufacturing"] / need[e] for e in active]) if active else 0.0
        for e in ELEMENTS:
            out = manufacture_baskets * need[e]
            consumed = out / yields["manufacturing"]
            stocks["refined"][e] = max(0.0, stocks["refined"][e] - consumed)
            losses[e] += consumed - out
            throughput["manufacturing"][e] = out
        queue["manufacturing"].append({"due_month": month + leads["manufacturing"], "tonnes": dict(throughput["manufacturing"])})

        pending = pipeline_totals()
        for e in ELEMENTS:
            target = normal["refining"][e] * (leads["refining"] + c["working_inventory_months"] + backlog)
            desired = max(0.0, target - stocks["refined"][e] - pending["refining"][e])
            out = min(desired, capacity["refining"][e], stocks["raw"][e] * yields["refining"])
            consumed = out / yields["refining"]
            stocks["raw"][e] = max(0.0, stocks["raw"][e] - consumed)
            losses[e] += consumed - out
            throughput["refining"][e] = out
        queue["refining"].append({"due_month": month + leads["refining"], "tonnes": dict(throughput["refining"])})

        pending = pipeline_totals()
        for e in ELEMENTS:
            target = normal["mining"][e] * (leads["mining"] + c["working_inventory_months"] + backlog)
            desired = max(0.0, target - stocks["raw"][e] - pending["mining"][e])
            out = min(desired, capacity["mining"][e])
            feed = out / yields["mining"]
            external[e] = feed
            losses[e] += feed - out
            throughput["mining"][e] = out
        queue["mining"].append({"due_month": month + leads["mining"], "tonnes": dict(throughput["mining"])})
        for e in ELEMENTS:
            cumulative_input[e] += external[e]
            cumulative_loss[e] += losses[e]
        total = total_material()
        balance = {e: initial_material[e] + cumulative_input[e] - cumulative_loss[e] - cumulative_delivered[e] - total[e] for e in ELEMENTS}
        rows.append({
            "month": month,
            "new_demand_baskets": new_demand,
            "delivered_baskets": delivered_baskets,
            "backlog_baskets": backlog,
            "demand_tonnes": dict(need),
            "delivered_tonnes": delivered,
            "inventory": deepcopy(stocks),
            "pipeline": pipeline_totals(),
            "throughput": throughput,
            "capacity": capacity,
            "regional_capacity": regional_capacity,
            "losses": losses,
            "external_input": external,
            "balance_residual_tonnes": balance,
            "shock_active": shock,
            "intervention_active": intervention_active or (policy == "finished-inventory"),
        })

    total_baskets = sum(x["new_demand_baskets"] for x in rows)
    delivered_total = sum(x["delivered_baskets"] for x in rows)
    shock_end = c["shock_start_month"] + c["shock_duration_months"] - 1
    affected = any(x["backlog_baskets"] > 1e-9 for x in rows)
    recovery = None
    if affected:
        for i, row in enumerate(rows):
            if row["month"] > shock_end and row["backlog_baskets"] <= 1e-9 and all(x["backlog_baskets"] <= 1e-9 for x in rows[i:]):
                recovery = row["month"]
                break
    residual = max((abs(x["balance_residual_tonnes"][e]) for x in rows for e in ELEMENTS), default=0.0)
    end_total = total_material()
    max_backlog = max((x["backlog_baskets"] for x in rows), default=0.0)
    return {
        "config": c,
        "demand": {
            "annual_tonnes": annual, "monthly_tonnes": need,
            "wind_annual_tonnes": {e: c["wind_mw_per_year"] * INTENSITIES[c["wind_design"]][e] / 1000 for e in ELEMENTS},
            "ev_annual_tonnes": {e: c["ev_per_year"] * c["ev_" + e.lower() + "_kg"] / 1000 for e in ELEMENTS},
            "unit": "tonnes of contained element",
            "basket": "one month of the fixed selected-design wind and PM-vehicle portfolio",
        },
        "monthly": rows,
        "metrics": {
            "demand_baskets": total_baskets,
            "delivered_baskets": delivered_total,
            "unmet_baskets": backlog,
            "service_fraction": delivered_total / total_baskets if total_baskets else 1.0,
            "unmet_fraction": backlog / total_baskets if total_baskets else 0.0,
            "max_backlog_baskets": max_backlog,
            "cumulative_backlog_basket_months": sum(x["backlog_baskets"] for x in rows),
            "months_with_backlog": sum(x["backlog_baskets"] > 1e-9 for x in rows),
            "first_backlog_month": next((x["month"] for x in rows if x["backlog_baskets"] > 1e-9), None),
            "recovery_month": recovery,
            "recovery_status": "no-delivery-shortage" if not affected else ("recovered" if recovery is not None else "not-recovered-within-horizon"),
            "delivered_tonnes": dict(cumulative_delivered),
            "unmet_tonnes": {e: backlog * need[e] for e in ELEMENTS},
            "delayed_wind_mw_at_end": backlog * c["wind_mw_per_year"] / 12,
            "delayed_pm_vehicles_at_end": backlog * c["ev_per_year"] / 12,
            "max_delayed_wind_mw": max_backlog * c["wind_mw_per_year"] / 12,
            "max_delayed_pm_vehicles": max_backlog * c["ev_per_year"] / 12,
            "policy_budget_spent": 0.0 if policy == "none" else c["budget"],
            "qualification_complete_month": qual_month if policy in STAGES else None,
            "additional_finished_inventory_months": stock_gain,
        },
        "audit": {
            "initial_material_tonnes": initial_material,
            "external_input_tonnes": dict(cumulative_input),
            "process_losses_tonnes": dict(cumulative_loss),
            "delivered_tonnes": dict(cumulative_delivered),
            "final_material_tonnes": end_total,
            "max_abs_balance_residual_tonnes": residual,
            "material_balance_pass": residual < 1e-7,
            "nonnegative_stocks": all(x["inventory"][k][e] >= -1e-9 for x in rows for k in stocks for e in ELEMENTS),
            "basket_ledger_residual": total_baskets - delivered_total - backlog,
            "definition": "initial material + external feed = delivered material + processing losses + ending stocks and pipeline",
        },
        "evidence": _sources(),
    }


def compare(config: dict | None = None) -> dict:
    """Equal abstract budget policies plus 30/90/180-day duration sensitivity.

    Days are discretized as 30-day model months; no calendar precision is implied.
    The no-intervention reference spends zero, all four interventions spend the
    same selected abstract budget; no result is an empirical dollar ranking.
    """
    c = _config(config)
    runs = {}
    for policy in POLICIES:
        pc = dict(c, intervention=policy)
        runs[policy] = simulate(pc)
    reference = runs["none"]["metrics"]
    comparison = []
    for policy in POLICIES:
        m = runs[policy]["metrics"]
        comparison.append({
            "intervention": policy,
            **m,
            "avoided_backlog_basket_months": reference["cumulative_backlog_basket_months"] - m["cumulative_backlog_basket_months"],
            "avoided_unmet_baskets": reference["unmet_baskets"] - m["unmet_baskets"],
        })
    sensitivity = []
    for days, months in ((30, 1), (90, 3), (180, 6)):
        for policy in POLICIES:
            m = simulate(dict(c, intervention=policy, shock_duration_months=months))["metrics"]
            sensitivity.append({"shock_days": days, "shock_months": months, "intervention": policy, **m})
    return {
        "config": c,
        "comparison": comparison,
        "sensitivity": sensitivity,
        "runs": runs,
        "ranking_basis": "cumulative backlog basket-months; abstract equal-budget assumptions, not calibrated monetary returns",
        "limitations": [
            "2024 stage shares are capacity proxies with different observed denominators, applied to both elements by assumption.",
            "No grade-specific chemistry, Pr/Tb, contracts, customs routes, plant outage data, or substitution.",
            "Constant hypothetical additions; deliveries are a fixed technology basket, not allocation across competing customers.",
            "Short-run model has no retired cohorts or recovered-material feed; recycling requires cohort and collection data.",
            "Stockpile purchase occurs before month one; a late emergency purchase would be less effective and must be modeled separately.",
            "Equal budget is in abstract units; cost and qualification sensitivities determine investment rankings.",
        ],
    }
