from rest_framework import serializers

from .models import Goal, Resource, Task


class GoalSerializer(serializers.ModelSerializer):
    # Serialize Goal fields exposed to the API.
    class Meta:
        model = Goal
        fields = ["id", "title", "description", "category", "target_date", "created_at"]
        read_only_fields = ["id", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    # Serialize Task; goal is required to relate to a Goal.
    class Meta:
        model = Task
        fields = [
            "id",
            "goal",
            "title",
            "status",
            "estimated_hours",
            "completed_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ResourceSerializer(serializers.ModelSerializer):
    # Serialize Resource; goal links it to a Goal.
    class Meta:
        model = Resource
        fields = ["id", "goal", "title", "url", "type", "added_at"]
        read_only_fields = ["id", "added_at"]
