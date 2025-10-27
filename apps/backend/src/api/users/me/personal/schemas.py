from typing import Annotated

from pydantic import Field

from src.api.schemas import BaseSchema
from src.api.users.fields import UserAbout, UserBirthDate, UserCity, UserFullName, UserTelegram


class CurrentUserPersonalDataUpdateRequest(BaseSchema):
    city: UserCity | None = None
    about: UserAbout | None = None
    telegram: Annotated[UserTelegram, Field(default=None)]


class CurrentUserPersonalDataRequest(BaseSchema):
    full_name: UserFullName
    birth_date: UserBirthDate
    telegram: UserTelegram
    city: UserCity | None = None
    about: UserAbout | None = None


class CurrentUserPersonalDataResponse(BaseSchema):
    full_name: UserFullName | None
    birth_date: UserBirthDate | None
    city: UserCity | None
    about: UserAbout | None
    telegram: UserTelegram | None
