# 12. Code architectuur – HES (werknaam)

Status: Definitieve annex
Doel: Organiseren van code voor modulariteit en onderhoud.

Doelstructuur:
- frontend/ (React)
- backend/ (FastAPI + domain/services/calculations)
- docs/
- tests/

Scheiding:
- UI in frontend
- API contract en orchestration in backend routes/services
- rekenlogica in domain/calculations
- centrale settings/constants in config

Naam-agnostisch ontwerp:
- productdisplaynaam via config
- stabiele resource-namen los van marketingnaam
