from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions
from rest_framework.views import exception_handler


def coded_exception_handler(exc, context):
    if isinstance(exc, Http404):
        exc = exceptions.NotFound(*exc.args)
    elif isinstance(exc, PermissionDenied):
        exc = exceptions.PermissionDenied(*exc.args)

    response = exception_handler(exc, context)
    if response is None:
        return response

    details = exc.get_full_details()
    response.data = details if isinstance(exc, exceptions.ValidationError) else {'detail': details}
    return response