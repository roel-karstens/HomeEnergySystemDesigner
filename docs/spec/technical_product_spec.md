# Technische Productspecificatie — HES (werknaam)

Versie: 1.0-draft
Datum: 2026-07-14
Status: canonieke synthese van de documentatieset

## Documentstatus

Dit document is de canonieke productspecificatie voor HES.

De bronhoofdstukken staan in `docs/spec/input/part_01_...` tot en met `part_15_...` en fungeren als onderliggende ontwerpinvoer. Wanneer er inhoudelijke spanning is tussen losse inputdelen en oudere repositorydocumentatie, is dit document leidend.

HES is een energie-optimalisatieplatform voor particuliere huiseigenaren. Het systeem analyseert woningkenmerken, verbruik, zonnepanelen, batterijopslag, warmtepomp, elektrische auto en energiecontract om een onderbouwd advies te geven over de meest logische configuratie.

Naamgeving:

- HES is een werknaam.
- De definitieve productnaam wordt later gekozen op basis van domeinbeschikbaarheid en merkfit (bijvoorbeeld Watty of een andere naam).
- Het domeinmodel, de API-contracten en de codearchitectuur moeten naam-agnostisch blijven zodat hernoemen geen inhoudelijke herbouw vereist.

---

# 1. Projectvisie en doel – HES (werknaam)

HES bestaat om complexe verduurzamingskeuzes begrijpelijk en besluitbaar te maken. De energietransitie koppelt meerdere systemen aan elkaar: zonne-opwek, elektrische verwarming, mobiliteit, opslag en prijsdynamiek. Consumenten krijgen vandaag vaak losse adviezen per productcategorie, terwijl de werkelijke waarde juist in de samenhang zit.

De primaire doelgroep bestaat uit huiseigenaren die duizenden euro's aan investeringen overwegen en behoefte hebben aan onafhankelijk, uitlegbaar en praktisch advies. De secundaire doelgroep bestaat uit energie-geinteresseerde gebruikers die scenario's, aannames en optimalisaties diepgaander willen vergelijken.

De kernwaarde van HES is niet alleen een berekening, maar een beslissing: welke combinatie van systemen is technisch en financieel het meest logisch voor deze woning, gegeven gedrag, beperkingen en doelen. HES is expliciet geen realtime HEMS, geen installateurs-offertetool en geen garantie op financieel rendement.

Succes betekent dat een gebruiker snel een volledige analyse kan doorlopen, begrijpt waarom een advies wordt gegeven en meerdere configuraties kan vergelijken zonder energie-expert te zijn.

---

# 2. Functionele scope – HES (werknaam)

De functionele scope bestaat uit acht kernvermogens: woninganalyse, energieprofielbepaling, configuratie van energiesystemen, energiesimulatie, optimalisatie, financiele analyse, scenariovergelijking en persoonlijk energieadvies.

De MVP bevat minimaal: woningprofiel, energieprofiel, zonnepanelenmodel, warmtepompmodel, EV-basisintegratie, batterijmodel, energiesimulatie, financiele analyse, eenvoudige optimalisatie en een strakke webapp-resultatenervaring die toonbaar is aan externe stakeholders. Alles in de MVP moet bijdragen aan een werkende end-to-end flow van invoer naar advies.

Versies daarna breiden uit met dynamische tarieven, rijkere scenariovergelijking, AI-uitleg, export, opgeslagen analyses, gebruikersaccounts en externe integraties zoals slimme meterdata, weerdata en EV-platformen.

Productmatig geldt: HES adviseert het totale energiesysteem, niet losse producten. De optimizer werkt altijd binnen de grenzen die de gebruiker opgeeft.

---

# 3. Domeinmodel – HES (werknaam)

De woning is het centrale domeinobject. Daaromheen hangen het huishoudprofiel, energieprofiel, energiecomponenten, contractcontext, simulatie, optimalisatie en analyse-uitkomst.

De belangrijkste domeinobjecten zijn:

