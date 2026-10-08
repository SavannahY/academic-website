"""Representative product-aware extension of the monthly finite-stock model.

No route, capacity, cost, yield, or customer acceptance is calibrated here.
Resource/separation tonnes are contained elements, not ore tonnes. Oxygen in
derived oxide-equivalent references is outside the conserved element ledger.
"""

from __future__ import annotations

from copy import deepcopy
import json
import math
from pathlib import Path

STAGES = ("resource", "separation", "metals", "magnets", "qualification", "nonree-inputs")
POLICIES = ("none", "upstream-diversification", "processing", "magnets-qualification", "finished-inventory", "mix")
PROJECTS = POLICIES[1:4]
REE = frozenset(("Nd", "Pr", "Dy", "Tb", "Ce", "Gd", "Ho", "Sm"))
DESTINATION = {"resource": "raw", "separation": "separated", "metals": "feedstocks", "magnets": "unqualified", "qualification": "qualified", "nonree-inputs": "nonree", "policy-inventory": "qualified"}
UNITS = {"resource": "tonnes of recoverable-contained rare-earth elements", "separation": "tonnes of contained rare-earth elements in separated products", "metals": "tonnes of metal/master-alloy charge products", "magnets": "tonnes of unqualified magnet product", "qualification": "tonnes of assumed qualified usable magnet product", "nonree-inputs": "tonnes of contained non-rare-earth input elements", "policy-inventory": "tonnes of assumed qualified usable magnet product"}
OXIDE_FACTORS = {"Nd": (2 * 144.242 + 3 * 15.999) / (2 * 144.242), "Pr": (6 * 140.90766 + 11 * 15.999) / (6 * 140.90766), "Dy": (2 * 162.500 + 3 * 15.999) / (2 * 162.500), "Tb": (4 * 158.92535 + 7 * 15.999) / (4 * 158.92535)}


def _evidence() -> dict:
    return json.loads((Path(__file__).resolve().parents[1] / "data" / "supply-chain.json").read_text(encoding="utf-8"))


def default_chain_config() -> dict:
    """Fresh JSON-safe scenario inputs; every numerical network input is assumed."""
    return deepcopy(_evidence()["defaults"])


def _finite(value, label, minimum=0.0, maximum=1e9):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not minimum <= value <= maximum:
        raise ValueError(f"{label} must be finite and between {minimum} and {maximum}")
    return float(value)


def _integer(value, label, minimum=0, maximum=600):
    _finite(value, label, minimum, maximum)
    if int(value) != value:
        raise ValueError(label + " must be an integer")
    return int(value)


def _config(config: dict | None) -> dict:
    c = default_chain_config()
    if config is not None:
        if not isinstance(config, dict):
            raise ValueError("config must be an object")
        if set(config) - set(c):
            raise ValueError("Unknown chain config inputs: " + ", ".join(sorted(set(config) - set(c))))
        for key, value in config.items():
            if isinstance(c[key], dict) and key != "map_context":
                if not isinstance(value, dict) or set(value) - set(c[key]):
                    raise ValueError(key + " must use the documented object keys")
                c[key].update(deepcopy(value))
            else:
                c[key] = deepcopy(value)
    evidence = _evidence()
    if c["recipe_id"] not in {x["id"] for x in evidence["recipes"]}:
        raise ValueError("Unknown recipe_id")
    if c["policy"] not in POLICIES:
        raise ValueError("Unknown chain policy")
    if not isinstance(c["application_label"], str) or len(c["application_label"]) > 200:
        raise ValueError("application_label must be text of at most 200 characters")
    if c["initial_pipeline_mode"] not in ("warm", "empty"):
        raise ValueError("initial_pipeline_mode must be warm or empty")
    for key in ("annual_demand_tonnes", "supply_reference_annual_tonnes", "budget", "capacity_headroom"):
        _finite(c[key], key)
    _finite(c["inventory_cost_per_tonne"], "inventory_cost_per_tonne", 1e-9)
    for key in ("horizon_months", "deadline_month", "decision_month"):
        c[key] = _integer(c[key], key, 1)
    if c["deadline_month"] > c["horizon_months"] or c["decision_month"] > c["horizon_months"]:
        raise ValueError("deadline_month and decision_month must be inside the common horizon")
    for key in ("ramp_months", "project_qualification_months"):
        c[key] = _integer(c[key], key)
    c["inventory_purchase_lead_months"] = _integer(c["inventory_purchase_lead_months"], "inventory_purchase_lead_months", 1)
    for stage in STAGES:
        _finite(c["stage_yields"][stage], "stage_yields." + stage, 1e-9, 1.0)
        c["lead_months"][stage] = _integer(c["lead_months"][stage], "lead_months." + stage, 1)
        _finite(c["china_share"][stage], "china_share." + stage, 0, 1)
        _finite(c["stage_capacity_factors"][stage], "stage_capacity_factors." + stage, 0, 100)
    for key in c["inventory_months"]:
        _finite(c["inventory_months"][key], "inventory_months." + key, 0, 600)
    for project in PROJECTS:
        c["construction_months"][project] = _integer(c["construction_months"][project], "construction_months." + project)
        _finite(c["cost_per_capacity_fraction"][project], "cost_per_capacity_fraction." + project, 1e-9)
    for policy in POLICIES[1:5]:
        _finite(c["mix"][policy], "mix." + policy, 0, 1)
    if abs(sum(c["mix"].values()) - 1) > 1e-9:
        raise ValueError("mix fractions must sum to one; they are not normalized")
    for product, required in (("NdPr", {"Nd", "Pr"}), ("DyFe", {"Dy", "Fe"}), ("FeB", {"B", "Fe"})):
        assay = c["feedstock_assays"][product]
        if not isinstance(assay, dict) or set(assay) != required:
            raise ValueError(product + " needs both documented elemental mass fractions")
        for e, fraction in assay.items():
            _finite(fraction, "feedstock_assays." + product + "." + e, 1e-9, 1)
        if abs(sum(assay.values()) - 1) > 1e-9:
            raise ValueError(product + " assay must sum to one; unknown impurities are unsupported, not filled silently")
    if c["map_context"] is not None:
        if not isinstance(c["map_context"], dict):
            raise ValueError("map_context must be an evidence-reference object")
        try:
            serialized = json.dumps(c["map_context"], allow_nan=False)
        except (ValueError, TypeError) as exc:
            raise ValueError("map_context must be finite JSON data") from exc
        if len(serialized) > 50000:
            raise ValueError("map_context is limited to 50000 serialized characters")
        refs = c["map_context"].get("stage_refs", {})
        if not isinstance(refs, dict) or any(not isinstance(value, list) or not all(isinstance(ref, str) for ref in value) for value in refs.values()):
            raise ValueError("map_context.stage_refs must map stage IDs to lists of context-reference strings")
    _shocks(c)
    return c


