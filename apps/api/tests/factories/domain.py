from app.models import Course, Round, RoundPlayer


def make_course(name: str = "Pebble Beach") -> Course:
    return Course(name=name, total_holes=18, source="test")


def make_round(notes: str | None = None) -> Round:
    return Round(notes=notes)


def make_round_player(round_id: int, display_name: str, sort_order: int) -> RoundPlayer:
    return RoundPlayer(round_id=round_id, display_name=display_name, sort_order=sort_order)
