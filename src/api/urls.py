# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from django.conf.urls import url

from .views import RoomCreateView

urlpatterns = [
    url(r'^rooms/create/$', RoomCreateView.as_view(), name="room-create"),
]
