from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from math import asin, atan2, cos, degrees, pi, radians, sin, tan
from typing import TYPE_CHECKING
from zoneinfo import ZoneInfo

from .domain import LossProfile, PVSegment, SolarSite

if TYPE_CHECKING:
    import plotly.graph_objects as go

UTRECHT_SITE = SolarSite(
    name="Utrecht",
    latitude=52.0907,
    longitude=5.1214,
)

MONTH_LABELS = (
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
)

COMPASS_LABELS = (
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
)


@dataclass(slots=True)
class SolarSimulationResult:
    site: SolarSite
    year: int
    timestamps: list[datetime]
    segments: list[PVSegment]
    segment_hourly_kwh: dict[str, list[float]]
    segment_monthly_kwh: dict[str, list[float]]
    total_hourly_kwh: list[float]
    total_monthly_kwh: list[float]
    segment_annual_kwh: dict[str, float]
    total_annual_kwh: float

    def summary_rows(self) -> list[dict[str, float | str]]:
        rows: list[dict[str, float | str]] = []
        for segment in self.segments:
            rows.append(
                {
                    "segment": segment.name,
                    "capacity_kwp": segment.capacity_kwp,
                    "azimuth_deg": segment.azimuth_deg,
                    "tilt_deg": segment.tilt_deg,
                    "annual_kwh": self.segment_annual_kwh[segment.name],
                }
            )
        rows.append(
            {
                "segment": "Total",
                "capacity_kwp": sum(segment.capacity_kwp for segment in self.segments),
                "azimuth_deg": float("nan"),
                "tilt_deg": float("nan"),
                "annual_kwh": self.total_annual_kwh,
            }
        )
        return rows


