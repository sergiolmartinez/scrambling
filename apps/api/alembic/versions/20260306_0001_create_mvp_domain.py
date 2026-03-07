"""create mvp domain tables

Revision ID: 20260306_0001
Revises:
Create Date: 2026-03-06 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260306_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


round_status = postgresql.ENUM(
    "draft",
    "active",
    "completed",
    name="round_status",
    create_type=False,
)


def upgrade() -> None:
    op.execute(
        """
        DO $$
        BEGIN
            CREATE TYPE round_status AS ENUM ('draft', 'active', 'completed');
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END $$;
        """
    )

    op.create_table(
        "courses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("external_course_id", sa.String(length=128), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=True),
        sa.Column("state", sa.String(length=100), nullable=True),
        sa.Column("country", sa.String(length=100), nullable=True),
        sa.Column("total_holes", sa.Integer(), nullable=False),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "rounds",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("status", round_status, nullable=False),
        sa.Column("course_id", sa.Integer(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "course_holes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("course_id", sa.Integer(), nullable=False),
        sa.Column("hole_number", sa.Integer(), nullable=False),
        sa.Column("par", sa.Integer(), nullable=False),
        sa.Column("yardage", sa.Integer(), nullable=True),
        sa.Column("handicap", sa.Integer(), nullable=True),
        sa.Column("tee_name", sa.String(length=64), nullable=False, server_default="default"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("course_id", "hole_number", "tee_name", name="uq_course_hole_tee"),
    )

    op.create_table(
        "round_players",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("round_id", sa.Integer(), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["round_id"], ["rounds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("round_id", "sort_order", name="uq_round_player_sort_order"),
    )

    op.create_table(
        "hole_scores",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("round_id", sa.Integer(), nullable=False),
        sa.Column("hole_number", sa.Integer(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("par_snapshot", sa.Integer(), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["round_id"], ["rounds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("round_id", "hole_number", name="uq_round_hole_score"),
    )

    op.create_table(
        "shot_contributions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("round_id", sa.Integer(), nullable=False),
        sa.Column("hole_number", sa.Integer(), nullable=False),
        sa.Column("shot_number", sa.Integer(), nullable=False),
        sa.Column("round_player_id", sa.Integer(), nullable=False),
        sa.Column("shot_type", sa.String(length=64), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(["round_id"], ["rounds.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["round_player_id"], ["round_players.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "round_id",
            "hole_number",
            "shot_number",
            "round_player_id",
            name="uq_round_hole_shot_player",
        ),
    )


def downgrade() -> None:
    op.drop_table("shot_contributions")
    op.drop_table("hole_scores")
    op.drop_table("round_players")
    op.drop_table("course_holes")
    op.drop_table("rounds")
    op.drop_table("courses")
    round_status.drop(op.get_bind(), checkfirst=True)
