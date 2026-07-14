# 6. Functionele modules – HES (werknaam)

Status: Definitieve annex
Doel: Vertalen van domein naar bouwbare softwaremodules.

Modulegroepen:
- Input: user input, validation, defaults
- Model: consumption, solar, heat pump, EV, battery, contract
- Engine: simulation, optimization
- Business: financial, independence, scenario comparison
- Presentation: results, explainability

Ontwerpregel:
- kleine testbare functies met duidelijke input/output
- geen monolithische calculate_everything functie
