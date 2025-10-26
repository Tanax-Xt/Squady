from typer import Typer

from cli import populate, superuser

app = Typer()

app.add_typer(populate.app)
app.add_typer(superuser.app)
