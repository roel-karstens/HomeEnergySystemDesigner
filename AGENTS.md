# Agent Instructions

This repository is for a home energy system designer.
It should stay simple, readable, and easy to extend.

## Project Direction

- Build the Python backend first.
- Keep functions and classes clean, small, and explicit.
- Favor simple, elegant implementations over clever ones.
- Favor good visualizations when they help explain the system or validate results.
- After the backend is stable, add Jupyter notebooks for testing and exploration.
- Treat the React frontend as a later phase for a polished, user-friendly UI.

## Core Problem Space

The system models sizing and interaction for:

- PV
- Heat pump
- Battery
- EV
- Household loads

Feature notes and specs live in `docs/features/`.

Agent work should support questions like:

- How much solar should I install?
- How large should the battery be?
- How do EV, heat pump, and household loads interact?
- Is V2G a good option?

## Working Rules

- Prefer the smallest safe change that solves the problem.
- Preserve existing style unless there is a clear reason to improve it.
- Read the nearby code before editing.
- Make the controlling code path do the work rather than adding wrappers.
- Avoid broad refactors unless they are necessary for correctness or clarity.

## Definition of Ready

Before changing code, make sure you can answer:

- What exact behavior should change?
- Which file or module controls that behavior?
- What is the smallest change that can prove the idea?
- What quick check can disconfirm the hypothesis?

If any part of the task is still ambiguous after a local read, ask focused questions until the definition of ready is complete. Do not guess when a clarification question would remove uncertainty.

## Definition of Done

A task is done only when:

- The requested behavior is implemented.
- Relevant tests or checks have been run.
- Any failing validation caused by the change has been addressed.
- Unrelated files are left alone.
- The result is easy to understand for the next person.

## Validation

- Run the cheapest relevant validation first.
- Prefer targeted tests or a narrow smoke check over broad commands.
- If there is no test suite yet, run the best available sanity check and say what remains unverified.
- Do not finish with code changes that have not been validated when validation is available.

## Code Style

- Use straightforward names.
- Keep functions focused on one job.
- Prefer pure logic where practical.
- Make data flow obvious.
- Keep domain calculations explicit and traceable.

## Notebook Work

- Use notebooks to inspect, prototype, and validate backend behavior.
- Keep notebook cells small and reproducible.
- Avoid turning notebooks into hidden production logic.

## Frontend Work Later

- Keep the backend independent from frontend presentation concerns.
- When the frontend is added, aim for a clean and modern interface.
- Do not let UI work complicate the energy-modeling core.

## When In Doubt

- Choose clarity over abstraction.
- Choose correctness over premature optimization.
- Choose a narrow verified change over a broad uncertain one.