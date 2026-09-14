from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase

from .models import BoardStroke

STROKES_URL = '/api/board/strokes/'


class BoardStrokeApiTests(APITestCase):

    def test_pen_stroke_is_created(self):
        response = self.client.post(STROKES_URL, {'tool': 'pen', 'points': [[0.1, 0.2], [0.3, 0.4]]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BoardStroke.objects.count(), 1)

    def test_strokes_are_listed_in_creation_order_without_pagination(self):
        for index in range(3):
            BoardStroke.objects.create(tool='pen', points=[[0, index / 10]])
        response = self.client.get(STROKES_URL)
        self.assertEqual([stroke['points'][0][1] for stroke in response.data], [0, 0.1, 0.2])

    def test_after_returns_only_newer_strokes(self):
        first = BoardStroke.objects.create(tool='pen', points=[[0.1, 0.1]])
        second = BoardStroke.objects.create(tool='pen', points=[[0.2, 0.2]])
        response = self.client.get(STROKES_URL, {'after': first.id})
        self.assertEqual([stroke['id'] for stroke in response.data], [second.id])

    def test_after_rejects_non_integer_values(self):
        response = self.client.get(STROKES_URL, {'after': 'abc'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_points_outside_the_unit_range_are_rejected(self):
        response = self.client.post(STROKES_URL, {'tool': 'pen', 'points': [[1.5, 0.2]]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_malformed_points_are_rejected(self):
        response = self.client.post(STROKES_URL, {'tool': 'pen', 'points': [[0.1]]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unknown_tool_is_rejected(self):
        response = self.client.post(STROKES_URL, {'tool': 'marker', 'points': [[0.1, 0.2]]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('board.views.BOARD_MAX_STROKES', 1)
    def test_board_rejects_strokes_once_full(self):
        BoardStroke.objects.create(tool='pen', points=[[0.5, 0.5]])
        response = self.client.post(STROKES_URL, {'tool': 'pen', 'points': [[0.1, 0.2]]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)