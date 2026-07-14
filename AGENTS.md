# Agent Instructions

This repository is for HES (working name).
The codebase should stay simple, readable and easy to extend, while the documentation set under `docs/spec/` defines the target product and architecture.

Name note:

- Product naming is not final and may change based on domain availability and branding.
- Keep naming in code and API contracts product-name agnostic where possible.

## Canonical Entry Point

When working in this repository, use this document as the execution entry point.

Read in this order:

1. `docs/spec/technical_product_spec.md`
2. the relevant detailed chapter under `docs/spec/input/part_01_...` through `part_15_...`
3. `docs/spec/progress_checklist.md` for current sprint status and gates
4. the current implementation under `backend/`, `home_energy/`, `tests/` and `notebooks/`

Interpretation rule:

- `docs/spec/technical_product_spec.md` is the canonical synthesized product spec.
- `docs/spec/input/part_XX_*.md` files are definitive annex chapters for deeper guidance.
- the current codebase is an early implementation slice, not proof that the full HES target architecture already exists.

## Delivery Strategy

- Build webapp-first: every sprint should produce visible product value in the React flow.
- Validate each domain model in notebooks before exposing the logic as stable API output.

Notebook validation gates per domain:

- Battery and EV interactions: validate in `notebooks/integrated_energy_design.ipynb` (extend as needed)

Deprecated notebooks:

- Historical solar and heat pump notebooks are moved to `deprecated/notebooks/`.
- Keep them only for reference and do not treat them as active validation gates.

## Current Implementation Reality

Today the repository mainly contains:

- FastAPI backend shell for analysis orchestration
- Python domain logic for solar and heat pump simulation under `home_energy/`
- integrated notebook validation under `notebooks/integrated_energy_design.ipynb`
- targeted backend tests under `tests/`

Do not assume that the full frontend, FastAPI API, optimization engine or persistence layer already exists.

## Product Direction

HES is an optimization and recommendation platform, not just a calculator.

It should ultimately support decisions about:

- solar PV
- battery storage
- heat pump
- EV charging
- household consumption
- energy contracts
- self-consumption and independence
- financial optimization

Deprecated-but-useful context:

- `docs/superseeded/` is deprecated as canonical direction.
- `deprecated/src/src_legacy/` contains the previous `src/` layout for reference.
- You may reuse factual knowledge from it, but implementation and naming decisions must follow `docs/spec/`.

## Working Mode

- Anchor every code change in the current implementation surface.
- Use the specification as target-state guidance, not as permission to refactor the whole repo at once.
- Prefer the smallest safe change that moves the current implementation toward the target model.
- Preserve existing style unless a clear improvement is required for correctness or clarity.
- Keep functions and classes small, explicit and testable.

## Definition of Ready

Before changing code, make sure you can answer:

- What exact behavior should change?
- Which file or module currently controls that behavior?
- What is the smallest change that can prove the idea?
- What is the cheapest check that could disconfirm the hypothesis?

If the docs and current implementation conflict, follow this rule:

- for product intent and naming, trust the spec;
- for what can be edited safely now, trust the current code surface.

## Definition of Done

A task is done only when:

- the requested behavior or documentation outcome is implemented;
- relevant tests or sanity checks have been run when available;
- new validation or edge-case issues caused by the change have been addressed;
- unrelated files are left alone;
- the result is understandable for the next developer or agent.

## Validation

- Run the cheapest relevant validation first.
- Prefer narrow tests or smoke checks over broad commands.
- For documentation-only changes, validate by reviewing the resulting diff for consistency and broken alignment.
- Do not finish with unvalidated code changes when validation is available.

## Code Style

- Use straightforward names.
- Keep responsibilities narrow.
- Prefer pure logic where practical.
- Make data flow obvious.
- Keep energy calculations explicit and traceable.
- Do not hide assumptions in magic numbers.

## Notebook Guidance

- Use notebooks to inspect, prototype and validate backend behavior.
- Keep notebook cells small and reproducible.
- Do not move production logic into notebooks.

## Frontend Guidance

- Keep backend logic independent from frontend concerns.
- When frontend work is added, follow the HES UX direction in `docs/spec/technical_product_spec.md` and `docs/spec/input/part_10_ux_ui_structuur.md`.
- Do not let UI work distort the domain model or calculation layer.

## When In Doubt

- Choose clarity over abstraction.
- Choose correctness over premature optimization.
- Choose a narrow verified change over a broad uncertain one.
- Choose explainable models over opaque cleverness.
