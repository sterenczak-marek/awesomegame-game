import json

import requests
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.contrib.sites.models import Site
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from src.game.models import Room, PanelAuthentication
from .serializers import RoomSerializer, UserWinnerSerializer

UserModel = get_user_model()


class RoomCreateView(CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def create(self, request, *args, **kwargs):
        auth_token = request.data.pop('auth_token')

        PanelAuthentication.objects.update_or_create(site_id=2, defaults={
            'token': auth_token
        })

        return super(RoomCreateView, self).create(request, *args, **kwargs)


class UserWinView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    serializer_class = UserWinnerSerializer
    model = UserModel

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        super(UserWinView, self).update(request, *args, **kwargs)

        data = {
            'winner': {
                'panel_user_id': self.request.user.panel_user_id
            }
        }

        panel_site = Site.objects.get(id=2)

        panel_response = requests.post(
            "http://%s/api/rooms/%s/finished/" % (panel_site.domain, self.request.user.room.panel_room_slug),
            data=json.dumps(data),
            headers={
                "Authorization": "Token %s" % panel_site.panel_authentication.token,
                "Content-Type": "application/json",
            })

        if panel_response.status_code == 200:
            room = self.request.user.room

            user_sessions = get_users_sessions(room.users.values_list('id', flat=True))
            user_sessions.delete()

            data = json.loads(panel_response.json())

            url = "http://%s%s" % (panel_site.domain, data['url_path'])

            return Response(status=panel_response.status_code, data=json.dumps({'url': url}))

        return Response(status=panel_response.status_code, data=panel_response.content)


def get_users_sessions(user_ids):
    user_sessions = []
    all_sessions = Session.objects.all()
    for session in all_sessions:
        session_data = session.get_decoded()
        if int(session_data.get('_auth_user_id')) in user_ids:
            user_sessions.append(session.pk)
    return Session.objects.filter(pk__in=user_sessions)
