from datetime import datetime

from pydantic import BaseModel


class AuditBaseModel(BaseModel):
    """Represents a response containing the auto-generated create and update timestamps."""

    created_at: datetime
    updated_at: datetime
