from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import TYPE_CHECKING
from zoneinfo import ZoneInfo

from .domain import HeatPumpConfig, SolarSite
from .solar import MONTH_LABELS, UTRECHT_SITE

if TYPE_CHECKING:
    import plotly.graph_objects as go


DEFAULT_MONTHLY_WEIGHTS = (
    0.16,
    0.14,
    0.11,
    0.08,
    0.06,
    0.04,
    0.03,
    0.03,
    0.06,
    0.09,
    0.10,
    0.10,
)

DEFAULT_DAILY_WEIGHTS = (
    0.030,
    0.028,
    0.027,
    0.026,
    0.025,
    0.028,
    0.038,
    0.050,
    0.055,
    0.050,
    0.044,
    0.040,
    0.038,
    0.037,
    0.038,
    0.040,
    0.043,
    0.048,
    0.054,
    0.058,
    0.056,
    0.048,
    0.040,
    0.037,
)


@dataclass(slots=True)
class HeatPumpSimulationResult:
    site: SolarSite
    year: int
    config: HeatPumpConfig
    timestamps: list[datetime]
    hourly_electricity_kwh: list[float]
    monthly_electricity_kwh: list[float]
    annual_heat_demand_kwh: float
    annual_electricity_kwh: float
    average_cop: float

    def summary_rows(self) -> list[dict[str, float | str]]:
        return [
            {
                "metric": "Annual heat demand",
                "value": self.annual_heat_demand_kwh,
                "unit": "kWh heat",
            },
            {
                "metric": "Annual electricity consumption",
                "value": self.annual_electricity_kwh,
                "unit": "kWh electric",
            },
            {
                "metric": "Average COP",
                "value": self.average_cop,
                "unit": "-",
            },
        ]


@dataclass(slots=True)
class HeatPumpInteractionResult:
    simulation: HeatPumpSimulationResult
    hourly_solar_kwh: list[float]
    hourly_battery_kwh: list[float]
    hourly_grid_kwh: list[float]
    hourly_price_eur_per_kwh: list[float]
    solar_supplied_kwh: float
    battery_supplied_kwh: float
    grid_supplied_kwh: float
    annual_operating_cost_eur: float
    annual_co2_kg: float

    @property
    def solar_share(self) -> float:
        if self.simulation.annual_electricity_kwh <= 0.0:
            return 0.0
        return self.solar_supplied_kwh / self.simulation.annual_electricity_kwh

    @property
    def battery_share(self) -> float:
        if self.simulation.annual_electricity_kwh <= 0.0:
            return 0.0
        return self.battery_supplied_kwh / self.simulation.annual_electricity_kwh

    @property
    def grid_share(self) -> float:
        if self.simulation.annual_electricity_kwh <= 0.0:
            return 0.0
        return self.grid_supplied_kwh / self.simulation.annual_electricity_kwh

    def summary_rows(self) -> list[dict[str, float | str]]:
        return [
            {
                "metric": "Solar supplied",
                "value": self.solar_supplied_kwh,
                "unit": "kWh",
            },
            {
                "metric": "Battery supplied",
                "value": self.battery_supplied_kwh,
                "unit": "kWh",
            },
            {
                "metric": "Grid supplied",
                "value": self.grid_supplied_kwh,
                "unit": "kWh",
            },
            {
                "metric": "Annual operating cost",
                "value": self.annual_operating_cost_eur,
                "unit": "EUR",
            },
            {
                "metric": "Annual CO2",
                "value": self.annual_co2_kg,
                "unit": "kg",
            },
        ]


def _validate_heat_pump_config(config: HeatPumpConfig) -> None:
    if not config.enabled:
        return
    if config.annual_heat_demand_kwh <= 0.0:
        raise ValueError("annual heat demand must be positive when heat pump is enabled")
    if config.seasonal_cop <= 0.0:
        raise ValueError("seasonal COP must be positive")


def _validate_weights(weights: tuple[float, ...], expected_length: int, name: str) -> None:
    if len(weights) != expected_length:
        raise ValueError(f"{name} must contain exactly {expected_length} values")
    if any(weight < 0.0 for weight in weights):
        raise ValueError(f"{name} cannot contain negative weights")
    total = sum(weights)
    if total <= 0.0:
        raise ValueError(f"{name} must sum to a positive value")


def _normalized(weights: tuple[float, ...]) -> list[float]:
    total = sum(weights)
    return [weight / total for weight in weights]


