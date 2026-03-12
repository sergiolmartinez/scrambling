"""add external course snapshot fields

Revision ID: 20260307_0002
Revises: 20260306_0001
Create Date: 2026-03-07 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260307_0002"
down_revision: str | None = "20260306_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("courses", sa.Column("imported_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column(
        "courses",
        sa.Column("external_payload_hash", sa.String(length=64), nullable=True),
    )
    op.create_unique_constraint(
        "uq_course_source_external_id",
        "courses",
        ["source", "external_course_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_course_source_external_id", "courses", type_="unique")
    op.drop_column("courses", "external_payload_hash")
    op.drop_column("courses", "imported_at")
