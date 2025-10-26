from fastapi_mail import FastMail

from src.settings import settings

fm = FastMail(settings.email.config)
