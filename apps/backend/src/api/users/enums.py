from enum import StrEnum, auto


class UserRole(StrEnum):
    admin = auto()
    agent = auto()
    mentor = auto()
    participant = auto()
