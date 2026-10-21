"""add priority_score to queue_entries

Revision ID: bc371a7a5dba
Revises: 93c1af4a1801
Create Date: 2026-10-21 21:24:50.219086

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'bc371a7a5dba'
down_revision: str | Sequence[str] | None = '93c1af4a1801'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('queue_entries', sa.Column('priority_score', sa.Integer(), nullable=False, server_default='25'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('queue_entries', 'priority_score')
