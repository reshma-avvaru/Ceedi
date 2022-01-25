from django.contrib import admin
from django.urls import path,include
from . import views

# from rest_framework import routers

# router = routers.DefaultRouter() 
# router.register(r'auth/<email>', views.userAuthType)

urlpatterns = [
    #path('admin/', admin.site.urls),
    
    path('',views.apiOverview, name = "api-overview"),
    # path('api/', include('rest_framework.urls', namespace='rest_framework'))
    path('auth-user/', views.userAuthType, name = "user-auth" ),
    path('fire-auth/', views.fireAuth, name = "fireauth"),
    path('new-user/', views.addNewUser, name = "new-user"),
    path('products/list/<str:token>', views.getProductList , name = "product-list"),
    path('products/<str:item>/<str:token>', views.updateProduct, name= "update-product")
]
