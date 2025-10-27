from datetime import datetime

from pydantic import BaseModel


class BaseSchema(BaseModel):
    """Base schema for all Pydantic models."""


class AuditBaseModel(BaseSchema):
    """Represents a response containing the auto-generated create and update timestamps."""

    created_at: datetime
    updated_at: datetime
