from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID, uuid4

from home_energy.domain import HeatPumpConfig, PVSegment
from home_energy.heat_pump import simulate_heat_pump, simulate_heat_pump_interaction
from home_energy.solar import simulate_pv_system

from ..schemas.analysis import (
    AnalyzeRequest,
    AnalyzeResponse,
    ExplainabilityResponse,
    FinancialAnalysisResponse,
    OptimizationResponse,
    RecommendationResponse,
    ScenarioItem,
    ScenariosResponse,
    SimulationResponse,
    ConstraintResult,
)

_SIMULATION_RESULTS: dict[UUID, SimulationResponse] = {}


def _contract_prices(contract_type: str) -> tuple[float, float]:
    if contract_type == "fixed":
        return 0.33, 0.07
    if contract_type == "dynamic":
        return 0.26, 0.05
    return 0.30, 0.08


def _adjusted_heat_demand_from_home(payload: AnalyzeRequest) -> float:
    """Estimate a home-profile adjusted heat demand from provided baseline input."""
    base_demand = payload.heat_pump.annual_heat_demand_kwh

    home_type_factor = {
        "detached": 1.10,
        "semi-detached": 1.03,
        "terraced": 0.98,
        "apartment": 0.90,
    }.get(payload.home.home_type, 1.0)

    label_factor = {
        "A": 0.82,
        "B": 0.90,
        "C": 1.00,
        "D": 1.08,
        "E": 1.16,
        "F": 1.24,
        "G": 1.32,
    }.get(payload.home.energy_label.upper(), 1.0)

    surface_reference = 140.0
    surface_factor = max(0.75, min(1.35, payload.home.surface_area_m2 / surface_reference))

    adjusted_demand = base_demand * home_type_factor * label_factor * surface_factor
    return max(0.0, adjusted_demand)


def run_analysis(payload: AnalyzeRequest) -> AnalyzeResponse:
    panel_count = payload.solar.panel_count if payload.solar.status != "excluded" else 0
    pv_capacity_kwp = (panel_count * payload.solar.panel_power_wp) / 1000.0
    annual_ev_kwh = 0.0
    annual_battery_shifted_kwh = 0.0

    annual_pv_kwh = 0.0
    pv_hourly_kwh: list[float] | None = None
    if pv_capacity_kwp > 0.0:
        pv_result = simulate_pv_system(
            [
                PVSegment(
                    name="Main roof",
                    capacity_kwp=pv_capacity_kwp,
                    azimuth_deg=180.0,
                    tilt_deg=35.0,
                )
            ]
        )
        annual_pv_kwh = pv_result.total_annual_kwh
        pv_hourly_kwh = pv_result.total_hourly_kwh

    heat_pump_enabled = payload.heat_pump.status != "excluded"
    adjusted_heat_demand = _adjusted_heat_demand_from_home(payload)
    hp_result = simulate_heat_pump(
        HeatPumpConfig(
            enabled=heat_pump_enabled,
            annual_heat_demand_kwh=adjusted_heat_demand,
            seasonal_cop=payload.heat_pump.seasonal_cop,
        )
    )

    hp_interaction = simulate_heat_pump_interaction(
        hp_result,
        pv_hourly_kwh=pv_hourly_kwh,
        default_price_eur_per_kwh=0.30,
    )

    if payload.ev.status != "excluded":
        annual_ev_kwh = payload.ev.annual_km * payload.ev.consumption_kwh_per_km

    if payload.battery.status != "excluded":
        annual_battery_shifted_kwh = min(
            annual_pv_kwh * 0.35,
            payload.battery.capacity_kwh * 220.0 * payload.battery.roundtrip_efficiency,
        )

    annual_household_kwh = payload.energy_profile.annual_household_kwh
    annual_total_demand_kwh = annual_household_kwh + hp_result.annual_electricity_kwh + annual_ev_kwh
    annual_pv_direct_use_kwh = min(annual_total_demand_kwh, annual_pv_kwh)
    annual_grid_import_kwh = max(0.0, annual_total_demand_kwh - annual_pv_direct_use_kwh - annual_battery_shifted_kwh)
    self_sufficiency_ratio = (
        max(0.0, min(1.0, 1.0 - (annual_grid_import_kwh / annual_total_demand_kwh)))
        if annual_total_demand_kwh > 0.0
        else 0.0
    )
    estimated_grid_co2_kg = annual_grid_import_kwh * 0.35

    reasons = [
        "Webapp-first analyze flow draait op dezelfde backend domeinlogica als notebooks.",
        "Resultaat gebruikt expliciete aannames voor prijzen en componentstatussen.",
        "Zelfvoorzieningsratio is indicatief en bedoeld voor scenariovergelijking.",
    ]
    recommendation = (
        f"Advies: {panel_count} panelen, doel '{payload.goal}', "
        f"woningtype '{payload.home.home_type}', warmtepompstatus '{payload.heat_pump.status}'."
    )

    return AnalyzeResponse(
        recommendation=recommendation,
        reasons=reasons,
        annual_pv_kwh=annual_pv_kwh,
        annual_heat_pump_kwh=hp_result.annual_electricity_kwh,
        annual_ev_kwh=annual_ev_kwh,
        annual_battery_shifted_kwh=annual_battery_shifted_kwh,
        annual_household_kwh=annual_household_kwh,
        annual_total_demand_kwh=annual_total_demand_kwh,
        annual_grid_import_kwh=annual_grid_import_kwh,
        self_sufficiency_ratio=self_sufficiency_ratio,
        estimated_grid_co2_kg=estimated_grid_co2_kg,
        annual_grid_kwh_for_heat_pump=hp_interaction.grid_supplied_kwh,
        annual_cost_eur_for_heat_pump=hp_interaction.annual_operating_cost_eur,
    )


