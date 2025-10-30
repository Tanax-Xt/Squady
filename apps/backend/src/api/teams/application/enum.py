from enum import StrEnum, auto


class ApplicationStatusEnum(StrEnum):
    sent = auto()
    accepted = auto()
    rejected = auto()
