from typing import Annotated

from pydantic import BaseModel, Field

from src.api.users.fields import UserAbout, UserBirthDate, UserCity, UserFullName, UserTelegram


class CurrentUserPersonalDataUpdateRequest(BaseModel):
    city: UserCity | None = None
    about: UserAbout | None = None
    telegram: Annotated[UserTelegram, Field(default=None)]


class CurrentUserPersonalDataRequest(BaseModel):
    full_name: UserFullName
    birth_date: UserBirthDate
    telegram: UserTelegram
    city: UserCity | None = None
    about: UserAbout | None = None


class CurrentUserPersonalDataResponse(BaseModel):
    full_name: UserFullName | None
    birth_date: UserBirthDate | None
    city: UserCity | None
    about: UserAbout | None
    telegram: UserTelegram | None
