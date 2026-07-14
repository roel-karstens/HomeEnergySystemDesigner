# Heat Pump Design Feature

## Goal

Design a minimal but realistic heat pump backend feature for annual electricity estimation and interaction analysis.

The feature should estimate heat pump electricity consumption, cost, and source breakdown while staying simple and transparent.

## Intended User Question

This feature should help answer questions such as:

- How much electricity does my heat pump use over a year?
- How does usage shift across winter, shoulder seasons, and summer?
- How much heat pump electricity is supplied by solar, battery, or grid?
- What does this imply for annual operating cost and CO2 emissions?

## Initial Scope

The first version focuses on:

- Input model for enabled state, annual heat demand, seasonal COP, and hot water included flag
- Annual-to-hourly distribution with a simple seasonal monthly profile and fixed daily shape
- Interaction accounting with available PV, optional battery support, grid import, and dynamic prices
- Notebook-friendly outputs and clear visualizations

## Confirmed Decisions

- Keep the model intentionally simple and explicit (no detailed thermal building physics).
- Electricity consumption is computed as annual heat demand divided by seasonal COP.
- Consumption is distributed over the year using a configurable monthly profile and daily shape.
- Integration API supports current PV outputs and leaves extension points for battery/EV/control scheduling.
- Outputs include annual demand, source shares, annual cost, annual CO2, warnings, and explainability summary.

## Alignment with Existing PV Feature

- Reuse the same package style (`home_energy`) and simple dataclass-driven design.
- Keep result objects explicit and notebook-first.
- Share Utrecht as default location and preserve the current Plotly visualization approach.
- Add an integrated notebook that combines PV and heat pump results to serve as the future multi-system notebook base.

## Assumptions

- A simplified seasonal profile is acceptable for the first model version.
- PV and heat pump are simulated on the same hourly time base.
- Battery and EV models are future additions; current integration accepts optional battery availability.

## Done When

This feature is ready when:

- Heat pump backend simulation is implemented and validated by tests.
- Standalone heat pump notebook is available with requested charts and warnings.
- Integrated PV plus heat pump notebook workflow is available for combined analysis.
- Assumptions and limitations are visible to users in spec and notebook narrative.
