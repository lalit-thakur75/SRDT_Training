import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = None
SessionLocal = None
Base = declarative_base()

try:
    # Attempt to connect to PostgreSQL with short timeout
    logger.info(f"Connecting to database: {DATABASE_URL}")
    test_engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 2} if "psycopg2" in DATABASE_URL else {}
    )
    with test_engine.connect() as conn:
        logger.info("Successfully connected to PostgreSQL database!")
    engine = test_engine
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database: sqlite:///./training.db")
    engine = create_engine("sqlite:///./training.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
