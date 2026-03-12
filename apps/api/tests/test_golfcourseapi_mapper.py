from app.integrations.golfcourseapi.mapper import to_detail
from app.integrations.golfcourseapi.schemas import GolfCourseApiCourse


def test_to_detail_maps_multiple_tee_sets_with_sequential_hole_numbers() -> None:
    course = GolfCourseApiCourse.model_validate(
        {
            "id": 77,
            "club_name": "Mapper Club",
            "course_name": "North",
            "location": {"city": "Austin", "state": "TX", "country": "USA"},
            "tees": {
                "male": [
                    {
                        "tee_name": "Blue",
                        "number_of_holes": 2,
                        "holes": [
                            {"par": 4, "yardage": 400, "handicap": 7},
                            {"par": 3, "yardage": 180, "handicap": 15},
                        ],
                    }
                ],
                "female": [
                    {
                        "tee_name": "Red",
                        "number_of_holes": 2,
                        "holes": [
                            {"par": 5, "yardage": 480, "handicap": 5},
                            {"par": 4, "yardage": 360, "handicap": 13},
                        ],
                    }
                ],
            },
        }
    )

    detail = to_detail(course)

    assert detail.total_holes == 2
    assert [hole.tee_name for hole in detail.holes] == ["Blue", "Blue", "Red", "Red"]
    assert [hole.hole_number for hole in detail.holes] == [1, 2, 1, 2]
    assert [hole.par for hole in detail.holes] == [4, 3, 5, 4]


def test_to_detail_disambiguates_duplicate_tee_names() -> None:
    course = GolfCourseApiCourse.model_validate(
        {
            "id": 88,
            "club_name": "Duplicate Tee Club",
            "course_name": "Main",
            "location": {"city": "San Ramon", "state": "CA", "country": "USA"},
            "tees": {
                "male": [
                    {
                        "tee_name": "Blue",
                        "number_of_holes": 1,
                        "holes": [{"par": 4, "yardage": 400, "handicap": 7}],
                    },
                    {
                        "tee_name": "Blue",
                        "number_of_holes": 1,
                        "holes": [{"par": 5, "yardage": 500, "handicap": 3}],
                    },
                ],
                "female": [],
            },
        }
    )

    detail = to_detail(course)
    assert [hole.tee_name for hole in detail.holes] == ["Blue", "Blue-2"]
