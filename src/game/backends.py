from django.contrib.auth import get_user_model

UserModel = get_user_model()


class TokenBackend(object):

    def authenticate(self, token, username=None, password=None, **kwargs):
        try:
            user = UserModel.objects.get(login_token=token)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)
        else:
            user.login_token = ""
            user.save(update_fields=['login_token'])
            return user

    def get_user(self, user_id):
        try:
            return UserModel._default_manager.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

