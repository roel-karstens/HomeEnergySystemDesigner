# 14. Datamodel & objectstructuur – HES (werknaam)

Status: Definitieve annex
Doel: Vastleggen van objectstructuur voor backend, API en opslag.

Centrale container:
- Analysis

Analysis bevat:
- Home
- Household
- EnergyProfile
- SystemConfiguration
- OptimizationSettings
- SimulationResult
- OptimizationResult
- FinancialResult
- Recommendation

Belangrijke enums:
- ComponentStatus: fixed, optimize, excluded
- OptimizationObjective: financial, independence, balanced
- ContractType: fixed, variable, dynamic
- ChargingStrategy: normal, smart, v2g

Modelregel:
- configuraties en resultaten blijven gescheiden
- datamodellen bevatten geen berekeningen
