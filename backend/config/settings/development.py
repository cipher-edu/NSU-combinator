from .base import *  # noqa

DEBUG = True

REST_FRAMEWORK = {
    **REST_FRAMEWORK,  # noqa: F405
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10000/hour',
        'user': '20000/hour',
        'auth': '100/min',
        'otp_verify': '100/min',
        'cert_verify': '100/min',
    },
}

CELERY_TASK_ALWAYS_EAGER = False

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
