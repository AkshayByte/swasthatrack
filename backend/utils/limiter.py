import os
from slowapi import Limiter
from slowapi.util import get_remote_address

is_testing = os.getenv("TESTING", "").lower() in ["1", "true"]

# Shared Rate Limiter instance across FastAPI app and API route handlers
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[],
    enabled=not is_testing
)
