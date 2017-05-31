# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.views import defaults as default_views
from rest_framework.authtoken import views
from src.game.views import IndexView, LoginView


urlpatterns = [
    url(r'^api/', include('src.api.urls', namespace="api")),
    url(r'^api-token-auth/', views.obtain_auth_token),

    url(r'^game/(?P<pk>[0-9]+)$', IndexView.as_view(), name="room"),
    url(r'^(?P<token>[\w]{32})/$', LoginView.as_view(), name="login"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception("Bad Request!")}),
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception("Permission Denied")}),
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception("Page not Found")}),
        url(r'^500/$', default_views.server_error),
    ]
