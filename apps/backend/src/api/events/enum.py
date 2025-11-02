from enum import StrEnum, auto


class EventType(StrEnum):
    offline = auto()
    online = auto()
    hybrid = auto()
