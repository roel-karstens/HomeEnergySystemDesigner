from __future__ import annotations

from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import settings
from .schemas.analysis import (
    AnalyzeRequest,
    AnalyzeResponse,
    ApiMutationResponse,
    EnergyProfileInput,
    ExplainabilityResponse,
    FinancialAnalysisResponse,
    HomeInput,
    OptimizationResponse,
    RecommendationResponse,
    ScenariosResponse,
    SimulationResponse,
    SystemConfigurationInput,
    ValidateResponse,
    ValidationIssue,
)
from .services.analysis_service import (
    build_explainability,
    build_financial_analysis,
    build_optimization,
    build_recommendation,
    build_scenarios,
    get_simulation,
    run_analysis,
    run_simulation,
)

app = FastAPI(title=settings.app_display_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.frontend_origins),
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(f"{settings.api_prefix}/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_slug}


@app.post(f"{settings.api_prefix}/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    return run_analysis(payload)


@app.post(f"{settings.api_prefix}/home", response_model=ApiMutationResponse)
def set_home(payload: HomeInput) -> ApiMutationResponse:
    return ApiMutationResponse(message=f"Home input accepted for type '{payload.home_type}'.")


@app.post(f"{settings.api_prefix}/energy-profile", response_model=ApiMutationResponse)
def set_energy_profile(payload: EnergyProfileInput) -> ApiMutationResponse:
    return ApiMutationResponse(
        message=(
            "Energy profile accepted "
            f"({payload.annual_household_kwh:.0f} kWh household / {payload.annual_heat_demand_kwh:.0f} kWh heat)."
        )
    )


@app.post(f"{settings.api_prefix}/configuration", response_model=ApiMutationResponse)
def set_configuration(payload: SystemConfigurationInput) -> ApiMutationResponse:
    return ApiMutationResponse(
        message=(
            "Configuration accepted "
            f"(solar={payload.solar.status}, heat_pump={payload.heat_pump.status}, "
            f"ev={payload.ev.status}, battery={payload.battery.status})."
        )
    )


@app.post(f"{settings.api_prefix}/validate", response_model=ValidateResponse)
def validate(payload: AnalyzeRequest) -> ValidateResponse:
    issues: list[ValidationIssue] = []
    if payload.solar.status != "excluded" and payload.solar.panel_count == 0:
        issues.append(
            ValidationIssue(
                code="SOLAR_PANEL_COUNT_INVALID",
                message="Solar status requires at least one panel.",
                field="solar.panel_count",
            )
        )
    if payload.heat_pump.status != "excluded" and payload.heat_pump.seasonal_cop < 2.0:
        issues.append(
            ValidationIssue(
                code="HEAT_PUMP_COP_LOW",
                message="Seasonal COP under 2.0 is likely unrealistic for this flow.",
                field="heat_pump.seasonal_cop",
            )
        )
    if payload.ev.status != "excluded" and payload.ev.annual_km == 0:
        issues.append(
            ValidationIssue(
                code="EV_KM_MISSING",
                message="EV is enabled but annual_km is zero.",
                field="ev.annual_km",
            )
        )

    return ValidateResponse(valid=not issues, issues=issues)


@app.post(f"{settings.api_prefix}/simulation", response_model=SimulationResponse)
def simulation(payload: AnalyzeRequest) -> SimulationResponse:
    return run_simulation(payload)


@app.post(f"{settings.api_prefix}/optimization", response_model=OptimizationResponse)
def optimization(payload: AnalyzeRequest) -> OptimizationResponse:
    return build_optimization(payload)


@app.post(f"{settings.api_prefix}/scenarios", response_model=ScenariosResponse)
def scenarios(payload: AnalyzeRequest) -> ScenariosResponse:
    return build_scenarios(payload)


@app.post(f"{settings.api_prefix}/financial-analysis", response_model=FinancialAnalysisResponse)
def financial_analysis(payload: AnalyzeRequest) -> FinancialAnalysisResponse:
    return build_financial_analysis(payload)


@app.post(f"{settings.api_prefix}/explainability", response_model=ExplainabilityResponse)
def explainability(payload: AnalyzeRequest) -> ExplainabilityResponse:
    return build_explainability(payload)


@app.get(f"{settings.api_prefix}/results/{{analysis_id}}", response_model=SimulationResponse)
def get_results(analysis_id: UUID) -> SimulationResponse:
    simulation = get_simulation(analysis_id)
    if simulation is None:
        raise HTTPException(status_code=404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found."})
    return simulation


@app.get(f"{settings.api_prefix}/recommendation/{{analysis_id}}", response_model=RecommendationResponse)
def get_recommendation(analysis_id: UUID) -> RecommendationResponse:
    recommendation = build_recommendation(analysis_id)
    if recommendation is None:
        raise HTTPException(status_code=404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found."})
    return recommendation
