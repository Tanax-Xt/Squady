from datetime import timezone, tzinfo
from typing import Annotated
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import Depends, Header
from pydantic_extra_types.timezone_name import TimeZoneName

TimeZoneNameHeader = Annotated[
    TimeZoneName,
    Header(
        alias="X-Timezone",
        description="User time zone",
    ),
]


def get_time_zone_info(time_zone_name: TimeZoneNameHeader = TimeZoneName("UTC")) -> tzinfo:
    try:
        return ZoneInfo(str(time_zone_name))
    except ZoneInfoNotFoundError:
        return timezone.utc


TimeZoneInfo = Annotated[tzinfo, Depends(get_time_zone_info)]
