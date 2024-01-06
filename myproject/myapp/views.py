from rest_framework import generics, viewsets, permissions, status
from .models import CustomUser, Video, VideoReaction, UserProfile
from .serializers import UserSerializer, VideoSerializer, UserProfileSerializer

class CreateUserView(generics.CreateAPIView):
    model = CustomUser
    serializer_class = UserSerializer

from django.contrib.auth import authenticate

from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

    

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return Response(UserSerializer(user).data)
        return Response({'error': 'Niepoprawne dane logowania'}, status=status.HTTP_400_BAD_REQUEST)
    
class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Video.objects.filter(user=self.request.user)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        VideoReaction.objects.update_or_create(
            user=request.user, video=video, defaults={'liked': True})
        return Response({'status': 'like added'}, status=status.HTTP_200_OK)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dislike_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        VideoReaction.objects.update_or_create(
            user=request.user, video=video, defaults={'liked': False})
        return Response({'status': 'dislike added'}, status=status.HTTP_200_OK)
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response(UserSerializer(user).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_profile(request):
    if request.method == 'GET':
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)