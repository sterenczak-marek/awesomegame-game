from django.core.management.base import BaseCommand, CommandError
from rest_framework.authtoken.models import Token
from src.game.models import Player


class Command(BaseCommand):
    def handle(self, *args, **options):
        (player, _) = Player.objects.get_or_create(username="admin", defaults={
            'password': "!"
        })
        (token, _) = Token.objects.get_or_create(user=player)

        return token.key
