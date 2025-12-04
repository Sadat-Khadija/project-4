from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Goal, Resource, Task
from .serializers import GoalSerializer, ResourceSerializer, TaskSerializer


class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return tasks for goals owned by the current user.
        queryset = Task.objects.filter(goal__owner=self.request.user)
        goal_id = self.request.query_params.get("goal")
        if goal_id:
            queryset = queryset.filter(goal_id=goal_id)
        return queryset

    def perform_create(self, serializer):
        # Guard: users cannot add tasks to goals they don't own.
        goal = serializer.validated_data["goal"]
        if goal.owner != self.request.user:
            raise PermissionDenied("You do not own this goal.")
        serializer.save()


class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return resources for goals owned by the current user.
        queryset = Resource.objects.filter(goal__owner=self.request.user)
        goal_id = self.request.query_params.get("goal")
        if goal_id:
            queryset = queryset.filter(goal_id=goal_id)
        return queryset

    def perform_create(self, serializer):
        # Guard: users cannot attach resources to goals they don't own.
        goal = serializer.validated_data["goal"]
        if goal.owner != self.request.user:
            raise PermissionDenied("You do not own this goal.")
        serializer.save()


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Aggregate a light summary for the dashboard cards.
        user = request.user
        goals = Goal.objects.filter(owner=user)
        tasks = Task.objects.filter(goal__owner=user)

        goals_by_category = goals.values("category").annotate(total=Count("id"))
        status_counts = tasks.values("status").annotate(total=Count("id"))

        data = {
            "goals_count": goals.count(),
            "tasks_total": tasks.count(),
            "tasks_status": {item["status"]: item["total"] for item in status_counts},
            "goals_by_category": {item["category"] or "Uncategorized": item["total"] for item in goals_by_category},
        }
        return Response(data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Basic signup: creates a user and returns JWT tokens.
        User = get_user_model()
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            },
            status=status.HTTP_201_CREATED,
        )