def _shocks(c):
    raw = [{"stage": c["shock_stage"], "region": c["shock_region"], "start_month": c["shock_start_month"], "duration_months": c["shock_duration_months"], "retention": c["shock_retention"], "element": c["shock_element"]}]
    if not isinstance(c["additional_shocks"], list) or len(c["additional_shocks"]) > 20:
        raise ValueError("additional_shocks must be a list of at most 20 shocks")
    for item in c["additional_shocks"]:
        if not isinstance(item, dict):
            raise ValueError("Each additional shock must be an object")
        normalized = {key.removeprefix("shock_"): value for key, value in item.items()}
        if set(normalized) != set(raw[0]):
            raise ValueError("Shock keys: stage, region, start_month, duration_months, retention, element")
        raw.append(normalized)
    for shock in raw:
        if shock["stage"] not in STAGES or shock["region"] not in ("China", "Independent", "all"):
            raise ValueError("Unknown shock stage or region")
        if shock["element"] not in ("all", "NdPr", "Nd", "Pr", "Dy", "Tb", "Fe", "B", "Cu", "Al", "Co", "Zr", "Hf"):
            raise ValueError("Unknown shock element")
        shock["start_month"] = _integer(shock["start_month"], "shock start_month", 1, 1200)
        shock["duration_months"] = _integer(shock["duration_months"], "shock duration_months", 0, 1200)
        _finite(shock["retention"], "shock retention", 0, 1)
    return raw


def _recipe(c):
    recipe = deepcopy(next(x for x in _evidence()["recipes"] if x["id"] == c["recipe_id"]))
    composition = c["composition_wt_pct"]
    if composition is not None:
        if not isinstance(composition, dict) or set(composition) - set(recipe["composition_wt_pct"]):
            raise ValueError("composition_wt_pct may change only elements in the selected source specimen; no invented Tb")
        recipe["composition_wt_pct"].update(composition)
        recipe["source_status"] = "User-adjusted composition scenario; not the published specimen or a grade guarantee"
    for e, fraction in recipe["composition_wt_pct"].items():
        _finite(fraction, "composition_wt_pct." + e, 0, 100)
    if abs(sum(recipe["composition_wt_pct"].values()) - 100) > 1e-7:
        raise ValueError("Composition must sum to 100 wt%; incomplete/conflicting specimens cannot be normalized")
    if recipe["composition_wt_pct"].get("B", 0) <= 0 or recipe["composition_wt_pct"].get("Fe", 0) <= 0 or recipe["composition_wt_pct"].get("Nd", 0) + recipe["composition_wt_pct"].get("Pr", 0) <= 0:
        raise ValueError("Representative NdFeB composition needs Fe, B and Nd/Pr")
    return recipe


