# Solar Panel Design Feature

## Goal

Design the first backend feature for solar panel sizing and visualization.

The user should be able to enter:

- Multiple panel orientations
- Installed capacity per orientation or segment
- Tilt angle per orientation or segment

The feature should assume the location is Utrecht, the Netherlands.

The output should be visible in a Jupyter notebook as a visualization.

The implementation should be structured so similar features can be added later for EV, heat pump, battery, and household appliances without making functions hard to find.

## Intended User Question

This feature should help answer questions such as:

- How much energy will this PV setup produce in Utrecht?
- How does production change across different roof orientations and tilts?
- What is the combined output of multiple PV segments?

## Initial Scope

The first version should focus on:

- Input handling for multiple PV segments in a notebook
- Solar production estimation for Utrecht
- Notebook-friendly output
- Clear visualization of results

## Confirmed Decisions

- Input shape: a list of PV segments with orientation, tilt, and capacity.
- Capacity unit: kWp per roof segment.
- Angle meaning: tilt from horizontal.
- Orientation representation: both azimuth degrees and compass labels.
- Visualization: hourly production, monthly totals, and per-segment comparison plots.
- Model fidelity: simplified estimate first.
- Losses: include inverter efficiency, temperature loss, wiring loss, shading, and soiling, with default values for all except temperature.
- Shared structure: use a lightweight reusable domain shape now so later EV, heat pump, battery, and household modules can fit the same design.

## Assumptions

- The system will start with a Python backend.
- The notebook will be used to explore and validate the calculations.
- The first visualization should be simple, readable, and useful.
- The feature should stay easy to extend later for battery, EV, and heat pump interactions.

## Definition of Ready Questions

These details still need to be confirmed before implementation:

- None at the moment.

## Done When

This feature is ready when:

- The input model is clearly defined.
- The calculation path for Utrecht is implemented.
- The notebook produces a useful visualization.
- The result can be inspected and validated with example inputs.
