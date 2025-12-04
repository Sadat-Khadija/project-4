from django.contrib.auth.models import User
from django.db import models


class Goal(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="goals")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Task(models.Model):
    # Tasks sit under a Goal and track progress with a simple status field.
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[("todo", "To Do"), ("doing", "In Progress"), ("done", "Done")],
        default="todo",
    )
    estimated_hours = models.IntegerField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.get_status_display()})"


class Resource(models.Model):
    # Resources are links (videos/articles/etc.) attached to a Goal.
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="resources")
    title = models.CharField(max_length=255)
    url = models.URLField()
    type = models.CharField(
        max_length=20,
        choices=[
            ("video", "Video"),
            ("article", "Article"),
            ("course", "Course"),
            ("other", "Other"),
        ],
        default="article",
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-added_at"]

    def __str__(self) -> str:
        return self.title