- `User`: vertegenwoordigt de gebruiker, diens kennisniveau, voorkeuren en doelstelling.
- `Home` of `Building`: beschrijft woningtype, bouwjaar, oppervlak, energielabel, oriëntatie, isolatieniveau en locatie.
- `Household Energy Profile`: modelleert jaarlijks verbruik, uurprofielen, pieken en seizoenseffecten.
- `Solar System`: modelleert panelen, vermogen, oriëntatie, tilt en productieprofiel.
- `Battery System`: modelleert opslagcapaciteit, laad- en ontlaadgrenzen, efficientie en degradatie.
- `Heat Pump System`: modelleert warmtevraag, COP-gedrag, type warmtepomp en temperatuurafhankelijk verbruik.
- `Electric Vehicle` en `EV Charging Profile`: scheiden voertuigkenmerken van laadgedrag en laadstrategie.
- `Energy Contract` en `Tariff Model`: leveren prijscontext voor financiele optimalisatie.
- `Energy Simulation`: representeert één tijdstapgebaseerde simulatie van energiestromen.
- `Optimization Scenario` en `Optimization Objective`: beschrijven wat vergeleken wordt en waarop geoptimaliseerd wordt.
- `Component Constraint / Lock`: legt vast welke componenten vaststaan, uitgesloten zijn of vrijgegeven worden voor optimalisatie.
- `Analysis Result`: bundelt advies, KPI's, energiestromen, financiele uitkomsten en waarschuwingen.

Het domeinmodel moet uitbreidbaar blijven. Nieuwe energiecomponenten moeten als losse objecten toegevoegd kunnen worden zonder dat bestaande kernobjecten semantisch vervuilen.

---

# 4. Systeemarchitectuur – HES (werknaam)

De doelarchitectuur is een moderne webapplicatie met deze lagen:

Frontend

↓

Backend API

↓

Application Services

↓

Energy Domain Models

↓

Simulation Engine

↓

Optimization Engine

↓

Financial Engine

De frontend is een React-app voor wizardflow, dashboards, grafieken en adviespresentatie. De backend is een Python/FastAPI-app die validatie, orchestration en API-contracten verzorgt. Services combineren domeinfuncties, maar bevatten geen energieformules. De domain laag bevat de semantiek van woning, systemen, constraints en doelen. De calculation layer voert simulaties uit. De optimization layer verkent toegestane configuraties. De financial layer vertaalt technische uitkomsten naar kosten, besparing en rendement.

Webapp-first uitvoerregel:

- Productontwikkeling is webapp-first: iedere sprint levert zichtbare waarde in de React-flow op.
- Domeinlogica wordt per component parallel gevalideerd in notebooks (solar, heat pump, battery, EV) voordat dezelfde logica als API-uitkomst in de webapp wordt vrijgegeven.

Voor de MVP is geen database nodig. Sessiegebaseerde analyse is voldoende. De architectuur moet later kunnen doorgroeien naar PostgreSQL-opslag, accounts, background jobs, cloud deployment en AI-uitleg als extra laag bovenop gecontroleerde berekeningen.

---

# 5. Gebruikersflow – HES (werknaam)

De ideale gebruikersreis loopt van vertrouwen naar configuratie, van configuratie naar simulatie en van simulatie naar verklaarbaar advies.

De hoofdflow is:

Bezoek website → Introductie → Woningprofiel → Energieprofiel → Bestaande systemen → Optimalisatievoorkeuren → Doelstellingen → Analyseproces → Eerste advies → Waarom dit advies → Scenariovergelijking → Detailanalyse → Vervolgactie.

De flow start bewust met eenvoudige vragen en goede standaardwaarden. Technische complexiteit wordt progressief onthuld. De gebruiker hoeft niet zelf te weten welke batterijcapaciteit logisch is; HES vraagt in plaats daarvan of de batterij vaststaat, uitgesloten is of geoptimaliseerd mag worden.

Belangrijke fout- en hulpscenario's zijn onderdeel van de UX: ontbrekende informatie leidt tot expliciete aannames, onrealistische invoer tot corrigeerbare waarschuwingen en technisch onmogelijke configuraties tot blokkades met begrijpelijke uitleg.

---

# 6. Functionele modules – HES (werknaam)

