"""add round ownership field

Revision ID: 20260314_0004
Revises: 20260313_0003
Create Date: 2026-03-14 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260314_0004"
down_revision: str | None = "20260313_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("rounds", sa.Column("owner_user_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_rounds_owner_user_id_users",
        "rounds",
        "users",
        ["owner_user_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index(op.f("ix_rounds_owner_user_id"), "rounds", ["owner_user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_rounds_owner_user_id"), table_name="rounds")
    op.drop_constraint("fk_rounds_owner_user_id_users", "rounds", type_="foreignkey")
    op.drop_column("rounds", "owner_user_id")
