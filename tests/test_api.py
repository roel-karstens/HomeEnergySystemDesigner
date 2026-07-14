from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["app"] == "hes"


def test_simulation_and_recommendation_flow() -> None:
    request_payload = {
        "solar": {"status": "optimize", "panel_count": 12, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 10000, "seasonal_cop": 4.0},
        "ev": {
            "status": "optimize",
            "annual_km": 12000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "smart",
        },
        "battery": {"status": "optimize", "capacity_kwh": 8.0, "roundtrip_efficiency": 0.92},
        "goal": "balanced",
    }

    simulation_response = client.post("/api/v1/simulation", json=request_payload)
    assert simulation_response.status_code == 200
    simulation_payload = simulation_response.json()
    analysis_id = simulation_payload["analysis_id"]

    recommendation_response = client.get(f"/api/v1/recommendation/{analysis_id}")
    assert recommendation_response.status_code == 200
    recommendation_payload = recommendation_response.json()
    assert recommendation_payload["analysis_id"] == analysis_id
    assert "Advies" in recommendation_payload["recommendation"]


def test_validation_endpoint_reports_issues() -> None:
    request_payload = {
        "solar": {"status": "optimize", "panel_count": 0, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 10000, "seasonal_cop": 1.8},
        "ev": {
            "status": "optimize",
            "annual_km": 0,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "normal",
        },
        "battery": {"status": "excluded", "capacity_kwh": 0.0, "roundtrip_efficiency": 0.92},
        "goal": "balanced",
    }

    response = client.post("/api/v1/validate", json=request_payload)
    assert response.status_code == 200
    payload = response.json()
    assert payload["valid"] is False
    assert len(payload["issues"]) >= 1


def test_scenarios_endpoint_returns_variants() -> None:
    request_payload = {
        "solar": {"status": "optimize", "panel_count": 12, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 10000, "seasonal_cop": 4.0},
        "ev": {
            "status": "excluded",
            "annual_km": 12000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "normal",
        },
        "battery": {"status": "excluded", "capacity_kwh": 8.0, "roundtrip_efficiency": 0.92},
        "goal": "balanced",
    }

    response = client.post("/api/v1/scenarios", json=request_payload)
    assert response.status_code == 200
    payload = response.json()
    assert "scenarios" in payload
    assert len(payload["scenarios"]) == 3
    assert payload["scenarios"][1]["name"] == "Base"


def test_financial_analysis_endpoint_returns_kpis() -> None:
    request_payload = {
        "solar": {"status": "optimize", "panel_count": 14, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 11000, "seasonal_cop": 4.1},
        "ev": {
            "status": "optimize",
            "annual_km": 15000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "smart",
        },
        "battery": {"status": "optimize", "capacity_kwh": 10.0, "roundtrip_efficiency": 0.92},
        "goal": "financial",
    }

    response = client.post("/api/v1/financial-analysis", json=request_payload)
    assert response.status_code == 200
    payload = response.json()
    assert payload["annual_energy_cost_eur"] >= 0.0
    assert payload["annual_savings_vs_baseline_eur"] >= 0.0
    assert "analysis_id" in payload


def test_analyze_changes_for_different_home_profiles() -> None:
    base_payload = {
        "home": {
            "home_type": "detached",
            "construction_year": 1998,
            "surface_area_m2": 180,
            "residents": 4,
            "energy_label": "D",
            "location": "Netherlands",
        },
        "energy_profile": {
            "annual_household_kwh": 3600,
            "annual_heat_demand_kwh": 10000,
            "annual_km": 12000,
        },
        "solar": {"status": "optimize", "panel_count": 12, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 10000, "seasonal_cop": 4.0},
        "ev": {
            "status": "optimize",
            "annual_km": 12000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "smart",
        },
        "battery": {"status": "optimize", "capacity_kwh": 8.0, "roundtrip_efficiency": 0.92},
        "optimization": {"objective": "balanced", "preferred_contract": "variable"},
        "goal": "balanced",
    }

    compact_home_payload = {
        **base_payload,
        "home": {
            "home_type": "apartment",
            "construction_year": 2018,
            "surface_area_m2": 80,
            "residents": 2,
            "energy_label": "A",
            "location": "Netherlands",
        },
    }

    response_large = client.post("/api/v1/analyze", json=base_payload)
    response_compact = client.post("/api/v1/analyze", json=compact_home_payload)
    assert response_large.status_code == 200
    assert response_compact.status_code == 200

    payload_large = response_large.json()
    payload_compact = response_compact.json()

    assert payload_large["annual_heat_pump_kwh"] != payload_compact["annual_heat_pump_kwh"]
    assert payload_large["annual_cost_eur_for_heat_pump"] != payload_compact["annual_cost_eur_for_heat_pump"]


def test_optimization_returns_constraint_results() -> None:
    request_payload = {
        "home": {
            "home_type": "detached",
            "construction_year": 2000,
            "surface_area_m2": 160,
            "residents": 4,
            "energy_label": "B",
            "location": "Netherlands",
        },
        "energy_profile": {
            "annual_household_kwh": 3900,
            "annual_heat_demand_kwh": 11000,
            "annual_km": 12000,
        },
        "solar": {"status": "optimize", "panel_count": 14, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 11000, "seasonal_cop": 4.0},
        "ev": {
            "status": "optimize",
            "annual_km": 12000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "smart",
        },
        "battery": {"status": "optimize", "capacity_kwh": 8.0, "roundtrip_efficiency": 0.92},
        "optimization": {
            "objective": "balanced",
            "preferred_contract": "variable",
            "max_budget_eur": 10000,
            "min_self_sufficiency_ratio": 0.4,
        },
        "goal": "balanced",
    }

    response = client.post("/api/v1/optimization", json=request_payload)
    assert response.status_code == 200
    payload = response.json()
    assert "constraint_results" in payload
    assert len(payload["constraint_results"]) == 2


def test_explainability_endpoint_returns_model_notes() -> None:
    request_payload = {
        "solar": {"status": "optimize", "panel_count": 12, "panel_power_wp": 420},
        "heat_pump": {"status": "fixed", "annual_heat_demand_kwh": 10000, "seasonal_cop": 4.0},
        "ev": {
            "status": "optimize",
            "annual_km": 12000,
            "consumption_kwh_per_km": 0.18,
            "charging_strategy": "smart",
        },
        "battery": {"status": "optimize", "capacity_kwh": 8.0, "roundtrip_efficiency": 0.92},
        "optimization": {
            "objective": "balanced",
            "preferred_contract": "variable",
            "max_budget_eur": 12000,
            "min_self_sufficiency_ratio": 0.45,
        },
        "goal": "balanced",
    }

    response = client.post("/api/v1/explainability", json=request_payload)
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["assumptions"]) >= 1
    assert len(payload["sensitivities"]) >= 1
    assert "confidence_note" in payload
