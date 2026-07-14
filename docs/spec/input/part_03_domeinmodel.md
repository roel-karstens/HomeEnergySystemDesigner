# 3. Domeinmodel – HES (werknaam)

Status: Definitieve annex
Doel: Vastleggen van kernconcepten en relaties.

Centrale objecten:
- Home/Building
- Household
- EnergyProfile
- SolarSystem
- BatterySystem
- HeatPumpSystem
- EVSystem + EVChargingProfile
- EnergyContract + TariffModel
- EnergySimulation
- OptimizationScenario + Objective
- AnalysisResult

Domeinregels:
- de woning is het centrale anker
- componenten beinvloeden elkaar en worden niet geisoleerd beoordeeld
- input, simulatie en resultaat zijn strikt gescheiden concepten
- optimalisatie respecteert component locks en constraints
