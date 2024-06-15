import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('APP_DB_USERNAME', 'postgres')}:{os.getenv('APP_DB_PASSWORD', 'postgres')}@"
        f"{os.getenv('APP_DB_URL', 'localhost')}:{os.getenv('APP_DB_PORT', 5432)}/"
        f"{os.getenv('APP_DB_NAME', 'evt_db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
