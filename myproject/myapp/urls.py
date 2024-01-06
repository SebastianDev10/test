from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateUserView, LoginView, VideoViewSet, like_video, dislike_video, user_profile
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views 

router = DefaultRouter()
router.register(r'home', VideoViewSet)

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('api/like/<int:video_id>/', like_video, name='like_video'),
    path('api/dislike/<int:video_id>/', dislike_video, name='dislike_video'),
    path('UserProfile/', user_profile, name='user_profile'),
]
