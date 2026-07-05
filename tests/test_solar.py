from __future__ import annotations

import unittest

from home_energy.domain import PVSegment
from home_energy.solar import compass_label_for_azimuth, simulate_pv_system


class SolarSimulationTests(unittest.TestCase):
    def test_compass_labels(self) -> None:
        self.assertEqual(compass_label_for_azimuth(180), "South")
        self.assertEqual(compass_label_for_azimuth(90), "East")

    def test_simulation_produces_monthly_and_hourly_outputs(self) -> None:
        result = simulate_pv_system(
            [
                PVSegment(name="south", capacity_kwp=5.0, azimuth_deg=180.0, tilt_deg=35.0),
                PVSegment(name="east", capacity_kwp=3.0, azimuth_deg=90.0, tilt_deg=25.0),
            ],
            year=2026,
            temperature_loss_percent=0.04,
        )

        self.assertEqual(len(result.timestamps), 8760)
        self.assertEqual(len(result.total_hourly_kwh), 8760)
        self.assertEqual(len(result.total_monthly_kwh), 12)
        self.assertEqual(len(result.segment_monthly_kwh["south"]), 12)
        self.assertGreater(result.total_annual_kwh, 0.0)
        self.assertGreater(result.segment_annual_kwh["south"], result.segment_annual_kwh["east"])


if __name__ == "__main__":
    unittest.main()