HES wordt modulair opgebouwd en vermijdt één grote berekeningsfunctie. De functionele modules zijn:

- `User Input Management`
- `Input Validation Engine`
- `Default Configuration Engine`
- `Energy Consumption Model`
- `Solar Production Model`
- `Heat Pump Model`
- `Battery Simulation Engine`
- `EV Integration Model`
- `Energy Contract Model`
- `Energy Simulation Engine`
- `Optimization Engine`
- `Financial Analysis Engine`
- `Energy Independence Analysis`
- `Scenario Comparison Engine`
- `Result Presentation Layer`
- `Explainability Module`

Iedere module heeft één duidelijke verantwoordelijkheid, kleine functies en heldere input/output-contracten. Simulatie en optimalisatie zijn gescheiden processen: eerst correct simuleren, dan pas vergelijken en optimaliseren.

---

# 7. Business logica – HES (werknaam)

De business logica van HES volgt een vaste keten: woningcontext bepalen, verbruik modelleren, warmtebehoefte afleiden, productie simuleren, energiebalans berekenen, opslag en mobiliteit meenemen, kosten doorrekenen en configuraties vergelijken.

Kernregels zijn onder meer:

- zonnepanelen beinvloeden direct eigen gebruik, batterijlading, teruglevering en financiele waarde;
- warmtepompverbruik is afhankelijk van warmtevraag en COP, en dus van gebouw en buitentemperatuur;
- EV-laden is zowel extra verbruik als flexibiliteitsbron;
- batterijwaarde hangt af van productieoverschot, timing van verbruik en contractstructuur;
- het contractmodel bepaalt de waarde van netimport, export en slim laden.

De algemene optimalisatiestrategie is: simuleer een geldige configuratie, respecteer component locks en constraints, toets een reeks scenario's en kies de configuratie die de beste score behaalt voor het gekozen doel: financieel, onafhankelijkheid of gebalanceerd.

---

# 8. Configuratie en gebruikersinstellingen – HES (werknaam)

Configuratie is het onderscheidende mechanisme van HES. Iedere relevante component heeft drie toestanden:

- `fixed`: staat vast en wordt niet aangepast;
- `optimize`: HES mag varianten onderzoeken;
- `excluded`: wordt uitgesloten uit analyse en optimalisatie.

De gebruiker configureert eerst woning en energiegebruik, daarna bestaande systemen en vervolgens optimalisatievrijheid. Woningdata staat in de praktijk altijd vast. Energieverbruik is een vast uitgangspunt, maar HES mag toekomstige veranderingen simuleren, zoals een extra EV of een nieuwe warmtepomp.

Geavanceerde instellingen zoals budgetlimiet, voorkeur voor onafhankelijkheid versus rendement en technologievoorkeuren blijven standaard verborgen, maar moeten beschikbaar zijn voor gevorderde gebruikers.

De belangrijkste architectuurregel is dat de optimizer alleen werkt binnen de vrijheid die de gebruiker expliciet geeft.

---

# 9. Validatie en kwaliteitscontrole – HES (werknaam)

Validatie gebeurt in meerdere lagen:

1. inputvalidatie;
2. domeinvalidatie;
3. simulatievalidatie;
4. resultaatvalidatie;
5. kwaliteitscontrole van modellen en optimizer.

Inputvalidatie controleert verplichte velden, types, ranges en directe afhankelijkheden. Domeinvalidatie beoordeelt combinaties, zoals te veel panelen voor een klein dak of een te grote batterij voor het verbruiksprofiel. Simulatievalidatie bewaakt fysische grenzen, bijvoorbeeld geen negatieve state of charge en een logische relatie tussen aantal panelen en productie. Resultaatvalidatie voorkomt onzinnige uitkomsten zoals onverklaarde negatieve energiekosten of een optimizer die een slechter scenario kiest dan de beginsituatie.

HES moet ook onzekerheid expliciet tonen. Confidence scores worden lager wanneer veel aannames of standaardwaarden worden gebruikt en hoger wanneer echte verbruiksdata, bekende systeemwaarden en volledige configuratie beschikbaar zijn.

---

# 10. UX/UI structuur – HES (werknaam)

