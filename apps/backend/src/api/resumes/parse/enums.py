from enum import StrEnum, auto


class ParsingSource(StrEnum):
    github = auto()
    pdf = auto()
    hh = auto()


class ParsingStatus(StrEnum):
    success_200 = auto()
    error_400 = auto()
    error_404 = auto()
    error_413 = auto()
    error_415 = auto()
