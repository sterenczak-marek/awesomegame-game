import random

from awesome_users.models import GameUser
from awesome_rooms.models import AbstractRoom
from django.contrib.sites.models import Site
from django.db import models


def get_random_map_positions():
    max_pos = 200
    x = random.randint(-max_pos, max_pos)
    y = random.randint(-max_pos, max_pos)

    return x, y


class Room(AbstractRoom):
    panel_room_id = models.PositiveIntegerField()
    panel_room_slug = models.CharField(max_length=256)


class Player(GameUser):
    # pos_x = models.IntegerField(null=True, blank=True)
    # pos_y = models.IntegerField(null=True, blank=True)

    __positions = None

    room = models.ForeignKey(Room, null=True, on_delete=models.SET_NULL, related_name='users')
    panel_user_id = models.PositiveIntegerField(null=True)

    username = models.CharField(
        max_length=30,
        unique=False,
    )

    @property
    def positions(self):
        if not self.__positions:
            self.__positions = get_random_map_positions()

        return self.__positions


class PanelAuthentication(models.Model):
    token = models.CharField(max_length=256)
    site = models.OneToOneField(Site, related_name='panel_authentication')

    class Meta:
        db_table = 'site_authentication'
