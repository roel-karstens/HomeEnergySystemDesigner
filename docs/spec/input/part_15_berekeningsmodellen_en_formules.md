# 15. Berekeningsmodellen en formules – HES (werknaam)

Status: Definitieve annex
Doel: Definieren van de rekenkern voor simulation, optimization en finance.

Rekenvolgorde:
1. woningprofiel
2. energieverbruik
3. zonneproductie
4. warmtepomp
5. EV
6. energiebalans
7. batterij
8. netimport/export
9. financieel
10. optimalisatie

MVP-formules (uitlegbaar):
- jaarverbruik = basis + gebouwgebonden + extra
- warmtepomp elektriciteit = warmtevraag / COP
- jaarproductie PV = panelen * vermogen * opbrengstfactor
- EV energie = km * kWh_per_km
- payback = investering / jaarlijkse besparing
- ROI = jaarlijkse opbrengst / investering * 100

Zoekstrategie MVP:
- scenario search binnen constraints
- geen black-box besluitvorming
