"""
Reset Google-account passwords that were created with the predictable pattern.

Background:
    Before the fix, users created through /auth/google received a password hash
    derived from their email: get_password_hash("OAuth_Google_Managed_" + email).
    This means /auth/login and /auth/token accepted a trivially guessable password.

This script finds every user whose stored hash verifies against the old
predictable pattern and re-hashes it with a fresh random token
(secrets.token_urlsafe(32)), rendering the old password invalid.

The script only operates on a LOCAL SQLite file (the default dev database).
It will refuse to run against any PostgreSQL / production database.

Usage:
    cd backend
    python scripts/reset_google_passwords.py            # dry-run (default)
    python scripts/reset_google_passwords.py --apply    # actually update passwords
"""

import argparse
import os
import secrets
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import DATABASE_URL, SessionLocal
from models.user import User
from utils.security import get_password_hash, verify_password

OLD_PASSWORD_PATTERN = "OAuth_Google_Managed_"


def _is_local_sqlite() -> bool:
    return DATABASE_URL.startswith("sqlite")


def _is_test_database() -> bool:
    return os.getenv("TESTING") == "true" or "test" in (DATABASE_URL or "").lower()


def reset_google_passwords(apply: bool = False) -> int:
    if not _is_local_sqlite():
        print(
            "ERROR: This script only runs against a local SQLite database. "
            f"Current DATABASE_URL: {DATABASE_URL}"
        )
        return 1

    if _is_test_database():
        print(
            "ERROR: This script will not run in a test environment. "
            "Use your own local SQLite file instead."
        )
        return 1

    db = SessionLocal()
    try:
        users = db.query(User).all()
        affected = []

        for user in users:
            if not user.hashed_password:
                continue

            predictable = OLD_PASSWORD_PATTERN + user.email.lower()
            if verify_password(predictable, user.hashed_password):
                affected.append(user)

        if not affected:
            print("No users found with the old predictable Google password pattern.")
            return 0

        print(f"Found {len(affected)} user(s) with the old predictable Google password:")
        for u in affected:
            print(f"  - id={u.id}  email={u.email}")

        if not apply:
            print("\nDry run: no changes made. Re-run with --apply to update.")
            return 0

        for u in affected:
            u.hashed_password = get_password_hash(secrets.token_urlsafe(32))
        db.commit()
        print(f"\nUpdated {len(affected)} user password(s) to random secure values.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Reset old predictable Google-account passwords to random secure values."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually apply the password reset. Without this flag, the script runs in dry-run mode.",
    )
    args = parser.parse_args()

    sys.exit(reset_google_passwords(apply=args.apply))