def simulate_heat_pump(
    config: HeatPumpConfig,
    *,
    year: int = 2026,
    site: SolarSite = UTRECHT_SITE,
    monthly_weights: tuple[float, ...] = DEFAULT_MONTHLY_WEIGHTS,
    daily_weights: tuple[float, ...] = DEFAULT_DAILY_WEIGHTS,
) -> HeatPumpSimulationResult:
    _validate_heat_pump_config(config)
    _validate_weights(monthly_weights, 12, "monthly_weights")
    _validate_weights(daily_weights, 24, "daily_weights")

    annual_electricity_kwh = 0.0
    if config.enabled:
        annual_electricity_kwh = config.annual_heat_demand_kwh / config.seasonal_cop

    normalized_monthly = _normalized(monthly_weights)
    normalized_daily = _normalized(daily_weights)

    timezone = ZoneInfo(site.timezone)
    current = datetime(year, 1, 1, tzinfo=timezone)
    end = datetime(year + 1, 1, 1, tzinfo=timezone)

    timestamps: list[datetime] = []
    hourly_electricity_kwh: list[float] = []
    monthly_electricity_kwh: list[float] = [0.0] * 12

    # Distribute monthly consumption across each month's hours using a fixed daily shape.
    days_in_month = [0] * 12
    probe = current
    while probe < end:
        days_in_month[probe.month - 1] += 1
        probe += timedelta(days=1)

    monthly_targets = [annual_electricity_kwh * weight for weight in normalized_monthly]
    hourly_targets_by_month = [
        target / max(1, days_in_month[index]) for index, target in enumerate(monthly_targets)
    ]

    while current < end:
        timestamps.append(current)
        month_index = current.month - 1
        hour_target = hourly_targets_by_month[month_index] * normalized_daily[current.hour]
        hourly_electricity_kwh.append(hour_target)
        monthly_electricity_kwh[month_index] += hour_target
        current += timedelta(hours=1)

    return HeatPumpSimulationResult(
        site=site,
        year=year,
        config=config,
        timestamps=timestamps,
        hourly_electricity_kwh=hourly_electricity_kwh,
        monthly_electricity_kwh=monthly_electricity_kwh,
        annual_heat_demand_kwh=config.annual_heat_demand_kwh if config.enabled else 0.0,
        annual_electricity_kwh=sum(hourly_electricity_kwh),
        average_cop=config.seasonal_cop if config.enabled else 0.0,
    )


def simulate_heat_pump_interaction(
    simulation: HeatPumpSimulationResult,
    *,
    pv_hourly_kwh: list[float] | None = None,
    battery_hourly_kwh: list[float] | None = None,
    dynamic_price_eur_per_kwh: list[float] | None = None,
    default_price_eur_per_kwh: float = 0.30,
    grid_co2_kg_per_kwh: float = 0.35,
) -> HeatPumpInteractionResult:
    horizon = len(simulation.hourly_electricity_kwh)

    pv = pv_hourly_kwh if pv_hourly_kwh is not None else [0.0] * horizon
    battery = battery_hourly_kwh if battery_hourly_kwh is not None else [0.0] * horizon
    prices = dynamic_price_eur_per_kwh if dynamic_price_eur_per_kwh is not None else [default_price_eur_per_kwh] * horizon

    if len(pv) != horizon:
        raise ValueError("pv_hourly_kwh must match heat pump horizon")
    if len(battery) != horizon:
        raise ValueError("battery_hourly_kwh must match heat pump horizon")
    if len(prices) != horizon:
        raise ValueError("dynamic_price_eur_per_kwh must match heat pump horizon")

    hourly_solar_kwh: list[float] = []
    hourly_battery_kwh: list[float] = []
    hourly_grid_kwh: list[float] = []

    annual_cost = 0.0
    for demand, pv_available, battery_available, price in zip(
        simulation.hourly_electricity_kwh, pv, battery, prices
    ):
        from_solar = min(demand, max(0.0, pv_available))
        remaining_after_solar = demand - from_solar
        from_battery = min(remaining_after_solar, max(0.0, battery_available))
        from_grid = max(0.0, remaining_after_solar - from_battery)

        hourly_solar_kwh.append(from_solar)
        hourly_battery_kwh.append(from_battery)
        hourly_grid_kwh.append(from_grid)
        annual_cost += from_grid * max(0.0, price)

    solar_supplied_kwh = sum(hourly_solar_kwh)
    battery_supplied_kwh = sum(hourly_battery_kwh)
    grid_supplied_kwh = sum(hourly_grid_kwh)
    annual_co2_kg = grid_supplied_kwh * max(0.0, grid_co2_kg_per_kwh)

    return HeatPumpInteractionResult(
        simulation=simulation,
        hourly_solar_kwh=hourly_solar_kwh,
        hourly_battery_kwh=hourly_battery_kwh,
        hourly_grid_kwh=hourly_grid_kwh,
        hourly_price_eur_per_kwh=prices,
        solar_supplied_kwh=solar_supplied_kwh,
        battery_supplied_kwh=battery_supplied_kwh,
        grid_supplied_kwh=grid_supplied_kwh,
        annual_operating_cost_eur=annual_cost,
        annual_co2_kg=annual_co2_kg,
    )


