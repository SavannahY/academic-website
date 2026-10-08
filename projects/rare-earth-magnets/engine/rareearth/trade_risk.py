"""Commodity-level trade-risk equations from Cheng et al. (2025).

This implements Methods equations 1-3 independently. It does not reproduce the
paper's complete energy-system index, calibrate U.S. imports, or predict the
probability of a delivery shortage. DOI: 10.1038/s41558-025-02305-1.
"""

from collections.abc import Iterable, Mapping
from math import exp, fsum, isclose, isfinite, log
from numbers import Real


COUNTRIES_IN_PAPER = 236


def _fraction(value: Real, name: str) -> float:
    if isinstance(value, bool) or not isinstance(value, Real):
        raise ValueError(f"{name} must be a finite number between 0 and 1.")
    result = float(value)
    if not isfinite(result) or not 0 <= result <= 1:
        raise ValueError(f"{name} must be a finite number between 0 and 1.")
    return result


def _supplier_values(
    supplier_shares: Iterable[Real] | Mapping[str, Real],
) -> tuple[float, ...]:
    if isinstance(supplier_shares, (str, bytes)):
        raise ValueError("supplier_shares must be a sequence or country-to-share mapping.")
    raw_values = (
        supplier_shares.values()
        if isinstance(supplier_shares, Mapping)
        else supplier_shares
    )
    try:
        return tuple(
            _fraction(value, f"supplier_shares[{index}]")
            for index, value in enumerate(raw_values)
        )
    except TypeError as error:
        raise ValueError("supplier_shares must be a sequence or country-to-share mapping.") from error


def trade_risk(
    import_fraction: Real,
    supplier_shares: Iterable[Real] | Mapping[str, Real],
    domestic_reserve_share: Real,
) -> dict:
    """Return the commodity TRI, concentration, scarcity term, and fixed-n bounds.

    ``supplier_shares`` describes the importing country's foreign suppliers,
    conditional on imports. The shares must sum to one (absolute tolerance
    1e-9), even when imports supply only part of demand. Global producer shares
    are not a substitute. An empty supplier list is permitted only when the
    import fraction is zero; its HHI is returned as zero by convention.

    ``domestic_reserve_share`` is domestic/global known reserves of the same
    commodity. Aggregate rare-earth reserves do not establish Nd/Dy shares.

    The bounds hold import fraction, reserve share, and the number of positive
    import suppliers fixed. They are analytical feasible bounds, not empirical
    confidence intervals, shortage probabilities, or uncertainty estimates.
    """
    imported = _fraction(import_fraction, "import_fraction")
    reserve_share = _fraction(domestic_reserve_share, "domestic_reserve_share")
    shares = _supplier_values(supplier_shares)

    if not shares:
        if imported > 0:
            raise ValueError("Positive imports require supplier shares summing to one.")
        hhi = 0.0
        supplier_count = 0
    else:
        if not isclose(fsum(shares), 1.0, rel_tol=0.0, abs_tol=1e-9):
            raise ValueError("supplier_shares must sum to one; they are not silently normalized.")
        hhi = fsum(share * share for share in shares)
        supplier_count = sum(share > 0 for share in shares)

    # Equivalent to (1 / 236) ** (exp(2) * reserve_share), with stable arithmetic.
    scarcity = exp(-log(COUNTRIES_IN_PAPER) * exp(2.0) * reserve_share)
    tri = imported * hhi + (1.0 - imported) * scarcity

    if imported == 0:
        lower = upper = scarcity
    else:
        lower = imported / supplier_count + (1.0 - imported) * scarcity
        upper = imported + (1.0 - imported) * scarcity

    return {
        "hhi": hhi,
        "domestic_scarcity": scarcity,
        "tri": tri,
        "bounds": {"lower": lower, "upper": upper},
        "supplier_count": supplier_count,
        "import_fraction": imported,
        "domestic_reserve_share": reserve_share,
        "units": "dimensionless index",
        "scope": "commodity-level Methods equations 1-3, not full national TRI",
    }