De interface moet aanvoelen als een premium energieadviesplatform, niet als een technische calculator. De visuele richting is rustig, modern en professioneel: witte achtergrond, veel witruimte, duidelijke kaarten, terughoudend kleurgebruik en duidelijke hiërarchie.

De hoofdnavigatie volgt een stappenmodel:

Stap 1 Mijn woning
Stap 2 Mijn energiesystemen
Stap 3 Mijn voorkeuren
Stap 4 Optimalisatie
Stap 5 Mijn advies

Belangrijke pagina's zijn de landing page, woningprofielpagina, energiegebruikpagina, energiesystemenpagina, optimalisatie-instellingen, analysescherm, resultaten-dashboard, scenariopagina, detailanalyse en uitlegpagina. Resultaten worden eerst samengevat als advies en KPI's, daarna pas als technische details.

De frontendcomponenten bestaan uit layoutcomponenten, inputcomponenten, resultatencards, grafiekcomponenten en expliciete explainability-elementen zoals redenkaarten en onzekerheidsblokken.

---

# 11. API ontwerp – HES (werknaam)

De API volgt REST-principes onder `/api/v1/` en bevat geen domeinlogica. De API valideert input, roept services aan en geeft frontend-vriendelijke responses terug.

Belangrijke endpoints zijn:

- `GET /api/v1/health`
- `POST /api/v1/home`
- `POST /api/v1/energy-profile`
- `POST /api/v1/configuration`
- `POST /api/v1/validate`
- `POST /api/v1/simulation`
- `POST /api/v1/optimization`
- `POST /api/v1/scenarios`
- `POST /api/v1/financial-analysis`
- `GET /api/v1/results/{analysis_id}`
- `GET /api/v1/recommendation/{analysis_id}`

Alle requests en responses gebruiken duidelijke Pydantic schema's. Foutafhandeling gebruikt een gestandaardiseerd foutobject met minimaal `code`, `message` en optioneel `field`.

---

# 12. Code architectuur – HES (werknaam)

De beoogde codearchitectuur is een eenvoudige monorepo met aparte frontend- en backenddelen en een expliciete scheiding tussen API, services, domain en calculations.

Doelstructuur:

`frontend/`

- `src/components`
- `src/pages`
- `src/features`
- `src/hooks`
- `src/services`
- `src/utils`
- `src/types`

`backend/`

- `app/main.py`
- `api/routes`
- `schemas`
- `services`
- `domain/energy`
- `domain/optimization`
- `domain/finance`
- `calculations`
- `validators`
- `config`

De huidige repository is nog kleiner dan deze doelarchitectuur en bestaat vandaag vooral uit een Python-backendslice onder `src/home_energy/` plus notebooks en tests. Dat is geen tegenspraak, maar een implementatiefase. Nieuwe code moet het doelbeeld volgen zonder het bestaande werk agressief te refactoren.

Naamwijziging-voorbereiding:

- Productnaam nooit hardcoderen in domeinobjecten of endpointnamen.
- Gebruik neutrale identifiers zoals `analysis`, `configuration`, `recommendation`.
- Houd package- en app-naam los van marketingnaam via configuratie (`APP_DISPLAY_NAME`, `APP_SLUG`).
- Voorzie latere rename zonder breaking API door versieprefix en stabiele resource-namen te behouden.

---

# 13. Development roadmap – HES (werknaam)

De roadmap bouwt HES op van betrouwbare basisanalyse naar volledige optimalisatie-engine, met webapp-first levering en notebook-validatie per domeincomponent.


