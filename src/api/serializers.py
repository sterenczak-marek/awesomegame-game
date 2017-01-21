from awesome_rooms.models import Room
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers

from src.game.serializers import PlayerSerializer

UserModel = get_user_model()


class UserGameServerSerializer(PlayerSerializer):
    username = serializers.CharField()
    token = serializers.SerializerMethodField(read_only=True)

    def get_token(self, obj):
        return obj.token

    class Meta:
        model = UserModel
        fields = ['username', 'token']


class RoomSerializer(serializers.ModelSerializer):
    users = UserGameServerSerializer(many=True)

    def create(self, validated_data):
        user_data = validated_data.pop('users')
        room = super(RoomSerializer, self).create(validated_data)

        for user in user_data:
            qs = UserModel.objects.filter(username=user['username'])

            if qs.exists():
                user = qs.get()
            else:
                serializer = PlayerSerializer(data=user)
                if serializer.is_valid():
                    user = serializer.save()
                else:
                    raise ValidationError

            user.room = room
            user.save()

        return room

    class Meta:
        model = Room
        exclude = ['id', 'slug']
