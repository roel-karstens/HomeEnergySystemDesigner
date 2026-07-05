from __future__ import annotations

import unittest

from home_energy.domain import HeatPumpConfig
from home_energy.heat_pump import (
    heat_pump_explainability_summary,
    heat_pump_validation_warnings,
    simulate_heat_pump,
    simulate_heat_pump_interaction,
)
from home_energy.solar import simulate_pv_system
from home_energy.domain import PVSegment


class HeatPumpSimulationTests(unittest.TestCase):
    def test_heat_pump_annual_consumption_from_cop(self) -> None:
        config = HeatPumpConfig(enabled=True, annual_heat_demand_kwh=8000.0, seasonal_cop=4.0)
        result = simulate_heat_pump(config, year=2026)

        self.assertEqual(len(result.timestamps), 8760)
        self.assertEqual(len(result.hourly_electricity_kwh), 8760)
        self.assertEqual(len(result.monthly_electricity_kwh), 12)
        self.assertAlmostEqual(result.annual_electricity_kwh, 2000.0, places=3)

    def test_interaction_uses_solar_then_grid(self) -> None:
        config = HeatPumpConfig(enabled=True, annual_heat_demand_kwh=8000.0, seasonal_cop=4.0)
        hp_result = simulate_heat_pump(config, year=2026)

        pv_result = simulate_pv_system(
            [PVSegment(name="south", capacity_kwp=5.0, azimuth_deg=180.0, tilt_deg=35.0)],
            year=2026,
        )

        interaction = simulate_heat_pump_interaction(
            hp_result,
            pv_hourly_kwh=pv_result.total_hourly_kwh,
            default_price_eur_per_kwh=0.30,
            grid_co2_kg_per_kwh=0.35,
        )

        self.assertGreater(interaction.solar_supplied_kwh, 0.0)
        self.assertGreater(interaction.grid_supplied_kwh, 0.0)
        self.assertAlmostEqual(
            interaction.solar_supplied_kwh + interaction.battery_supplied_kwh + interaction.grid_supplied_kwh,
            hp_result.annual_electricity_kwh,
            places=6,
        )

    def test_warnings_and_explainability(self) -> None:
        config = HeatPumpConfig(enabled=True, annual_heat_demand_kwh=14000.0, seasonal_cop=2.3)
        warnings = heat_pump_validation_warnings(config, household_consumption_kwh=4000.0)
        self.assertEqual(len(warnings), 3)

        result = simulate_heat_pump(config, year=2026)
        interaction = simulate_heat_pump_interaction(result)
        summary = heat_pump_explainability_summary(interaction)
        self.assertIn("average COP", summary)


if __name__ == "__main__":
    unittest.main()