- Sprint 0: webapp- en API-fundament. React routing + design system + FastAPI skeleton + health endpoint + docs-contract.
- Sprint 1: woningwizard en energieprofiel in webapp, inclusief backend validatie en eerste resultaatkaart.
- Sprint 2: zonnepanelenmodel in API + webvisualisatie + notebook-validatie Solar.
- Sprint 3: warmtepompmodel in API + webimpactpanel + notebook-validatie Heat Pump.
- Sprint 4: EV-basisintegratie in API + laadprofielvisualisatie + notebook-validatie EV.
- Sprint 5: batterijsimulatie in API + opslagvergelijking in webapp + notebook-validatie Battery.
- Sprint 6: financieel model + contractmodel + ROI/payback webdashboard.
- Sprint 7: eenvoudige optimalisatie-engine met constraints en vaste/vrije componenten.
- Sprint 8: scenariovergelijking in webapp met heldere trade-offs.
- Sprint 9: UX-polish, explainability en vertrouwen (aannames, onzekerheden, warnings).
- Sprint 10: AI-uitleglaag boven gecontroleerde resultaten (geen vervanging van rekenkern).
- Sprint 11: productisering met accounts, opgeslagen analyses en analytics.
- Sprint 12: geavanceerde integraties (smart meter, weer, tarieven, EV platformen).

De fundamentele volgorde blijft: eerst correcte energiebalans en transparante simulatie, daarna optimalisatie, AI en integraties.

Concreet implementatiepad vanaf huidige codebase:

1. Maak FastAPI app-shell met endpoint `POST /api/v1/simulation` die bestaande solar + heat pump functies aanroept.
2. Bouw minimale React wizard met invoer + resultaatkaart op dit endpoint.
3. Voeg systeemstatusmodel toe (`fixed|optimize|excluded`) voor solar/heat pump als eerste constraint-laag.
4. Implementeer EV-basisprofiel en test in notebook + unit tests, daarna koppel aan API.
5. Implementeer batterijmodel en energiebalansvolgorde, valideer notebook + tests, daarna UI-vergelijking zonder/met batterij.
6. Voeg financieel model toe met contracttype en KPI's (kosten, besparing, payback, ROI).
7. Voeg scenario search toe voor eenvoudige optimalisatie binnen constraints.
8. Voeg explainability output toe per aanbeveling met redenen en aannames.

---

# 14. Datamodel & objectstructuur – HES (werknaam)

Het centrale data-object is `Analysis`. Een `Analysis` representeert één volledige woninganalyse en koppelt alle relevante invoer en uitkomstobjecten aan elkaar.

Structuur:

`Analysis`

- `Home`
- `Household`
- `EnergyProfile`
- `SystemConfiguration`
- `OptimizationSettings`
- `SimulationResult`
- `OptimizationResult`
- `FinancialResult`
- `Recommendation`

Belangrijke modelregels:

- configuraties en resultaten zijn gescheiden objecten;
- datamodellen bevatten geen frontend-specifieke informatie;
- berekeningen horen niet in de datamodellen maar in services en calculations;
- iedere energiecomponent heeft een eigen object en status;
- het model moet later eenvoudig te mappen zijn op PostgreSQL.

`Home`, `Household` en `EnergyProfile` leveren context. `SystemConfiguration` bundelt `SolarSystem`, `BatterySystem`, `HeatPumpSystem`, `EVSystem` en `EnergyContract`. `OptimizationSettings` bepaalt doelen, budgetten en vrijgegeven componenten. `SimulationResult`, `OptimizationResult`, `FinancialResult` en `Recommendation` beschrijven elk een duidelijk andere outputlaag.

Concreet MVP modelcontract (Python/Pydantic richting):

- `ComponentStatus` enum: `fixed`, `optimize`, `excluded`.
- `OptimizationObjective` enum: `financial`, `independence`, `balanced`.
- `ContractType` enum: `fixed`, `variable`, `dynamic`.
- `ChargingStrategy` enum: `normal`, `smart`, `v2g`.

Kernobjecten en verplichte velden:

