from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .lab_orders import router as lab_orders_router
from .medicine import router as medicine_router
from .patients import router as patients_router
from .prescriptions import router as prescriptions_router
from .queue import router as queue_router

__all__ = [
    "auth_router",
    "dashboard_router",
    "lab_orders_router",
    "medicine_router",
    "patients_router",
    "prescriptions_router",
    "queue_router",
]
