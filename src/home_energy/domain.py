from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class SolarSite:
    name: str
    latitude: float
    longitude: float
    timezone: str = "Europe/Amsterdam"


@dataclass(frozen=True, slots=True)
class PVSegment:
    name: str
    capacity_kwp: float
    azimuth_deg: float
    tilt_deg: float


@dataclass(frozen=True, slots=True)
class LossProfile:
    inverter_efficiency: float = 0.97
    wiring_loss: float = 0.02
    shading_loss: float = 0.03
    soiling_loss: float = 0.02
    temperature_loss_percent: float = 0.0

    def combined_factor(self) -> float:
        return (
            self.inverter_efficiency
            * (1.0 - self.wiring_loss)
            * (1.0 - self.shading_loss)
            * (1.0 - self.soiling_loss)
            * (1.0 - self.temperature_loss_percent)
        )
