# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-06-09 22:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_site_names'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='username',
            field=models.CharField(max_length=30),
        ),
    ]
