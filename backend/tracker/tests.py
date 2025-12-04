from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Goal, Resource, Task


class GoalApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass1234")
        self.client.force_authenticate(self.user)

    def test_create_goal(self):
        payload = {"title": "Learn Django", "category": "Backend"}
        response = self.client.post(reverse("goal-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.filter(owner=self.user).count(), 1)

    def test_list_only_owner_goals(self):
        Goal.objects.create(owner=self.user, title="Mine", category="A")
        other = User.objects.create_user(username="other", password="pass1234")
        Goal.objects.create(owner=other, title="Not mine", category="B")

        response = self.client.get(reverse("goal-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [g["title"] for g in response.data]
        self.assertIn("Mine", titles)
        self.assertNotIn("Not mine", titles)


class TaskResourceApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass1234")
        self.other = User.objects.create_user(username="other", password="pass1234")
        self.goal = Goal.objects.create(owner=self.user, title="Goal", category="A")
        self.client.force_authenticate(self.user)

    def test_create_task_for_owned_goal(self):
        payload = {"goal": self.goal.id, "title": "Task 1", "status": "todo"}
        res = self.client.post(reverse("task-list"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.filter(goal=self.goal).count(), 1)

    def test_cannot_create_task_for_other_goal(self):
        other_goal = Goal.objects.create(owner=self.other, title="Other", category="B")
        payload = {"goal": other_goal.id, "title": "Nope", "status": "todo"}
        res = self.client.post(reverse("task-list"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_filter_tasks_by_goal(self):
        Task.objects.create(goal=self.goal, title="Mine", status="todo")
        other_goal = Goal.objects.create(owner=self.user, title="Other goal", category="B")
        Task.objects.create(goal=other_goal, title="Other task", status="todo")
        res = self.client.get(reverse("task-list") + f"?goal={self.goal.id}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], "Mine")

    def test_create_resource(self):
        payload = {"goal": self.goal.id, "title": "Doc", "url": "https://example.com", "type": "article"}
        res = self.client.post(reverse("resource-list"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resource.objects.filter(goal=self.goal).count(), 1)
