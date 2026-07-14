# HES Voortgangschecklist

Statusdatum: 2026-07-14
Bronnen: part_13 roadmap + implementation_backlog + actuele code/tests.

## Methodiek

Werkmodel:
- webapp-first opleveren per sprint
- notebook-validatie per domein voordat adviezen stabiel worden
- kleinste veilige stap met test- en smoke-validatie

Beslisregel:
- richting en fasering uit part_13
- concrete sprintdeliverables uit implementation_backlog
- dagelijkse uitvoering volgens AGENTS.md (DoR/DoD/validation)

## Sprintstatus

- [x] Sprint 0: React + FastAPI basisflow
- [x] Sprint 1: woning + energieprofiel flow
- [x] Sprint 2: solar + notebookvalidatie
- [x] Sprint 3: heat pump + notebookvalidatie
- [x] Sprint 4: EV basis + notebookvalidatie
- [x] Sprint 5: battery + notebookvalidatie
- [x] Sprint 6: financial + contract
- [x] Sprint 7: optimization constraints
- [x] Sprint 8+: scenarios, polish, AI uitleg, productisering

## Checklist per sprint (aftekenen)

### 1) Functioneel
- [ ] Feature werkt end-to-end in webflow
- [ ] API-contract(en) zijn expliciet en getest
- [ ] Output is begrijpelijk voor eindgebruiker

### 2) Kwaliteit
- [ ] Unit tests voor kernregels groen
- [ ] Relevante smoke tests groen
- [ ] Geen regressies op bestaande endpoints

### 3) Notebook gate (voor domeinsprints 2-5)
- [ ] Reproduceerbare notebookcellen bijgewerkt
- [ ] Resultaten logisch en uitlegbaar
- [ ] Belangrijkste aannames zijn expliciet

### 4) Documentatie
- [ ] Backlog bijgewerkt met behaalde acceptatiecriteria
- [ ] Eventuele contractwijzigingen vastgelegd
- [ ] Open punten/risico's voor volgende sprint genoteerd

## Huidige stand (nu)

Afgerond:
- FastAPI shell en uitgebreide hoofdstuk-11 endpointset
- Frontend analyze flow + build/smoke check
- API tests inclusief scenarios en financial-analysis
- Legacy src/notebooks verplaatst naar deprecated
- Sprint 1 opgeleverd: woning + energieprofiel stapflow in frontend met validate-check
- Sprint 1 accept/reject review: ACCEPT
	- criterium 1 gehaald: verschillende woningprofielen geven verschillende outputs
	- criterium 2 gehaald: invoerfouten tonen bruikbare feedback via validate issues
- Sprint 2-5 geintegreerd: solar/heat pump/EV/battery in e2e payloads en KPI-output
- Sprint 6 opgeleverd: financial analysis met contracttype en prijsaannames
- Sprint 7 opgeleverd: optimization constraints met budget/self-sufficiency checks
- Sprint 8 opgeleverd: polished dashboard met scenariovergelijking en explainability-module

Nog te doen voor Sprint 1 close:
- n.v.t. (Sprint 1 is formeel afgevinkt)

Nog te doen voor totaalreview na Sprint 8:
- gebruiker valideert end-to-end functionaliteit en UX handmatig

## Bijwerkritme

- Werk deze checklist bij na elke afgeronde sprint of significante mijlpaal.
- Gebruik dezelfde statusdatum-conventie bovenaan.
