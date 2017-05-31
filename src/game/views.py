from awesome_rooms.models import Room
from django.contrib.auth import authenticate, login
from django.core.urlresolvers import reverse
from django.http import Http404
from django.shortcuts import redirect
from django.views.generic import TemplateView, DetailView
from ws4redis.publisher import RedisPublisher


class IndexView(DetailView):

    model = Room
    template_name = 'game/index.html'

    def dispatch(self, request, *args, **kwargs):

        if request.user.is_authenticated():
            return super(IndexView, self).dispatch(request, *args, **kwargs)

        raise Http404

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        x, y = self.request.user.positions
        context.update({
            'x': x,
            'y': y
        })
        return context


class LoginView(TemplateView):

    template_name = 'game/move.html'

    def get(self, request, *args, **kwargs):
        user = authenticate(token=kwargs.get('token'))
        if user:
            login(request, user)
        else:
            raise Http404

        url = reverse("room", args=[user.room.pk])
        return redirect(url)


