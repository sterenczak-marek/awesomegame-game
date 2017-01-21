from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import Http404
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


class IndexView(TemplateView):

    template_name = 'game/index.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(IndexView, self).dispatch(request, *args, **kwargs)

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


