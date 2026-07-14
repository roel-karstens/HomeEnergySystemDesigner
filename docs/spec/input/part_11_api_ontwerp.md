# 11. API ontwerp – HES (werknaam)

Status: Definitieve annex
Doel: Definieren van frontend-backend contracten.

Basis:
- versieprefix /api/v1
- API orchestration, geen domeinformules
- duidelijke request/response schema's

Kernendpoints:
- GET /api/v1/health
- POST /api/v1/home
- POST /api/v1/energy-profile
- POST /api/v1/configuration
- POST /api/v1/validate
- POST /api/v1/simulation
- POST /api/v1/optimization
- POST /api/v1/scenarios
- POST /api/v1/financial-analysis
- GET /api/v1/results/{analysis_id}
- GET /api/v1/recommendation/{analysis_id}

Foutcontract:
- code
- message
- optioneel field
