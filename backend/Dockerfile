# ─── Stage 1: Build ───────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ─── Stage 2: Runtime ─────────────────────────────────────
FROM python:3.12-slim

# Security: run as non-root
RUN groupadd -r swastha && useradd -r -g swastha -d /app -s /sbin/nologin swastha

WORKDIR /app

# Install runtime PostgreSQL client lib only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Don't copy .env or db files (handled by .dockerignore)

# Own everything by the non-root user
RUN chown -R swastha:swastha /app

USER swastha

# Gunicorn will read this config
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "main:app", "-c", "gunicorn.conf.py"]
