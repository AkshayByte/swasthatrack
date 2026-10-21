"""add prescription_items table

Revision ID: 93c1af4a1801
Revises: 07b0e45be844
Create Date: 2026-10-21 21:18:08.816051

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '93c1af4a1801'
down_revision: str | Sequence[str] | None = '07b0e45be844'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'prescription_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('prescription_id', sa.Integer(), nullable=False),
        sa.Column('medicine_id', sa.Integer(), nullable=True),
        sa.Column('medicine_name', sa.String(length=200), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('dosage', sa.String(length=200), nullable=True),
        sa.Column('frequency', sa.String(length=200), nullable=True),
        sa.Column('duration', sa.String(length=200), nullable=True),
        sa.Column('instructions', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['medicine_id'], ['medicines.id'], ),
        sa.ForeignKeyConstraint(['prescription_id'], ['prescriptions.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_prescription_items_prescription_id'), 'prescription_items', ['prescription_id'], unique=False)
    op.create_index(op.f('ix_prescription_items_medicine_id'), 'prescription_items', ['medicine_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_prescription_items_medicine_id'), table_name='prescription_items')
    op.drop_index(op.f('ix_prescription_items_prescription_id'), table_name='prescription_items')
    op.drop_table('prescription_items')
