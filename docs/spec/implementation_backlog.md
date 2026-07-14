# HES Implementatiebacklog (Webapp-First)

Status: actief
Doel: uitvoerbaar bouwplan met sprintdeliverables en acceptatiecriteria.

## Sprint 0 (nu)

Doel:
- eerste webapp -> backend analyze flow

Te bouwen:
- FastAPI shell met health + analyze endpoint
- naam-agnostische app settings
- React shell met invoerformulier en advieskaart
- API service in frontend

Acceptatiecriteria:
- `GET /api/v1/health` geeft status terug
- `POST /api/v1/analyze` geeft aanbeveling + KPI's terug
- frontend toont resultaat zonder handmatige postmanstap

## Sprint 1

Doel:
- woning en energieprofiel flow

Te bouwen:
- home + profile schema's
- validatie van woninginput
- UX stapflow voor woning en profiel

Acceptatiecriteria:
- verschillende woningprofielen geven verschillende outputs
- invoerfouten tonen bruikbare feedback

## Sprint 2 t/m 5 domeinvalidatiegates

Voor elk domein (solar, heat pump, EV, battery):
- unit tests voor kernregels
- notebookvalidatie met reproduceerbare cellen
- webweergave van de resulterende KPI's

Release-gate per domein:
- pas naar stabiele webadviezen na notebook + tests

## Sprint 6+

- finance + contract
- optimization constraints
- scenario comparison
- explainability
- AI uitleglaag
- productisering en integraties
