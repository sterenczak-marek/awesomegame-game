from awesome_rooms.models import Room
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import RoomSerializer


class RoomCreateView(CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = Room.objects.all()
    serializer_class = RoomSerializer
