from django.contrib import admin
from django.urls import path
from . import views



urlpatterns = [
    #path('admin/', admin.site.urls),
    path('',views.apiOverview, name = "api-overview"),
    path('auth/<email>', views.userAuthType, name = "user-auth" )
]
