from typing import Annotated

from fastapi import Depends

from src.pagination.schemas import PaginationSearchParams

PaginationSearchParamsDepends = Annotated[PaginationSearchParams, Depends(PaginationSearchParams)]