def _feedstock_plan(c, recipe):
    fractions = {e: value / 100 for e, value in recipe["composition_wt_pct"].items() if value > 0}
    products, assays = {}, {}
    def add(product, amount, assay):
        if amount > 1e-12:
            products[product], assays[product] = amount, dict(assay)
    ndpr = c["feedstock_assays"]["NdPr"]
    joint = min(fractions.get("Nd", 0) / ndpr["Nd"], fractions.get("Pr", 0) / ndpr["Pr"])
    add("NdPr-metal", joint, ndpr)
    add("Nd-metal", max(0, fractions.get("Nd", 0) - joint * ndpr["Nd"]), {"Nd": 1})
    add("Pr-metal", max(0, fractions.get("Pr", 0) - joint * ndpr["Pr"]), {"Pr": 1})
    dyfe, feb = c["feedstock_assays"]["DyFe"], c["feedstock_assays"]["FeB"]
    dy_quantity = fractions.get("Dy", 0) / dyfe["Dy"]
    b_quantity = fractions["B"] / feb["B"]
    add("DyFe", dy_quantity, dyfe)
    add("FeB", b_quantity, feb)
    carrier_fe = dy_quantity * dyfe["Fe"] + b_quantity * feb["Fe"]
    pure_fe = fractions["Fe"] - carrier_fe
    if pure_fe < -1e-10:
        raise ValueError("Infeasible charge: DyFe/FeB carrier iron exceeds the target Fe")
    add("Fe-metal", max(0, pure_fe), {"Fe": 1})
    for e, fraction in fractions.items():
        if e not in ("Nd", "Pr", "Dy", "Fe", "B"):
            add(e + "-metal", fraction, {e: 1})
    if abs(sum(products.values()) - 1) > 1e-8:
        raise ValueError("Feedstock charge does not close to one tonne of target alloy")
    return {"unit": "tonnes of purchased metal/master-alloy product per tonne of target alloy", "products_tonnes_per_tonne_alloy": products, "product_element_mass_fractions": assays, "carrier_fe_tonnes_per_tonne_alloy": {"DyFe": dy_quantity * dyfe["Fe"], "FeB": b_quantity * feb["Fe"]}, "target_element_mass_fractions": fractions, "basis": "Ideal complete nominal assays; no impurities or element-specific retention. Stage losses are separate assumed flows. Not a factory recipe or purchase record."}