def compass_label_for_azimuth(azimuth_deg: float) -> str:
    normalized = azimuth_deg % 360.0
    index = int((normalized + 22.5) // 45.0) % 8
    return COMPASS_LABELS[index]


def _validate_segments(segments: list[PVSegment]) -> None:
    if not segments:
        raise ValueError("at least one PV segment is required")
    for segment in segments:
        if segment.capacity_kwp <= 0:
            raise ValueError(f"segment {segment.name!r} must have positive capacity")
        if segment.tilt_deg < 0 or segment.tilt_deg > 90:
            raise ValueError(f"segment {segment.name!r} tilt must be between 0 and 90 degrees")


def _declination_and_equation_of_time(day_of_year: int, fractional_hour: float) -> tuple[float, float]:
    gamma = 2.0 * pi / 365.0 * (day_of_year - 1 + (fractional_hour - 12.0) / 24.0)

    declination = (
        0.006918
        - 0.399912 * cos(gamma)
        + 0.070257 * sin(gamma)
        - 0.006758 * cos(2.0 * gamma)
        + 0.000907 * sin(2.0 * gamma)
        - 0.002697 * cos(3.0 * gamma)
        + 0.00148 * sin(3.0 * gamma)
    )

    equation_of_time = 229.18 * (
        0.000075
        + 0.001868 * cos(gamma)
        - 0.032077 * sin(gamma)
        - 0.014615 * cos(2.0 * gamma)
        - 0.040849 * sin(2.0 * gamma)
    )

    return declination, equation_of_time


def _solar_position(timestamp: datetime, site: SolarSite) -> tuple[float, float]:
    local_time = timestamp.astimezone(ZoneInfo(site.timezone))
    day_of_year = local_time.timetuple().tm_yday
    fractional_hour = local_time.hour + local_time.minute / 60.0 + local_time.second / 3600.0

    declination_rad, equation_of_time_minutes = _declination_and_equation_of_time(day_of_year, fractional_hour)
    timezone_offset_hours = local_time.utcoffset().total_seconds() / 3600.0 if local_time.utcoffset() else 0.0

    true_solar_time_minutes = (
        fractional_hour * 60.0
        + equation_of_time_minutes
        + 4.0 * site.longitude
        - 60.0 * timezone_offset_hours
    ) % 1440.0

    hour_angle_deg = true_solar_time_minutes / 4.0 - 180.0
    if hour_angle_deg < -180.0:
        hour_angle_deg += 360.0

    latitude_rad = radians(site.latitude)
    hour_angle_rad = radians(hour_angle_deg)

    altitude_rad = asin(
        sin(latitude_rad) * sin(declination_rad)
        + cos(latitude_rad) * cos(declination_rad) * cos(hour_angle_rad)
    )

    azimuth_rad = atan2(
        sin(hour_angle_rad),
        cos(hour_angle_rad) * sin(latitude_rad) - tan(declination_rad) * cos(latitude_rad),
    ) + pi

    return degrees(altitude_rad), degrees(azimuth_rad) % 360.0


def _seasonal_clear_sky_factor(day_of_year: int) -> float:
    seasonal_variation = 0.12 * cos(2.0 * pi * (day_of_year - 172) / 365.0)
    return max(0.65, min(0.95, 0.78 + seasonal_variation))


def _segment_output_kwh(
    timestamp: datetime,
    segment: PVSegment,
    site: SolarSite,
    loss_profile: LossProfile,
) -> float:
    altitude_deg, solar_azimuth_deg = _solar_position(timestamp, site)
    if altitude_deg <= 0.0:
        return 0.0

    altitude_rad = radians(altitude_deg)
    solar_azimuth_rad = radians(solar_azimuth_deg)
    panel_azimuth_rad = radians(segment.azimuth_deg % 360.0)
    panel_tilt_rad = radians(segment.tilt_deg)

    cos_incidence = (
        sin(altitude_rad) * cos(panel_tilt_rad)
        + cos(altitude_rad) * sin(panel_tilt_rad) * cos(solar_azimuth_rad - panel_azimuth_rad)
    )
    direct_orientation_gain = max(0.0, cos_incidence) / max(0.05, sin(altitude_rad))
    direct_orientation_gain = min(1.8, direct_orientation_gain)

    day_of_year = timestamp.timetuple().tm_yday
    seasonal_factor = _seasonal_clear_sky_factor(day_of_year)
    horizontal_irradiance_ratio = max(0.0, sin(altitude_rad)) * seasonal_factor

    return segment.capacity_kwp * horizontal_irradiance_ratio * direct_orientation_gain * loss_profile.combined_factor()


def simulate_pv_system(
    segments: list[PVSegment],
    *,
    year: int = 2026,
    site: SolarSite = UTRECHT_SITE,
    temperature_loss_percent: float = 0.0,
    inverter_efficiency: float = 0.97,
    wiring_loss: float = 0.02,
    shading_loss: float = 0.03,
    soiling_loss: float = 0.02,
) -> SolarSimulationResult:
    _validate_segments(segments)

    loss_profile = LossProfile(
        inverter_efficiency=inverter_efficiency,
        wiring_loss=wiring_loss,
        shading_loss=shading_loss,
        soiling_loss=soiling_loss,
        temperature_loss_percent=temperature_loss_percent,
    )

    timezone = ZoneInfo(site.timezone)
    current = datetime(year, 1, 1, tzinfo=timezone)
    end = datetime(year + 1, 1, 1, tzinfo=timezone)

    timestamps: list[datetime] = []
    segment_hourly_kwh: dict[str, list[float]] = {segment.name: [] for segment in segments}
    segment_monthly_kwh: dict[str, list[float]] = {segment.name: [0.0] * 12 for segment in segments}
    total_hourly_kwh: list[float] = []
    total_monthly_kwh: list[float] = [0.0] * 12
    segment_annual_kwh: dict[str, float] = {segment.name: 0.0 for segment in segments}

    while current < end:
        timestamps.append(current)
        total_for_hour = 0.0

        for segment in segments:
            segment_value = _segment_output_kwh(current, segment, site, loss_profile)
            segment_hourly_kwh[segment.name].append(segment_value)
            segment_monthly_kwh[segment.name][current.month - 1] += segment_value
            segment_annual_kwh[segment.name] += segment_value
            total_for_hour += segment_value

        total_hourly_kwh.append(total_for_hour)
        total_monthly_kwh[current.month - 1] += total_for_hour
        current += timedelta(hours=1)

    total_annual_kwh = sum(total_hourly_kwh)

    return SolarSimulationResult(
        site=site,
        year=year,
        timestamps=timestamps,
        segments=segments,
        segment_hourly_kwh=segment_hourly_kwh,
        segment_monthly_kwh=segment_monthly_kwh,
        total_hourly_kwh=total_hourly_kwh,
        total_monthly_kwh=total_monthly_kwh,
        segment_annual_kwh=segment_annual_kwh,
        total_annual_kwh=total_annual_kwh,
    )


def build_hourly_figure(result: SolarSimulationResult) -> go.Figure:
    import plotly.graph_objects as go

    hours = list(range(24))
    total_by_hour = [0.0] * 24
    segment_by_hour: dict[str, list[float]] = {
        segment.name: [0.0] * 24 for segment in result.segments
    }
    hour_counts = [0] * 24

    for index, timestamp in enumerate(result.timestamps):
        hour = timestamp.hour
        hour_counts[hour] += 1
        total_by_hour[hour] += result.total_hourly_kwh[index]
        for segment in result.segments:
            segment_by_hour[segment.name][hour] += result.segment_hourly_kwh[segment.name][index]

    for hour in hours:
        if hour_counts[hour] == 0:
            continue
        total_by_hour[hour] /= hour_counts[hour]
        for segment in result.segments:
            segment_by_hour[segment.name][hour] /= hour_counts[hour]

    figure = go.Figure()
    figure.add_trace(
        go.Scatter(
            x=hours,
            y=total_by_hour,
            mode="lines",
            name="Total",
            line=dict(width=3, color="#1f77b4"),
        )
    )

    for segment in result.segments:
        figure.add_trace(
            go.Scatter(
                x=hours,
                y=segment_by_hour[segment.name],
                mode="lines",
                name=segment.name,
                line=dict(width=1.5),
                opacity=0.7,
            )
        )

    figure.update_layout(
        title=f"Average hourly PV production by hour of day in {result.site.name}",
        xaxis_title="Hour of day",
        yaxis_title="kWh per hour",
        hovermode="x unified",
        template="plotly_white",
        legend_title_text="Series",
    )
    return figure


def build_monthly_figure(result: SolarSimulationResult) -> go.Figure:
    from plotly.subplots import make_subplots
    import plotly.graph_objects as go

    figure = make_subplots(specs=[[{"secondary_y": True}]])

    for segment in result.segments:
        figure.add_trace(
            go.Bar(
                x=MONTH_LABELS,
                y=result.segment_monthly_kwh[segment.name],
                name=segment.name,
            ),
            secondary_y=False,
        )

    figure.add_trace(
        go.Scatter(
            x=MONTH_LABELS,
            y=result.total_monthly_kwh,
            mode="lines+markers",
            name="Total",
            line=dict(width=3, color="#111111"),
        ),
        secondary_y=True,
    )

    figure.update_layout(
        title=f"Monthly PV production in {result.site.name}",
        barmode="stack",
        template="plotly_white",
        legend_title_text="Series",
    )
    figure.update_yaxes(title_text="Segment energy (kWh)", secondary_y=False)
    figure.update_yaxes(title_text="Total energy (kWh)", secondary_y=True)
    return figure


def build_segment_comparison_figure(result: SolarSimulationResult) -> go.Figure:
    import plotly.graph_objects as go

    figure = go.Figure(
        data=[
            go.Bar(
                x=[segment.name for segment in result.segments],
                y=[result.segment_annual_kwh[segment.name] for segment in result.segments],
                text=[f"{result.segment_annual_kwh[segment.name]:.0f} kWh" for segment in result.segments],
                textposition="auto",
                marker_color="#2ca02c",
            )
        ]
    )
    figure.update_layout(
        title=f"Annual segment comparison in {result.site.name}",
        xaxis_title="PV segment",
        yaxis_title="Annual energy (kWh)",
        template="plotly_white",
    )
    return figure
