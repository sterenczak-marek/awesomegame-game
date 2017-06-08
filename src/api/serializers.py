from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import serializers

from src.game.models import Room

UserModel = get_user_model()


class UserGameServerSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    token = serializers.SerializerMethodField(read_only=True)
    panel_user_id = serializers.IntegerField()

    def get_token(self, obj):
        return obj.token

    class Meta:
        model = UserModel
        fields = ['username', 'token', 'panel_user_id']


class RoomSerializer(serializers.ModelSerializer):
    users = UserGameServerSerializer(many=True)

    def create(self, validated_data):
        user_data = validated_data.pop('users')
        room = super(RoomSerializer, self).create(validated_data)

        for user in user_data:
            qs = UserModel.objects.filter(panel_user_id=user['panel_user_id'])

            if qs.exists():
                user = qs.get()
            else:
                serializer = UserGameServerSerializer(data=user)
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


class UserWinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = []
