from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Settings:
    app_slug: str
    app_display_name: str
    api_prefix: str
    frontend_origins: tuple[str, ...]


def load_settings() -> Settings:
    origins_raw = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    frontend_origins = tuple(origin.strip() for origin in origins_raw.split(",") if origin.strip())

    return Settings(
        app_slug=os.getenv("APP_SLUG", "hes"),
        app_display_name=os.getenv("APP_DISPLAY_NAME", "HES"),
        api_prefix=os.getenv("API_PREFIX", "/api/v1"),
        frontend_origins=frontend_origins,
    )


settings = load_settings()