def heat_pump_validation_warnings(
    config: HeatPumpConfig,
    *,
    household_consumption_kwh: float | None = None,
) -> list[str]:
    warnings: list[str] = []

    if config.enabled and config.seasonal_cop < 2.5:
        warnings.append("COP below 2.5 may be unrealistic.")

    if config.enabled and config.annual_heat_demand_kwh > 12000:
        warnings.append("Heat demand is very high for an A++++ home.")

    if (
        config.enabled
        and household_consumption_kwh is not None
        and household_consumption_kwh > 0.0
        and (config.annual_heat_demand_kwh / config.seasonal_cop) > household_consumption_kwh
    ):
        warnings.append("Heat pump electricity consumption exceeds household consumption.")

    return warnings


def heat_pump_explainability_summary(interaction: HeatPumpInteractionResult) -> str:
    simulation = interaction.simulation
    return (
        f"The heat pump consumes approximately {simulation.annual_electricity_kwh:.0f} kWh of electricity "
        f"per year to provide {simulation.annual_heat_demand_kwh:.0f} kWh of heat (average COP {simulation.average_cop:.1f}). "
        f"Around {interaction.solar_share * 100.0:.0f}% is supplied by solar, "
        f"{interaction.battery_share * 100.0:.0f}% by battery, and {interaction.grid_share * 100.0:.0f}% by grid."
    )


def _hourly_average(series: list[float], timestamps: list[datetime]) -> list[float]:
    totals = [0.0] * 24
    counts = [0] * 24
    for timestamp, value in zip(timestamps, series):
        hour = timestamp.hour
        totals[hour] += value
        counts[hour] += 1
    for hour in range(24):
        if counts[hour] > 0:
            totals[hour] /= counts[hour]
    return totals


def build_heat_pump_monthly_figure(result: HeatPumpSimulationResult) -> go.Figure:
    import plotly.graph_objects as go

    figure = go.Figure(
        data=[
            go.Bar(
                x=MONTH_LABELS,
                y=result.monthly_electricity_kwh,
                marker_color="#d62728",
                name="Heat pump electricity",
            )
        ]
    )
    figure.update_layout(
        title=f"Monthly heat pump electricity in {result.site.name}",
        xaxis_title="Month",
        yaxis_title="Electricity (kWh)",
        template="plotly_white",
    )
    return figure


def build_heat_pump_energy_source_breakdown_figure(interaction: HeatPumpInteractionResult) -> go.Figure:
    import plotly.graph_objects as go

    figure = go.Figure(
        data=[
            go.Pie(
                labels=["Solar", "Battery", "Grid"],
                values=[
                    interaction.solar_supplied_kwh,
                    interaction.battery_supplied_kwh,
                    interaction.grid_supplied_kwh,
                ],
            )
        ]
    )
    figure.update_layout(
        title="Heat pump electricity source breakdown",
        template="plotly_white",
    )
    return figure


def build_heat_pump_daily_profile_figure(
    interaction: HeatPumpInteractionResult,
    *,
    pv_hourly_kwh: list[float] | None = None,
) -> go.Figure:
    import plotly.graph_objects as go

    timestamps = interaction.simulation.timestamps
    hp_hourly = _hourly_average(interaction.simulation.hourly_electricity_kwh, timestamps)
    price_hourly = _hourly_average(interaction.hourly_price_eur_per_kwh, timestamps)

    if pv_hourly_kwh is not None and len(pv_hourly_kwh) == len(timestamps):
        pv_hourly_avg = _hourly_average(pv_hourly_kwh, timestamps)
    else:
        pv_hourly_avg = [0.0] * 24

    figure = go.Figure()
    figure.add_trace(
        go.Scatter(
            x=list(range(24)),
            y=hp_hourly,
            mode="lines",
            name="Heat pump consumption",
            line=dict(color="#d62728", width=3),
        )
    )
    figure.add_trace(
        go.Scatter(
            x=list(range(24)),
            y=pv_hourly_avg,
            mode="lines",
            name="Solar production",
            line=dict(color="#ffbf00", width=2),
        )
    )
    figure.add_trace(
        go.Scatter(
            x=list(range(24)),
            y=price_hourly,
            mode="lines",
            name="Electricity price",
            yaxis="y2",
            line=dict(color="#1f77b4", width=2, dash="dot"),
        )
    )

    figure.update_layout(
        title="Average 24-hour profile: heat pump, solar, and price",
        xaxis_title="Hour of day",
        yaxis=dict(title="Energy (kWh)", side="left"),
        yaxis2=dict(title="Price (EUR/kWh)", overlaying="y", side="right"),
        hovermode="x unified",
        template="plotly_white",
    )
    return figure