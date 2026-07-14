from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

ComponentStatus = Literal["fixed", "optimize", "excluded"]
OptimizationObjective = Literal["financial", "independence", "balanced"]
ContractType = Literal["fixed", "variable", "dynamic"]
ChargingStrategy = Literal["normal", "smart", "v2g"]


class HomeInput(BaseModel):
    home_type: str = Field(default="detached")
    construction_year: int = Field(default=2020, ge=1900, le=2100)
    surface_area_m2: float = Field(default=140.0, gt=20.0, le=1000.0)
    residents: int = Field(default=3, ge=1, le=12)
    energy_label: str = Field(default="A")
    location: str = Field(default="Netherlands")


class SolarInput(BaseModel):
    status: ComponentStatus = "optimize"
    panel_count: int = Field(default=12, ge=0, le=60)
    panel_power_wp: int = Field(default=420, ge=200, le=800)


class HeatPumpInput(BaseModel):
    status: ComponentStatus = "fixed"
    annual_heat_demand_kwh: float = Field(default=10000.0, ge=0.0, le=50000.0)
    seasonal_cop: float = Field(default=4.0, gt=1.0, le=7.0)


class EVInput(BaseModel):
    status: ComponentStatus = "excluded"
    annual_km: float = Field(default=12000.0, ge=0.0, le=100000.0)
    consumption_kwh_per_km: float = Field(default=0.18, gt=0.05, le=0.5)
    charging_strategy: ChargingStrategy = "normal"


class BatteryInput(BaseModel):
    status: ComponentStatus = "excluded"
    capacity_kwh: float = Field(default=8.0, ge=0.0, le=40.0)
    roundtrip_efficiency: float = Field(default=0.92, gt=0.5, le=1.0)


class EnergyProfileInput(BaseModel):
    annual_household_kwh: float = Field(default=3500.0, ge=0.0, le=25000.0)
    annual_heat_demand_kwh: float = Field(default=10000.0, ge=0.0, le=50000.0)
    annual_km: float = Field(default=12000.0, ge=0.0, le=100000.0)


class OptimizationSettingsInput(BaseModel):
    objective: OptimizationObjective = "balanced"
    preferred_contract: ContractType = "variable"
    max_budget_eur: float = Field(default=12000.0, ge=0.0, le=200000.0)
    min_self_sufficiency_ratio: float = Field(default=0.45, ge=0.0, le=1.0)


class SystemConfigurationInput(BaseModel):
    solar: SolarInput = Field(default_factory=SolarInput)
    heat_pump: HeatPumpInput = Field(default_factory=HeatPumpInput)
    ev: EVInput = Field(default_factory=EVInput)
    battery: BatteryInput = Field(default_factory=BatteryInput)


class AnalyzeRequest(BaseModel):
    home: HomeInput = Field(default_factory=HomeInput)
    energy_profile: EnergyProfileInput = Field(default_factory=EnergyProfileInput)
    solar: SolarInput = Field(default_factory=SolarInput)
    heat_pump: HeatPumpInput = Field(default_factory=HeatPumpInput)
    ev: EVInput = Field(default_factory=EVInput)
    battery: BatteryInput = Field(default_factory=BatteryInput)
    optimization: OptimizationSettingsInput = Field(default_factory=OptimizationSettingsInput)
    goal: OptimizationObjective = "balanced"


class AnalyzeResponse(BaseModel):
    recommendation: str
    reasons: list[str]
    annual_pv_kwh: float
    annual_heat_pump_kwh: float
    annual_ev_kwh: float
    annual_battery_shifted_kwh: float
    annual_household_kwh: float
    annual_total_demand_kwh: float
    annual_grid_import_kwh: float
    self_sufficiency_ratio: float
    estimated_grid_co2_kg: float
    annual_grid_kwh_for_heat_pump: float
    annual_cost_eur_for_heat_pump: float


class ApiMessage(BaseModel):
    code: str
    message: str
    field: str | None = None


class ApiMutationResponse(BaseModel):
    accepted: bool = True
    message: str


class ValidationIssue(BaseModel):
    code: str
    message: str
    field: str | None = None


class ValidateResponse(BaseModel):
    valid: bool
    issues: list[ValidationIssue]


class SimulationResponse(BaseModel):
    analysis_id: UUID
    created_at: datetime
    result: AnalyzeResponse


class ScenarioItem(BaseModel):
    name: str
    panel_count: int
    annual_pv_kwh: float
    annual_grid_import_kwh: float
    self_sufficiency_ratio: float
    annual_cost_eur_for_heat_pump: float


class ScenariosResponse(BaseModel):
    scenarios: list[ScenarioItem]


class FinancialAnalysisResponse(BaseModel):
    analysis_id: UUID
    contract_type: ContractType
    grid_buy_price_eur_per_kwh: float
    feed_in_price_eur_per_kwh: float
    annual_energy_cost_eur: float
    annual_savings_vs_baseline_eur: float
    simple_payback_years: float | None


class ConstraintResult(BaseModel):
    name: str
    target: float
    actual: float
    met: bool

class OptimizationResponse(BaseModel):
    objective: OptimizationObjective
    recommendation: str
    actions: list[str]
    constraint_results: list[ConstraintResult]


class RecommendationResponse(BaseModel):
    analysis_id: UUID
    recommendation: str
    reasons: list[str]
    next_steps: list[str]


class ExplainabilityResponse(BaseModel):
    assumptions: list[str]
    sensitivities: list[str]
    confidence_note: str
