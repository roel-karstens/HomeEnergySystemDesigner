# OpenAPI Contract Review (Sprint 0+)

Status: uitgevoerd op 2026-07-14
Scope: backend hoofdstuk-11 endpoints in `backend/app/main.py` en bijbehorende schema's.

## Gedekte endpoints

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
- POST /api/v1/analyze (compatibiliteitsendpoint)

## Positieve bevindingen

- Request/response modellen zijn expliciet getypeerd met Pydantic.
- `analysis_id` wordt consistent gebruikt voor retrieval-endpoints.
- Enumvelden uit het domeinmodel (componentstatus en objective) zijn contractueel vastgelegd.
- Validatieendpoint geeft gestructureerde issues terug (`code`, `message`, `field`).

## Open punten

- Errorcontract bij 404 gebruikt momenteel `HTTPException(detail=...)` en is nog niet als uniforme response model opgenomen voor alle endpoints.
- `POST /api/v1/analyze` overlapt functioneel met `POST /api/v1/simulation`; op termijn kan een expliciete deprecatieheader voor `/analyze` nuttig zijn.
- In-memory opslag van simulaties is sprint-0 passend, maar vereist persistentielaag voor multi-session gebruik.

## Aanbevolen vervolgstappen

1. Voeg een gedeeld ErrorResponse model toe en registreer dat als documented error response op alle endpoints.
2. Markeer `/api/v1/analyze` als transitional endpoint in docs/openapi description.
3. Introduceer repository/persistence voor analyses zodat `results/{analysis_id}` ook na restart bruikbaar blijft.
