from .base import *  # noqa

DEBUG = True
CELERY_TASK_ALWAYS_EAGER = True
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
