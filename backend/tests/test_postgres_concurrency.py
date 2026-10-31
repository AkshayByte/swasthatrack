import os
import threading
import time
from types import SimpleNamespace

import pytest

from database import Base
from models.medicine import Medicine

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "").strip()

pytestmark = pytest.mark.skipif(
    not TEST_DATABASE_URL.startswith(("postgres://", "postgresql://")),
    reason="Concurrency test requires TEST_DATABASE_URL pointing at PostgreSQL",
)


def test_concurrent_dispense_does_not_oversell(db_engine, db_session_factory):
    """Two concurrent stock deductions must never take the balance below zero."""
    Base.metadata.create_all(bind=db_engine)

    setup = db_session_factory()
    medicine = Medicine(name="Concurrency Med", current_stock=10, minimum_stock=0)
    setup.add(medicine)
    setup.commit()
    medicine_id = medicine.id
    setup.close()

    item = SimpleNamespace(
        medicine_id=medicine_id,
        quantity=7,
        medicine_name="Concurrency Med",
    )
    results = {}
    first_update_done = threading.Event()
    second_started = threading.Event()

    def first_worker():
        db = db_session_factory()
        try:
            results["first"] = Medicine.deduct_stock(db, [item])
            first_update_done.set()
            second_started.wait(timeout=5)
            time.sleep(0.2)
            db.commit()
        finally:
            db.close()

    def second_worker():
        first_update_done.wait(timeout=5)
        db = db_session_factory()
        try:
            second_started.set()
            results["second"] = Medicine.deduct_stock(db, [item])
            db.rollback()
        finally:
            db.close()

    threads = [
        threading.Thread(target=first_worker),
        threading.Thread(target=second_worker),
    ]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=10)

    check = db_session_factory()
    final_stock = check.query(Medicine).filter(Medicine.id == medicine_id).first().current_stock
    check.close()
    Base.metadata.drop_all(bind=db_engine)

    assert all(not thread.is_alive() for thread in threads)
    assert len(results) == 2
    assert sum(1 for insufficient, _ in results.values() if not insufficient) == 1
    assert sum(1 for insufficient, _ in results.values() if insufficient) == 1
    assert final_stock == 3
