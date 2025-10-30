from typing import Annotated

from fastapi import Depends
from fastapi_mail import MessageSchema, MessageType

from src.api.teams.models import Team
from src.mail import fm
from src.template import render


class ApplicationToTeamMailingService:
    async def send_application_message(self, recipient: str, team: Team, url: str) -> None:
        message = self.generate_application_message(recipient, team.title, self.generate_link(team.id, url))

        await fm.send_message(message)

    @staticmethod
    def generate_link(team_id: str, url: str) -> str:
        return f"{url}/teams/{team_id}/join"

    @staticmethod
    def generate_application_message(recipient: str, team: str, link: str) -> MessageSchema:
        subject = "Приглашение в команду"

        context = dict(
            team=team,
            link=link,
        )

        body = render("application.jinja", context)

        return MessageSchema(recipients=[recipient], subject=subject, body=body, subtype=MessageType.html)


ApplicationToTeamMailingServiceDepends = Annotated[
    ApplicationToTeamMailingService, Depends(ApplicationToTeamMailingService)
]
