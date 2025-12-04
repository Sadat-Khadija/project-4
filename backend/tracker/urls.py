from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DashboardSummaryView, GoalViewSet, ResourceViewSet, TaskViewSet

router = DefaultRouter()
# CRUD endpoints exposed under /api/
router.register("goals", GoalViewSet, basename="goal")
router.register("tasks", TaskViewSet, basename="task")
router.register("resources", ResourceViewSet, basename="resource")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
]
