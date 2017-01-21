from __future__ import absolute_import

import json
import os
import random

import time
from celery import Celery

# set the default Django settings module for the 'celery' program.
from django.utils.crypto import get_random_string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')

from django.conf import settings  # noqa

app = Celery('proj')

# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def add(self):
    from awesome_rooms.models import Room
    from django.utils.encoding import force_text
    from ws4redis.publisher import RedisPublisher
    from ws4redis.redis_store import RedisMessage
    from .models import get_random_map_positions

    for room in Room.objects.filter(id=20):

        bonus_type = random.randint(0, 2)
        x, y = get_random_map_positions()
        data = {
            "type": "BONUS",
            "data": {
                "type": bonus_type,
                "x": x,
                "y": y,
                "unique_id": get_random_string(10)
            }
        }
        msg = RedisMessage(json.dumps(data))
        RedisPublisher(facility=force_text(room.slug), broadcast=True).publish_message(msg)
