# 4. Systeemarchitectuur – HES (werknaam)

Status: Definitieve annex
Doel: Definieren van technische lagen en verantwoordelijkheden.

Laagmodel:
Frontend -> Backend API -> Services -> Domain -> Simulation -> Optimization -> Financial

Architectuurkeuzes:
- webapp-first productlevering
- React frontend voor wizard, dashboards en explainability
- Python/FastAPI backend voor contracten en orchestration
- berekeningen in domain/calculations, niet in API-routes
- sessiegebaseerd in MVP, database later

Uitbreidbaarheid:
- nieuwe componenten als losse domeinmodules
- stabiele API-contracten onder /api/v1
