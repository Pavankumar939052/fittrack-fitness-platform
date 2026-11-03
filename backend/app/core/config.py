from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FitTrack Fitness Platform"
    database_url: str = "sqlite:///./fittrack.db"
    secret_key: str = "fittrack-local-development-secret-change-before-deployment"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
