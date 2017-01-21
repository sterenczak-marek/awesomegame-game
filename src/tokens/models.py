from django.db import models


class Token(models.Model):

    key = models.CharField(max_length=256)