- `Analysis`: `id`, `created_at`, `status`, `home`, `household`, `energy_profile`, `configuration`, `optimization_settings`.
- `Home`: `home_type`, `construction_year`, `surface_area_m2`, `energy_label`, `location`.
- `Household`: `number_of_residents`, `occupancy_profile`, `lifestyle_profile`.
- `EnergyProfile`: `annual_consumption_kwh`, `hourly_consumption_profile` (8760), `peak_power_kw`.
- `SolarSystem`: `status`, `panel_count`, `panel_power_wp`, `orientation`, `tilt_angle`.
- `BatterySystem`: `status`, `capacity_kwh`, `max_charge_power_kw`, `max_discharge_power_kw`, `efficiency_percentage`.
- `HeatPumpSystem`: `status`, `type`, `power_kw`, `cop_profile`.
- `EVSystem`: `status`, `battery_capacity_kwh`, `annual_km`, `consumption_kwh_per_km`, `charging_power_kw`, `charging_strategy`.
- `EnergyContract`: `contract_type`, `electricity_purchase_price`, `feed_in_price`, optioneel `hourly_prices`.
- `OptimizationSettings`: `objective`, `budget_limit`, `fixed_components`, `optimization_components`.
- `SimulationResult`: `energy_production_kwh`, `energy_consumption_kwh`, `grid_import_kwh`, `grid_export_kwh`, `self_consumption_ratio`, `self_sufficiency_ratio`.
- `FinancialResult`: `investment_eur`, `annual_cost_before_eur`, `annual_cost_after_eur`, `annual_savings_eur`, `payback_years`, `roi_percentage`.
- `Recommendation`: `title`, `summary`, `reasons`, `assumptions`, `uncertainties`.

---

# 15. Berekeningsmodellen en formules – HES (werknaam)

De berekeningslaag volgt deze keten:

1. woningprofiel bepalen;
2. energieverbruik simuleren;
3. zonneproductie berekenen;
4. warmtepompverbruik berekenen;
5. EV-laadprofiel bepalen;
6. energiebalans berekenen;
7. batterij simuleren;
8. netimport en teruglevering bepalen;
9. financiele analyse uitvoeren;
10. configuraties optimaliseren.

Kernformules in de MVP zijn bewust eenvoudig en uitlegbaar:

- jaarverbruik woning = basisverbruik huishouden + gebouwgebonden verbruik + extra elektrische apparaten;
- warmtevraag = referentievraag × woningfactor × temperatuurfactor;
- elektriciteitsgebruik warmtepomp = warmtevraag / COP;
- jaarproductie zonnepanelen = aantal panelen × vermogen per paneel × opbrengstfactor;
- EV-energiebehoefte = kilometers × verbruik per km;
- energiebalans per tijdstap: productie + batterijontlading + netimport = verbruik + batterijlading + teruglevering;
- terugverdientijd = investering / jaarlijkse besparing;
- ROI = jaarlijkse opbrengst / investering × 100.

De MVP-optimizer gebruikt scenario search in plaats van black-box AI: simuleer toegestane combinaties, bereken scores en kies de beste configuratie volgens het gekozen doel. Resultaten moeten altijd verklaarbaar blijven.

---

## Documenthiërarchie

Voor product- en architectuurvragen is dit document leidend.

Voor detailbronhoofdstukken:

- `docs/spec/input/part_01_projectvisie.md`
- `docs/spec/input/part_02_functionele_scope.md`
- `docs/spec/input/part_03_domeinmodel.md`
- `docs/spec/input/part_04_systeemarchitectuur.md`
- `docs/spec/input/part_05_gebruikersflow.md`
- `docs/spec/input/part_06_functionele_modules.md`
- `docs/spec/input/part_07_business_logica.md`
- `docs/spec/input/part_08_configuratie_en_gebruikersinstellingen.md`
- `docs/spec/input/part_09_validatie_en_kwaliteitscontrole.md`
- `docs/spec/input/part_10_ux_ui_structuur.md`
- `docs/spec/input/part_11_api_ontwerp.md`
- `docs/spec/input/part_12_code_architectuur.md`
- `docs/spec/input/part_13_development_roadmap.md`
- `docs/spec/input/part_14_datamodel_en_objectstructuur.md`
- `docs/spec/input/part_15_berekeningsmodellen_en_formules.md`

## Legacy kennis

Historische featuredocumentatie onder `docs/superseeded/` is deprecated als sturend ontwerp, maar blijft bruikbaar als kennisbron en validatiecontext.

## Huidige implementatiestatus

De codebase implementeert vandaag een vroege Python-backendslice met zonnepaneelsimulatie, warmtepompsimulatie, notebooks en tests. De volledige HES-architectuur in deze specificatie is het doelbeeld waar verdere ontwikkeling naartoe moet convergeren.