def simulate_chain(config: dict | None = None, _include_reference=True) -> dict:
    """Monthly downstream-first queues, finite physical stocks and element closure."""
    c = _config(config)
    recipe = _recipe(c)
    plan = _feedstock_plan(c, recipe)
    fractions = plan["target_element_mass_fractions"]
    elements = tuple(fractions)
    rare = tuple(e for e in elements if e in REE)
    nonrare = tuple(e for e in elements if e not in REE)
    charge = plan["products_tonnes_per_tonne_alloy"]
    assays = plan["product_element_mass_fractions"]
    zero = lambda: {e: 0.0 for e in elements}
    demand = c["annual_demand_tonnes"] / 12
    supply_reference = c["supply_reference_annual_tonnes"] / 12
    y, leads = c["stage_yields"], c["lead_months"]
    # The physical system is anchored independently of consumption. Changing
    # demand may change production requests, but cannot create larger plants,
    # initial inventories or in-transit batches.
    normal_product = {"qualification": supply_reference, "magnets": supply_reference / y["qualification"], "metals": supply_reference / y["qualification"] / y["magnets"]}
    demand_product = {"qualification": demand, "magnets": demand / y["qualification"], "metals": demand / y["qualification"] / y["magnets"]}
    separation = {e: fractions[e] * normal_product["metals"] / y["metals"] for e in rare}
    raw = {e: separation[e] / y["separation"] for e in rare}
    nonree = {e: fractions[e] * normal_product["metals"] / y["metals"] for e in nonrare}
    normal_quantities = {"resource": raw, "separation": separation, "nonree-inputs": nonree, "metals": {p: amount * normal_product["metals"] for p, amount in charge.items()}, "magnets": {"magnet": normal_product["magnets"]}, "qualification": {"magnet": supply_reference}}
    demand_separation = {e: fractions[e] * demand_product["metals"] / y["metals"] for e in rare}
    demand_raw = {e: demand_separation[e] / y["separation"] for e in rare}
    demand_nonree = {e: fractions[e] * demand_product["metals"] / y["metals"] for e in nonrare}

    def to_elements(destination, quantities):
        output = zero()
        if destination in ("raw", "separated", "nonree"):
            for e, amount in quantities.items():
                output[e] += amount
        elif destination == "feedstocks":
            for p, amount in quantities.items():
                for e, fraction in assays[p].items():
                    if e in output:
                        output[e] += amount * fraction
        else:
            for e in elements:
                output[e] = quantities.get("magnet", 0) * fractions[e]
        return output

    stocks = {DESTINATION[stage]: {p: amount * c["inventory_months"][DESTINATION[stage]] for p, amount in normal_quantities[stage].items()} for stage in STAGES}
    queue = {stage: ([{"due_month": i + 1, "quantities": dict(normal_quantities[stage])} for i in range(leads[stage])] if c["initial_pipeline_mode"] == "warm" else []) for stage in STAGES}
    queue["policy-inventory"] = []

    def pending(stage):
        quantities = {}
        for item in queue[stage]:
            for p, amount in item["quantities"].items():
                quantities[p] = quantities.get(p, 0) + amount
        return quantities

    def stored_elements():
        total = zero()
        for destination, quantities in stocks.items():
            for e, amount in to_elements(destination, quantities).items(): total[e] += amount
        for stage in queue:
            for e, amount in to_elements(DESTINATION[stage], pending(stage)).items(): total[e] += amount
        return total

    def pack(stage, quantities):
        return {"unit": UNITS[stage], "output_tonnes": sum(quantities.values()), "elements_tonnes": to_elements(DESTINATION[stage], quantities), "products_tonnes": dict(quantities)}

    initial = stored_elements()
    initial_stock_elements = zero()
    for destination, quantities in stocks.items():
        for e, amount in to_elements(destination, quantities).items(): initial_stock_elements[e] += amount
    initial_pipeline_elements = {e: initial[e] - initial_stock_elements[e] for e in elements}
    initial_state = {"stocks": deepcopy(stocks), "pipeline": {stage: pack(stage, pending(stage)) for stage in queue}, "stock_elements_tonnes": initial_stock_elements, "pipeline_elements_tonnes": initial_pipeline_elements, "stock_total_tracked_elements_tonnes": sum(initial_stock_elements.values()), "pipeline_total_tracked_elements_tonnes": sum(initial_pipeline_elements.values()), "supply_reference_annual_tonnes": c["supply_reference_annual_tonnes"], "pipeline_mode": c["initial_pipeline_mode"], "basis": "Working stocks and optional existing steady-state in-transit material are finite and anchored to the independent supply reference. Empty pipeline plus zero working-stock settings is a true empty start. All initial material is included in the element ledger and is not replenished exogenously."}
    cumulative_external, cumulative_loss, cumulative_delivery = zero(), zero(), zero()
    allocation = {policy: 0.0 for policy in POLICIES[1:5]}
    if c["policy"] == "mix":
        allocation = {policy: c["budget"] * c["mix"][policy] for policy in allocation}
    elif c["policy"] != "none": allocation[c["policy"]] = c["budget"]
    shocks = _shocks(c)
    reference_vector = {stage: {e: amount * (1 + c["capacity_headroom"]) for e, amount in to_elements(DESTINATION[stage], normal_quantities[stage]).items()} for stage in STAGES}
    base_vector = {stage: {e: amount * c["stage_capacity_factors"][stage] for e, amount in vector.items()} for stage, vector in reference_vector.items()}
    rows, backlog, budget_spent, reserve = [], 0.0, 0.0, 0.0
    policy_purchase_tonnes = allocation["finished-inventory"] / c["inventory_cost_per_tonne"]

    def readiness(month):
        info = {}
        for project in PROJECTS:
            commission = c["decision_month"] + c["construction_months"][project]
            qualified = commission + c["project_qualification_months"]
            progress = 0.0 if month < qualified else (1.0 if c["ramp_months"] == 0 else min(1.0, (month - qualified + 1) / c["ramp_months"]))
            state = "not-funded" if allocation[project] == 0 else "not-decided" if month < c["decision_month"] else "construction" if month < commission else "supplier-qualification" if month < qualified else "ramp" if progress < 1 else "ready"
            info[project] = {"budget_credits": allocation[project], "commission_month": commission, "qualification_complete_month": qualified, "full_capacity_month": qualified + max(0, c["ramp_months"] - 1), "ramp_fraction": progress if allocation[project] > 0 else 0.0, "state": state}
        arrival = c["decision_month"] + c["inventory_purchase_lead_months"]
        info["finished-inventory"] = {"budget_credits": allocation["finished-inventory"], "order_month": c["decision_month"], "arrival_month": arrival, "finite_order_tonnes": policy_purchase_tonnes, "state": "not-funded" if allocation["finished-inventory"] == 0 else "not-decided" if month < c["decision_month"] else "in-transit" if month < arrival else "arrived"}
        return info

    for month in range(1, c["horizon_months"] + 1):
        external, losses, delivered_elements = zero(), zero(), zero()
        purchase_arrival = 0.0
        if month == c["decision_month"] and c["policy"] != "none":
            budget_spent = sum(allocation.values())
            if policy_purchase_tonnes > 0:
                queue["policy-inventory"].append({"due_month": month + c["inventory_purchase_lead_months"], "quantities": {"magnet": policy_purchase_tonnes}})
                for e in elements: external[e] += policy_purchase_tonnes * fractions[e]
        for stage in queue:
            mature = [item for item in queue[stage] if item["due_month"] <= month]
            queue[stage] = [item for item in queue[stage] if item["due_month"] > month]
            for item in mature:
                for p, amount in item["quantities"].items(): stocks[DESTINATION[stage]][p] = stocks[DESTINATION[stage]].get(p, 0) + amount
                if stage == "policy-inventory": purchase_arrival += item["quantities"]["magnet"]
        reserve += purchase_arrival
        backlog += demand
        delivery = min(backlog, stocks["qualified"].get("magnet", 0))
        backlog = max(0, backlog - delivery)
        stocks["qualified"]["magnet"] -= delivery
        for e in elements: delivered_elements[e] = delivery * fractions[e]
        projects = readiness(month)
        regional, capacity_vectors, capacity = {}, {}, {}
        active_shocks = [s for s in shocks if s["start_month"] <= month < s["start_month"] + s["duration_months"]]
        for stage in STAGES:
            regional[stage] = {"China": zero(), "Independent": zero()}
            shift = min(c["china_share"][stage], allocation["upstream-diversification"] / c["cost_per_capacity_fraction"]["upstream-diversification"]) * projects["upstream-diversification"]["ramp_fraction"] if stage == "resource" else 0
            project = "processing" if stage in ("separation", "metals") else "magnets-qualification" if stage in ("magnets", "qualification") else None
            addition = allocation[project] / c["cost_per_capacity_fraction"][project] * projects[project]["ramp_fraction"] if project else 0
            for e, amount in base_vector[stage].items():
                regional[stage]["China"][e] = amount * (c["china_share"][stage] - shift)
                regional[stage]["Independent"][e] = amount * (1 - c["china_share"][stage] + shift) + reference_vector[stage][e] * addition
            for shock in active_shocks:
                if shock["stage"] != stage: continue
                affected = elements if shock["element"] == "all" else ("Nd", "Pr") if shock["element"] == "NdPr" else (shock["element"],)
                for region in regional[stage]:
                    if shock["region"] not in ("all", region): continue
                    for e in affected:
                        if e in regional[stage][region]: regional[stage][region][e] *= shock["retention"]
            capacity_vectors[stage] = {e: sum(v[e] for v in regional[stage].values()) for e in elements}
            if stage in normal_product:
                total = min(capacity_vectors[stage][e] / fractions[e] for e in elements)
                quantities = {"magnet": total} if stage != "metals" else {p: total * amount for p, amount in charge.items()}
            else: quantities = {e: capacity_vectors[stage][e] for e in rare if stage != "nonree-inputs"} if stage != "nonree-inputs" else {e: capacity_vectors[stage][e] for e in nonrare}
            capacity[stage] = pack(stage, quantities)
        throughput = {}
        constraints = {}

        def enqueue(stage, quantities, input_elements=None):
            output_elements = to_elements(DESTINATION[stage], quantities)
            if input_elements is not None:
                for e in elements: losses[e] += max(0, input_elements.get(e, 0) - output_elements[e])
            queue[stage].append({"due_month": month + leads[stage], "quantities": dict(quantities)})
            throughput[stage] = pack(stage, quantities)

        # Downstream first. Everything made this month enters a positive-lead
        # queue, so no new resource, oxide, alloy or magnet jumps the pipeline.
        target = backlog + demand * (leads["qualification"] + c["inventory_months"]["qualified"]) + reserve
        desired = max(0, target - stocks["qualified"].get("magnet", 0) - pending("qualification").get("magnet", 0))
        available = stocks["unqualified"].get("magnet", 0) * y["qualification"]
        output = min(desired, capacity["qualification"]["output_tonnes"], available)
        consumed = output / y["qualification"]
        stocks["unqualified"]["magnet"] -= consumed
        constraints["qualification"] = "capacity" if output + 1e-9 < desired and capacity["qualification"]["output_tonnes"] <= available else "inputs" if output + 1e-9 < desired else "forecast-target"
        enqueue("qualification", {"magnet": output}, {e: consumed * fractions[e] for e in elements})

        backlog_months = backlog / demand if demand > 0 else 0
        target = demand_product["magnets"] * (leads["magnets"] + c["inventory_months"]["unqualified"] + backlog_months)
        desired = max(0, target - stocks["unqualified"].get("magnet", 0) - pending("magnets").get("magnet", 0))
        available = min(stocks["feedstocks"].get(p, 0) / amount * y["magnets"] for p, amount in charge.items())
        output = min(desired, capacity["magnets"]["output_tonnes"], available)
        consumed = {p: output / y["magnets"] * amount for p, amount in charge.items()}
        for p, amount in consumed.items(): stocks["feedstocks"][p] = max(0, stocks["feedstocks"].get(p, 0) - amount)
        constraints["magnets"] = "capacity" if output + 1e-9 < desired and capacity["magnets"]["output_tonnes"] <= available else "inputs" if output + 1e-9 < desired else "forecast-target"
        enqueue("magnets", {"magnet": output}, to_elements("feedstocks", consumed))

        target = demand_product["metals"] * (leads["metals"] + c["inventory_months"]["feedstocks"] + backlog_months)
        stored_baskets = min((stocks["feedstocks"].get(p, 0) + pending("metals").get(p, 0)) / amount for p, amount in charge.items())
        desired = max(0, target - stored_baskets)
        available = min(stocks["separated" if e in REE else "nonree"].get(e, 0) * y["metals"] / fractions[e] for e in elements)
        output = min(desired, capacity["metals"]["output_tonnes"], available)
        consumed = {e: output * fractions[e] / y["metals"] for e in elements}
        for e, amount in consumed.items():
            destination = "separated" if e in REE else "nonree"
            stocks[destination][e] = max(0, stocks[destination].get(e, 0) - amount)
        constraints["metals"] = "capacity" if output + 1e-9 < desired and capacity["metals"]["output_tonnes"] <= available else "inputs" if output + 1e-9 < desired else "forecast-target"
        enqueue("metals", {p: output * amount for p, amount in charge.items()}, consumed)

        sep_output, sep_consumed = {}, zero()
        sep_constraints = []
        for e in rare:
            target = demand_separation[e] * (leads["separation"] + c["inventory_months"]["separated"] + backlog_months)
            desired = max(0, target - stocks["separated"].get(e, 0) - pending("separation").get(e, 0))
            available = stocks["raw"].get(e, 0) * y["separation"]
            output = min(desired, capacity_vectors["separation"][e], available)
            sep_consumed[e] = output / y["separation"]
            stocks["raw"][e] = max(0, stocks["raw"].get(e, 0) - sep_consumed[e])
            sep_output[e] = output
            if output + 1e-9 < desired: sep_constraints.append("capacity" if capacity_vectors["separation"][e] <= available else "inputs")
        constraints["separation"] = "capacity" if "capacity" in sep_constraints else "inputs" if sep_constraints else "forecast-target"
        enqueue("separation", sep_output, sep_consumed)

        for stage, target_normal in (("resource", demand_raw), ("nonree-inputs", demand_nonree)):
            outputs, inputs = {}, zero()
            hit_capacity = False
            for e, normal in target_normal.items():
                destination = DESTINATION[stage]
                target = normal * (leads[stage] + c["inventory_months"][destination] + backlog_months)
                desired = max(0, target - stocks[destination].get(e, 0) - pending(stage).get(e, 0))
                outputs[e] = min(desired, capacity_vectors[stage][e])
                inputs[e] = outputs[e] / y[stage]
                external[e] += inputs[e]
                hit_capacity = hit_capacity or outputs[e] + 1e-9 < desired
            constraints[stage] = "capacity" if hit_capacity else "forecast-target"
            enqueue(stage, outputs, inputs)

        for e in elements:
            cumulative_external[e] += external[e]
            cumulative_loss[e] += losses[e]
            cumulative_delivery[e] += delivered_elements[e]
        total = stored_elements()
        balance = {e: initial[e] + cumulative_external[e] - cumulative_loss[e] - cumulative_delivery[e] - total[e] for e in elements}
        bottleneck = None
        if backlog > 1e-8:
            capacity_ratios = {stage: min(capacity_vectors[stage][e] / amount for e, amount in to_elements(DESTINATION[stage], normal_quantities[stage]).items() if amount > 0) for stage in STAGES if any(normal_quantities[stage].values())}
            constrained = [stage for stage in capacity_ratios if capacity_ratios[stage] < 1 - 1e-8]
            bottleneck = min(constrained, key=lambda stage: capacity_ratios[stage]) if constrained else next((stage for stage in ("separation", "metals", "magnets", "qualification") if constraints[stage] == "inputs"), "pipeline-delay")
        regional_packed = {stage: {region: {"unit": UNITS[stage], "elements_tonnes": vector, "contained_elements_total_tonnes": sum(vector.values())} for region, vector in regions.items()} for stage, regions in regional.items()}
        rows.append({"month": month, "demand_tonnes": demand, "delivered_usable_tonnes": delivery, "backlog_tonnes": backlog, "stocks": deepcopy(stocks), "pipeline": {stage: pack(stage, pending(stage)) for stage in queue}, "stored_elements_tonnes": total, "throughput": throughput, "capacity": capacity, "regional_capacity": regional_packed, "binding_constraints": constraints, "external_input_elements_tonnes": external, "losses_elements_tonnes": losses, "delivered_elements_tonnes": delivered_elements, "cumulative_external_input_elements_tonnes": dict(cumulative_external), "cumulative_losses_elements_tonnes": dict(cumulative_loss), "cumulative_delivered_elements_tonnes": dict(cumulative_delivery), "balance_residual_elements_tonnes": balance, "project_readiness": projects, "policy_inventory_arrival_tonnes": purchase_arrival, "policy_budget_spent": budget_spent, "active_shocks": active_shocks, "bottleneck_stage": bottleneck, "separated_oxide_equivalent_tonnes": {e: stocks["separated"].get(e, 0) * OXIDE_FACTORS[e] for e in rare if e in OXIDE_FACTORS}})

    total_demand = demand * c["horizon_months"]
    total_delivered = sum(row["delivered_usable_tonnes"] for row in rows)
    short = any(row["backlog_tonnes"] > 1e-8 for row in rows)
    shock_end = max((s["start_month"] + s["duration_months"] - 1 for s in shocks if s["duration_months"] > 0), default=0)
    recovery = next((row["month"] for i, row in enumerate(rows) if row["month"] > shock_end and row["backlog_tonnes"] <= 1e-8 and all(later["backlog_tonnes"] <= 1e-8 for later in rows[i:])), None) if short else None
    bottlenecks = [row["bottleneck_stage"] for row in rows if row["bottleneck_stage"]]
    main_bottleneck = max(set(bottlenecks), key=lambda stage: (bottlenecks.count(stage), -((STAGES + ("pipeline-delay",)).index(stage)))) if bottlenecks else None
    deadline_rows = rows[:c["deadline_month"]]
    residual = max(abs(value) for row in rows for value in row["balance_residual_elements_tonnes"].values())
    metrics = {"demand_tonnes": total_demand, "delivered_usable_tonnes": total_delivered, "unmet_qualified_tonnes": backlog, "backlog_tonne_months": sum(row["backlog_tonnes"] for row in rows), "service_fraction": total_delivered / total_demand if total_demand else 1.0, "first_backlog_month": next((row["month"] for row in rows if row["backlog_tonnes"] > 1e-8), None), "recovery_month": recovery, "recovery_status": "no-delivery-shortage" if not short else "recovered" if recovery is not None else "not-recovered-within-horizon", "bottleneck_stage": main_bottleneck, "policy_budget_spent": budget_spent, "budget_allocation": allocation, "finite_inventory_order_tonnes": policy_purchase_tonnes, "project_readiness": rows[-1]["project_readiness"], "deadline": {"month": c["deadline_month"], "demand_tonnes": demand * c["deadline_month"], "delivered_usable_tonnes": sum(row["delivered_usable_tonnes"] for row in deadline_rows), "unmet_qualified_tonnes": deadline_rows[-1]["backlog_tonnes"], "backlog_tonne_months": sum(row["backlog_tonnes"] for row in deadline_rows)}}
    evidence = _evidence()
    topology = {"stages": [{"id": stage, "output_unit": UNITS[stage], **evidence["stage_context"][stage]} for stage in STAGES], "links": [{"from": a, "to": b, "status": "hypothetical process link; no specimen provenance or operating shipment established"} for a, b in (("resource", "separation"), ("separation", "metals"), ("nonree-inputs", "metals"), ("metals", "magnets"), ("magnets", "qualification"), ("qualification", "application"))], "application": {"label": c["application_label"], "status": "assumed generic demand endpoint; no grade-specific suitability claim"}}
    result = {"schema_version": 1, "config": c, "recipe": recipe, "feedstock_plan": plan, "topology": topology, "map_context": deepcopy(c["map_context"]), "monthly": rows, "metrics": metrics, "stock_units": {"raw": UNITS["resource"], "separated": UNITS["separation"], "nonree": UNITS["nonree-inputs"], "feedstocks": UNITS["metals"], "unqualified": UNITS["magnets"], "qualified": UNITS["qualification"]}, "audit": {"initial_elements_tonnes": initial, "external_input_elements_tonnes": cumulative_external, "losses_elements_tonnes": cumulative_loss, "delivered_elements_tonnes": cumulative_delivery, "final_elements_tonnes": stored_elements(), "max_abs_balance_residual_tonnes": residual, "material_balance_pass": residual < 1e-7, "nonnegative_stocks": all(amount >= -1e-9 for row in rows for quantities in row["stocks"].values() for amount in quantities.values()), "demand_ledger_residual_tonnes": total_demand - total_delivered - backlog, "definition": "initial tracked elements + actual external inputs (including one paid finite product order) = delivered elements + process/rejection losses + ending stocks and pipeline", "oxide_boundary": "Oxide equivalents use Nd2O3, Pr6O11, Dy2O3 or Tb4O7. Oxygen added/removed is a stoichiometric reference, not a mined/product flow; mineral matrix, reagents, gases and impurities are outside element closure."}, "evidence": {"as_of": evidence["as_of"], "scope": evidence["scope"], "boundaries": evidence["boundaries"]}}

    metrics["disruption_stages"] = sorted({s["stage"] for s in shocks if s["duration_months"] > 0})
    metrics["budget_scope"] = "Scenario credits cover intervention commitments only: capacity bundles and one external finished-stock order. Ordinary procurement, operating costs, energy, financing and full commodity-price accounting are excluded."
    metrics["bottleneck_basis"] = "Indicative contemporaneous constraint during backlog. Pipeline-delay means earlier missing output is still propagating after capacities recover; it is not a historical root-cause attribution."
    for stage in result["topology"]["stages"]:
        supplied = (c["map_context"] or {}).get("stage_refs", {}).get(stage["id"])
        stage["selected_context_node_refs"] = supplied if isinstance(supplied, list) and all(isinstance(ref, str) for ref in supplied) else list(stage["map_node_refs"])
    result["initial_state"] = initial_state
    if _include_reference:
        reference_result = simulate_chain(dict(c, shock_duration_months=0, additional_shocks=[]), _include_reference=False)
        reference = reference_result["metrics"]
        result["counterfactual"] = {
            "basis": "Same policy, recipe, decision, initial ledger, capacities, yields, deadline and horizon; all shocks disabled. Values are scenario differences, not empirically estimated causal effects.",
            "no_shock_metrics": reference,
            "no_shock_monthly": [{key: row[key] for key in ("month", "demand_tonnes", "delivered_usable_tonnes", "backlog_tonnes")} for row in reference_result["monthly"]],
            "shock_increment_unmet_qualified_tonnes": metrics["unmet_qualified_tonnes"] - reference["unmet_qualified_tonnes"],
            "shock_increment_backlog_tonne_months": metrics["backlog_tonne_months"] - reference["backlog_tonne_months"],
            "deadline_shock_increment_unmet_qualified_tonnes": metrics["deadline"]["unmet_qualified_tonnes"] - reference["deadline"]["unmet_qualified_tonnes"],
        }
        metrics["deadline_no_shock_unmet_qualified_tonnes"] = reference["deadline"]["unmet_qualified_tonnes"]
        metrics["deadline_shock_increment_unmet_qualified_tonnes"] = result["counterfactual"]["deadline_shock_increment_unmet_qualified_tonnes"]
        metrics["no_shock_unmet_qualified_tonnes"] = reference["unmet_qualified_tonnes"]
        metrics["shock_increment_unmet_qualified_tonnes"] = result["counterfactual"]["shock_increment_unmet_qualified_tonnes"]
        metrics["no_shock_backlog_tonne_months"] = reference["backlog_tonne_months"]
        metrics["shock_increment_backlog_tonne_months"] = result["counterfactual"]["shock_increment_backlog_tonne_months"]
    return result



def compare_chain(config: dict | None = None) -> dict:
    """Same deadline/decision/horizon and abstract budget; no empirical ranking."""
    c = _config(config)
    runs = {policy: simulate_chain(dict(c, policy=policy)) for policy in POLICIES}
    reference = runs["none"]["metrics"]
    comparison = [{"policy": policy, **result["metrics"], "avoided_backlog_tonne_months": reference["backlog_tonne_months"] - result["metrics"]["backlog_tonne_months"], "avoided_unmet_qualified_tonnes": reference["unmet_qualified_tonnes"] - result["metrics"]["unmet_qualified_tonnes"]} for policy, result in runs.items()]
    return {"config": c, "comparison": comparison, "runs": runs, "ranking_basis": "same-budget scenario backlog tonne-months and qualified tonnes by the common deadline; not an optimized or empirical dollar ranking", "limitations": _evidence()["boundaries"] + ["Regional pools are generic and fungible. Named map references do not receive a modeled capacity, recipe assignment, customer, or shipment.", "Uniform stage losses and assumed qualification throughput do not predict magnetic properties or cross-grade substitution.", "The processing and magnet/qualification interventions each buy an explicitly assumed complementary bundle at one abstract cost per capacity fraction."]}
