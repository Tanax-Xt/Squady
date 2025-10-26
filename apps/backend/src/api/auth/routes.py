from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from src.api.auth.deps import PasswordRequestFormDepends
from src.api.auth.schemas import AccessTokenResponse, UserRegistrationConflictResponse
from src.api.tags import Tag
from src.api.users.enums import UserRole
from src.api.users.schemas import UserRegistrationRequest
from src.api.users.service import UserServiceDepends
from src.security import create_access_token, is_valid_password

router = APIRouter(prefix="/auth", tags=[Tag.AUTH])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: dict(
            model=AccessTokenResponse,
            description="Registraton was successful",
        ),
        status.HTTP_409_CONFLICT: dict(
            model=UserRegistrationConflictResponse,
            description="Username or email already registered",
        ),
    },
    response_model=AccessTokenResponse,
)
async def register(args: UserRegistrationRequest, service: UserServiceDepends) -> AccessTokenResponse | JSONResponse:
    if await service.get_user_by_username(args.username):
        return JSONResponse(
            content=UserRegistrationConflictResponse(
                subject="username",
                message="The username is already taken.",
            ).model_dump(),
            status_code=status.HTTP_409_CONFLICT,
        )

    if await service.get_user_by_email(args.email):
        return JSONResponse(
            content=UserRegistrationConflictResponse(
                subject="email",
                message="The email address is already registered.",
            ).model_dump(),
            status_code=status.HTTP_409_CONFLICT,
        )

    user = await service.create_user(args)

    return create_access_token(user.id)


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: dict(
            description="Login was successful",
        ),
        status.HTTP_401_UNAUTHORIZED: dict(
            description="Incorrect username or password",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Administrators are not allowed to log in",
        ),
    },
)
async def login(form: PasswordRequestFormDepends, service: UserServiceDepends) -> AccessTokenResponse:
    user = await service.get_user_by_username(form.username)

    if not user:
        user = await service.get_user_by_email(form.username)

    if not user or not is_valid_password(form.password, user.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect username or password.")

    if user.role == UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Administrators are not allowed to log in.")

    return create_access_token(user.id)
