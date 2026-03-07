from app.models import RoundStatus
from app.schemas import (
    CourseCreate,
    HoleScoreUpsert,
    RoundCreate,
    RoundPlayerCreate,
    ShotContributionCreate,
)
from app.services.errors import ConflictError, LockedRoundError, ValidationError
from app.services.round_service import RoundService


def test_round_has_max_four_players(db_session) -> None:
    service = RoundService(db_session)
    round_obj = service.create_round(RoundCreate())

    for idx in range(1, 5):
        service.add_player(round_obj.id, RoundPlayerCreate(display_name=f"P{idx}", sort_order=idx))

    try:
        service.add_player(round_obj.id, RoundPlayerCreate(display_name="P5", sort_order=4))
        raised = False
    except ValidationError:
        raised = True

    assert raised


def test_completed_round_is_locked(db_session) -> None:
    service = RoundService(db_session)
    round_obj = service.create_round(RoundCreate())
    service.add_player(round_obj.id, RoundPlayerCreate(display_name="A", sort_order=1))
    completed = service.complete_round(round_obj.id)

    assert completed.status == RoundStatus.COMPLETED

    try:
        service.upsert_hole_score(round_obj.id, 1, HoleScoreUpsert(score=4, completed=True))
        raised = False
    except LockedRoundError:
        raised = True

    assert raised


def test_contribution_uniqueness(db_session) -> None:
    service = RoundService(db_session)
    round_obj = service.create_round(RoundCreate())
    player = service.add_player(round_obj.id, RoundPlayerCreate(display_name="A", sort_order=1))

    service.add_shot_contributions(
        round_obj.id,
        1,
        ShotContributionCreate(shot_number=1, round_player_ids=[player.id], shot_type="drive"),
    )

    try:
        service.add_shot_contributions(
            round_obj.id,
            1,
            ShotContributionCreate(shot_number=1, round_player_ids=[player.id], shot_type="drive"),
        )
        raised = False
    except ConflictError:
        raised = True

    assert raised


def test_hole_score_upsert_updates_existing_record(db_session) -> None:
    service = RoundService(db_session)
    round_obj = service.create_round(RoundCreate())
    service.add_player(round_obj.id, RoundPlayerCreate(display_name="A", sort_order=1))

    first = service.upsert_hole_score(
        round_obj.id,
        3,
        HoleScoreUpsert(score=5, par_snapshot=4, completed=False),
    )
    second = service.upsert_hole_score(
        round_obj.id,
        3,
        HoleScoreUpsert(score=4, par_snapshot=4, completed=True),
    )

    assert first.id == second.id
    assert second.score == 4
    assert second.completed is True


def test_course_search_requires_minimum_query_length(db_session) -> None:
    service = RoundService(db_session)
    service.create_course(
        CourseCreate(
            name="Pebble Beach Golf Links",
            city="Pebble Beach",
            state="CA",
            country="USA",
            total_holes=18,
            source="manual",
        )
    )

    try:
        service.search_courses(" ")
        raised = False
    except ValidationError:
        raised = True

    assert raised


def test_course_search_trims_whitespace(db_session) -> None:
    service = RoundService(db_session)
    service.create_course(
        CourseCreate(
            name="Augusta National",
            city="Augusta",
            state="GA",
            country="USA",
            total_holes=18,
            source="manual",
        )
    )

    results = service.search_courses("  Augusta  ")
    assert len(results) == 1
    assert results[0].name == "Augusta National"
