import calendar
from datetime import date, datetime
from typing import List


def _parse_date_ym(d: str | None, *, is_end: bool = False) -> date | None:
    """
    Парсит дату в формате YYYY-MM.
    - для start (is_end=False) возвращает первый день месяца;
    - для end   (is_end=True)  возвращает последний день месяца.
    Возвращает None, если вход None или пустая строка.
    """
    if not d:
        return None
    d = d.strip()
    try:
        parts = d.split("-")
        if len(parts) >= 2:
            year = int(parts[0])
            month = int(parts[1])
            if not (1 <= month <= 12):
                raise ValueError("month out of range")
            if is_end:
                last_day = calendar.monthrange(year, month)[1]
                return date(year, month, last_day)
            else:
                return date(year, month, 1)
        dt = datetime.fromisoformat(d)
        return dt.date() if not is_end else dt.date()
    except Exception:
        try:
            dt = datetime.fromisoformat(d)
            return dt.date()
        except Exception:
            return None


def _merge_intervals(intervals: List[tuple[date, date]]) -> List[tuple[date, date]]:
    if not intervals:
        return []
    intervals = sorted(intervals, key=lambda x: x[0])
    merged = []
    cur_start, cur_end = intervals[0]
    for s, e in intervals[1:]:
        if s <= cur_end:
            if e > cur_end:
                cur_end = e
        else:
            merged.append((cur_start, cur_end))
            cur_start, cur_end = s, e
    merged.append((cur_start, cur_end))
    return merged


def _experience_years_from_json(experience_json: list[dict[str, str]]) -> float:
    """
    Вычисляет суммарные годы опыта, объединяя перекрывающиеся отрезки.
    Ожидает, что даты в experience items — в формате YYYY-MM (или None для end_date).
    Если end_date отсутствует — используется текущая дата.
    Возвращает число лет (float).
    """
    intervals = []
    today = date.today()
    for item in experience_json or []:
        raw_start = item.get("start_date")
        raw_end = item.get("end_date")
        s = _parse_date_ym(raw_start, is_end=False)
        e = _parse_date_ym(raw_end, is_end=True) if raw_end else today
        e = e if e is not None else today
        if s:
            if e < s:
                continue
            intervals.append((s, e))
    merged = _merge_intervals(intervals)
    total_days = sum((e - s).days + 1 for s, e in merged)
    years = total_days / 365.25
    return years
