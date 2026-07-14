# HES (working name)

HES is a home energy optimization platform for consumers. It is intended to analyze the interaction between house characteristics, electricity use, solar PV, battery storage, heat pump, EV usage and energy contracts, and turn that into an explainable recommendation.

The final product name is not fixed yet and may change based on domain availability and branding.

## Current Repository State

The current implementation is still an early Python backend slice:

- solar production simulation
- heat pump simulation
- notebook-based exploration
- targeted tests for the implemented backend logic

The repository is not yet a full React + FastAPI product. The complete target architecture, product scope and roadmap are documented in the specification set under `docs/spec/`.

## Documentation

- Canonical integrated spec: `docs/spec/technical_product_spec.md`
- Detailed chapter inputs: `docs/spec/input/part_01_projectvisie.md` through `docs/spec/input/part_15_berekeningsmodellen_en_formules.md`
- Legacy feature notes: `docs/superseeded/features/`

## Current Code Surface

- `home_energy/solar.py`
- `home_energy/heat_pump.py`
- `home_energy/domain.py`
- `tests/test_solar.py`
- `tests/test_heat_pump.py`
- `notebooks/integrated_energy_design.ipynb`

Deprecated reference material:

- `deprecated/src/src_legacy/`
- `deprecated/notebooks/`

## Working Principle

When making changes in this repository, treat the current Python backend as the implementation anchor and the HES specification as the target-state blueprint.
