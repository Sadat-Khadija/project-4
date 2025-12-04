from django.contrib import admin

from .models import Goal, Resource, Task


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "target_date", "created_at")
    search_fields = ("title", "category", "owner__username")
    list_filter = ("category", "target_date")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "goal", "status", "estimated_hours", "completed_at", "created_at")
    list_filter = ("status", "goal")
    search_fields = ("title", "goal__title", "goal__owner__username")


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "goal", "type", "url", "added_at")
    list_filter = ("type", "goal")
    search_fields = ("title", "goal__title", "goal__owner__username")
