import logging
import sys
import traceback

from django.http import Http404
from django.core import exceptions as djexcs
from rest_framework import exceptions, status, views
from rest_framework.response import Response

logger = logging.getLogger("ihservice")


def ihservice_exception_handler(exc, context):
    # pylint: disable=too-many-return-statements
    logger.info(traceback.format_exc())
    default_exc = (exceptions.APIException, Http404, djexcs.PermissionDenied)
    if isinstance(exc, djexcs.ValidationError):
        errors = dict(exc).get('__all__', dict(exc))
        if isinstance(errors, list):
            errors = {'other_errors': errors}  # pragma: no cover
        return Response({"details": errors},
                        status=status.HTTP_400_BAD_REQUEST)
    elif not isinstance(exc, default_exc) and isinstance(exc, Exception):
        return Response({'details': str(sys.exc_info()[1]),
                         'error_type': sys.exc_info()[0].__class__.__name__},
                        status=status.HTTP_400_BAD_REQUEST)
    return views.exception_handler(exc, context)