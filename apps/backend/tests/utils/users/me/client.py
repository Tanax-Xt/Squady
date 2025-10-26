from httpx import AsyncClient, Response


class CurrentUserClient:
    def __init__(self, *, client: AsyncClient) -> None:
        self.client = client

    async def get_current_user(self, *, token: str | None = None) -> Response:
        return await self.client.get(
            "/users/me",
            headers=dict(authorization=f"Bearer {token}") if token else None,
        )

    async def update_current_user_username(self, *, username: str, token: str) -> Response:
        return await self.client.patch(
            "/users/me/username",
            json=dict(username=username),
            headers=dict(authorization=f"Bearer {token}"),
        )

    async def update_current_user_password(self, *, old_password: str, new_password: str, token: str) -> Response:
        return await self.client.patch(
            "/users/me/password",
            json=dict(old_password=old_password, new_password=new_password),
            headers=dict(authorization=f"Bearer {token}"),
        )
