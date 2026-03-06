import os
from collections.abc import Generator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app import models as _models  # noqa: F401
from app.db.base import Base


@pytest.fixture(scope="session")
def db_engine():
    test_url = os.getenv("TEST_DATABASE_URL", "sqlite+pysqlite:///:memory:")
    engine = create_engine(test_url, future=True)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    session_local = sessionmaker(bind=connection, autocommit=False, autoflush=False, class_=Session)
    session = session_local()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
