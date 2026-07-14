# Migratiestrategie: huidige code naar webapp-first HES

## Doel

Van de huidige Python slice naar een webapp-first product bewegen zonder onnodige herschrijvingen.

## Besluit

Geen big-bang rewrite van `src/home_energy/` of notebooks.

We hanteren een strangler-pad:

1. behoud bestaande domeinlogica als betrouwbare kern;
2. exposeer die logica via backend services en API;
3. valideer uitbreidingen per domein in notebooks;
4. verplaats alleen code wanneer verantwoordelijkheden echt veranderen.

## Wat we niet doen in Sprint 0

- geen volledige herstructurering naar einddoelmappen
- geen verwijdering van bestaande notebooks
- geen herschrijving van bestaande solar/heat_pump rekenlogica

## Wat we wel doen

- API shell boven bestaande logica
- webapp flow met eerste analyze endpoint
- naam-agnostische configuratie in app settings
- backlog en kwaliteitsgates voor volgende sprints

## Trigger voor refactor

Refactor van `src/home_energy/` is pas nodig als:

- modulegrenzen blokkeren nieuwe componenten;
- testbaarheid significant lijdt;
- API/service laag structureel domain-code dupliceert.

Tot die tijd: incrementeel migreren, niet opnieuw beginnen.
