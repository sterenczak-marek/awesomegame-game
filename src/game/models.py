import random

from awesome_users.models import GameUser


def get_random_map_positions():
    max_pos = 200
    x = random.randint(-max_pos, max_pos)
    y = random.randint(-max_pos, max_pos)

    return x, y


class Player(GameUser):
    # pos_x = models.IntegerField(null=True, blank=True)
    # pos_y = models.IntegerField(null=True, blank=True)

    __positions = None

    @property
    def positions(self):
        if not self.__positions:
            self.__positions = get_random_map_positions()

        return self.__positions
