# ─── Stage 1: Build (compile dependencies in virtualenv) ───
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build tools for C-extensions if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment in /opt/venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# ─── Stage 2: Runtime (lean & secure) ───────────────────────
FROM python:3.12-slim

# Create dedicated non-root application user
RUN groupadd -r swastha && useradd -r -g swastha -d /app -s /sbin/nologin swastha

WORKDIR /app

# Install runtime PostgreSQL client library & curl for diagnostics
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder (paths match exactly at /opt/venv)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application code
COPY . .

# Set permissions for non-root user
RUN chown -R swastha:swastha /app

USER swastha

# Python environment flags
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000

EXPOSE 8000

CMD ["gunicorn", "main:app", "-c", "gunicorn.conf.py"]
