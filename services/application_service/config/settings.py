import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-navdu-apps-secret-key-2026')
DEBUG = bool(int(os.environ.get('DEBUG', 1)))

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'corsheaders',
    'ckeditor',
    
    # Local apps - All Unified in Admin
    'apps.applications.apps.ApplicationsConfig',
    'apps.layout.apps.LayoutConfig',
    'apps.events.apps.EventsConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Multi-Database Configuration for Unified Admin
def parse_db_url(url_str, default_name='apps_db'):
    if url_str and (url_str.startswith('postgres://') or url_str.startswith('postgresql://')):
        import urllib.parse
        parsed = urllib.parse.urlparse(url_str)
        return {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': parsed.path.lstrip('/') or default_name,
            'USER': parsed.username,
            'PASSWORD': parsed.password,
            'HOST': parsed.hostname,
            'PORT': parsed.port or 5432,
        }
    return {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / f'{default_name}.sqlite3',
    }

DATABASE_URL = os.environ.get('DATABASE_URL')
CMS_DB_URL = os.environ.get('CMS_DB_URL', DATABASE_URL.replace('/apps_db', '/cms_db') if DATABASE_URL else None)
EVENTS_DB_URL = os.environ.get('EVENTS_DB_URL', DATABASE_URL.replace('/apps_db', '/events_db') if DATABASE_URL else None)

DATABASES = {
    'default': parse_db_url(DATABASE_URL, 'apps_db'),
    'cms_db': parse_db_url(CMS_DB_URL, 'cms_db'),
    'events_db': parse_db_url(EVENTS_DB_URL, 'events_db'),
}

DATABASE_ROUTERS = ['config.db_router.MultiServiceRouter']

LANGUAGE_CODE = 'uz'
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Telegram Bot Config
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', 'test_token')
ADMIN_TELEGRAM_CHAT_ID = os.environ.get('ADMIN_TELEGRAM_CHAT_ID', '')

# Jazzmin Modern Admin Theme Configuration
JAZZMIN_SETTINGS = {
    "site_title": "NavDU Startap Admin",
    "site_header": "NavDU Inkubatsiya",
    "site_brand": "UzCombinator NavDU",
    "welcome_sign": "NavDU Inkubatsiya & Akseleratsiya Markazi Boshqaruviga Xush Kelibsiz!",
    "copyright": "Navoiy Davlat Universiteti • UzCombinator 2026",
    "search_model": ["applications.Application", "layout.Startup", "layout.NewsArticle"],
    "user_avatar": None,
    "topmenu_links": [
        {"name": "Bosh Sahifa (Sayt)", "url": "http://localhost:5173", "new_window": True},
        {"name": "Arizalar", "model": "applications.Application"},
        {"name": "Hakatonlar", "model": "events.Event"},
        {"name": "Startaplar", "model": "layout.Startup"},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "auth": "fas fa-shield-alt",
        "auth.user": "fas fa-user-shield",
        "auth.Group": "fas fa-users",
        "applications.Application": "fas fa-rocket",
        "applications.ApplicationEvaluation": "fas fa-star",
        "events.Event": "fas fa-calendar-alt",
        "events.Ticket": "fas fa-qrcode",
        "layout.HeroSlide": "fas fa-images",
        "layout.SectionConfig": "fas fa-sliders-h",
        "layout.TopTicker": "fas fa-bullhorn",
        "layout.PlatformMetric": "fas fa-chart-line",
        "layout.PartnerLogo": "fas fa-handshake",
        "layout.Startup": "fas fa-lightbulb",
        "layout.NewsArticle": "fas fa-newspaper",
        "layout.Mentor": "fas fa-user-tie",
        "layout.CoFounderVacancy": "fas fa-briefcase",
        "layout.Story": "fas fa-book-open",
        "layout.PlaybookGuide": "fas fa-graduation-cap",
    },
    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-file",
    "order_with_respect_to": [
        "applications",
        "events",
        "layout",
        "auth",
    ],
    "show_ui_builder": False,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-primary",
    "navbar": "navbar-dark navbar-primary",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "flatly",
    "default_theme_mode": "auto",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}

# CKEditor Professional WYSIWYG Rich-Text Editor Configuration
CKEDITOR_CONFIGS = {
    'default': {
        'skin': 'moono-lisa',
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Source', '-', 'Maximize', 'ShowBlocks', 'Preview'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
            ['Find', 'Replace', '-', 'SelectAll'],
            '/',
            ['Format', 'Font', 'FontSize'],
            ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'],
            ['TextColor', 'BGColor'],
            '/',
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CodeSnippet'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar'],
        ],
        'height': 380,
        'width': '100%',
        'tabSpaces': 4,
        'extraPlugins': ','.join([
            'codesnippet',
            'tableresize',
            'tabletools',
            'tableselection',
            'autolink',
            'autoembed',
            'embedsemantic',
            'widget',
            'lineutils',
            'clipboard',
            'dialog',
            'dialogui',
        ]),
    },
    'compact': {
        'skin': 'moono-lisa',
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['NumberedList', 'BulletedList', '-', 'Blockquote'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
            ['Link', 'Unlink'],
            ['Format'],
            ['Source', 'Maximize']
        ],
        'height': 180,
        'width': '100%',
    }
}