def run_simulation(payload: AnalyzeRequest) -> SimulationResponse:
    result = run_analysis(payload)
    simulation = SimulationResponse(
        analysis_id=uuid4(),
        created_at=datetime.now(timezone.utc),
        result=result,
    )
    _SIMULATION_RESULTS[simulation.analysis_id] = simulation
    return simulation


def get_simulation(analysis_id: UUID) -> SimulationResponse | None:
    return _SIMULATION_RESULTS.get(analysis_id)


def build_recommendation(analysis_id: UUID) -> RecommendationResponse | None:
    simulation = get_simulation(analysis_id)
    if simulation is None:
        return None
    return RecommendationResponse(
        analysis_id=analysis_id,
        recommendation=simulation.result.recommendation,
        reasons=simulation.result.reasons,
        next_steps=[
            "Compare at least 3 solar panel scenarios.",
            "Review financial-analysis endpoint for contract sensitivity.",
            "Confirm assumptions with installer and energy contract provider.",
        ],
    )


def build_financial_analysis(payload: AnalyzeRequest, analysis_id: UUID | None = None) -> FinancialAnalysisResponse:
    result = run_analysis(payload)
    buy_price, feed_in_price = _contract_prices(payload.optimization.preferred_contract)
    baseline_heat_pump_cost = result.annual_heat_pump_kwh * buy_price
    annual_feed_in_kwh = max(0.0, result.annual_pv_kwh - result.annual_total_demand_kwh)
    annual_energy_cost = max(
        0.0,
        (result.annual_grid_import_kwh * buy_price) - (annual_feed_in_kwh * feed_in_price),
    )
    annual_savings = max(0.0, baseline_heat_pump_cost - annual_energy_cost)

    investment_estimate = (payload.solar.panel_count * 230.0) + (payload.battery.capacity_kwh * 450.0)
    simple_payback = (investment_estimate / annual_savings) if annual_savings > 0.0 else None

    return FinancialAnalysisResponse(
        analysis_id=analysis_id or uuid4(),
        contract_type=payload.optimization.preferred_contract,
        grid_buy_price_eur_per_kwh=buy_price,
        feed_in_price_eur_per_kwh=feed_in_price,
        annual_energy_cost_eur=annual_energy_cost,
        annual_savings_vs_baseline_eur=annual_savings,
        simple_payback_years=simple_payback,
    )


def build_optimization(payload: AnalyzeRequest) -> OptimizationResponse:
    analysis = run_analysis(payload)
    actions: list[str] = []
    if payload.solar.status != "excluded" and payload.solar.panel_count < 10:
        actions.append("Increase solar panel count to at least 10 for better base yield.")
    if payload.battery.status == "optimize":
        actions.append("Evaluate battery around 8-12 kWh for evening peak shifting.")
    if payload.ev.status == "optimize":
        actions.append("Use smart charging to align EV load with solar production.")
    if not actions:
        actions.append("Current setup is coherent; keep component statuses fixed.")

    estimated_investment = (payload.solar.panel_count * 230.0) + (payload.battery.capacity_kwh * 450.0)
    constraint_results = [
        ConstraintResult(
            name="Budget",
            target=payload.optimization.max_budget_eur,
            actual=estimated_investment,
            met=estimated_investment <= payload.optimization.max_budget_eur,
        ),
        ConstraintResult(
            name="Self sufficiency",
            target=payload.optimization.min_self_sufficiency_ratio,
            actual=analysis.self_sufficiency_ratio,
            met=analysis.self_sufficiency_ratio >= payload.optimization.min_self_sufficiency_ratio,
        ),
    ]

    return OptimizationResponse(
        objective=payload.goal,
        recommendation=f"Optimization objective '{payload.goal}' evaluated.",
        actions=actions,
        constraint_results=constraint_results,
    )


def build_scenarios(payload: AnalyzeRequest) -> ScenariosResponse:
    base_count = payload.solar.panel_count
    candidates = [max(0, base_count - 4), base_count, min(60, base_count + 4)]
    names = ["Conservative", "Base", "Ambitious"]

    items: list[ScenarioItem] = []
    for name, panel_count in zip(names, candidates):
        scenario_payload = payload.model_copy(deep=True)
        scenario_payload.solar.panel_count = panel_count
        result = run_analysis(scenario_payload)
        items.append(
            ScenarioItem(
                name=name,
                panel_count=panel_count,
                annual_pv_kwh=result.annual_pv_kwh,
                annual_grid_import_kwh=result.annual_grid_import_kwh,
                self_sufficiency_ratio=result.self_sufficiency_ratio,
                annual_cost_eur_for_heat_pump=result.annual_cost_eur_for_heat_pump,
            )
        )

    return ScenariosResponse(scenarios=items)


def build_explainability(payload: AnalyzeRequest) -> ExplainabilityResponse:
    analysis = run_analysis(payload)
    assumptions = [
        f"Contract type: {payload.optimization.preferred_contract}.",
        f"Default solar orientation and tilt are used for PV yield estimation.",
        f"Battery shifting assumes capped annual cycles based on capacity and efficiency.",
    ]
    sensitivities = [
        "Heat demand assumptions strongly impact annual grid import.",
        "Panel count has high impact on self-sufficiency and operating cost.",
        "Contract type changes the financial outcome, especially with surplus PV.",
    ]
    confidence_note = (
        "Medium confidence: model is suitable for comparison of options, "
        f"with estimated self-sufficiency around {analysis.self_sufficiency_ratio:.0%}."
    )
    return ExplainabilityResponse(
        assumptions=assumptions,
        sensitivities=sensitivities,
        confidence_note=confidence_note,
    )
