from enum import StrEnum, auto


class StatusEnum(StrEnum):
    active = auto()
    in_check = auto()
    finished = auto()


class MemberStatusEnum(StrEnum):
    active = auto()
    in_check = auto()
