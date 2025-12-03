from pathlib import Path
from datetime import timedelta
import logging
# Đã loại bỏ import RefreshToken ở đây để tránh lỗi AppRegistryNotReady
# from rest_framework_simplejwt.tokens import RefreshToken 

# Cấu hình BASE_DIR dựa trên cấu trúc dự án lồng
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start settings - chỉ bao gồm những phần liên quan đến CAS và JWT
SECRET_KEY = 'django-insecure-t#^51@k8p^p4h*h5*p_2d62v%j4n0^y2k@m!e9!m_5n!s(5g5='
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mama_cas',
    'rest_framework',
    'rest_framework_simplejwt',
    'sso_backend',
    # 'jwt_debugger',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sso_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], 
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

# --- HÀM TIỆN ÍCH TẠO JWT CHO ATTRIBUTES CAS ---

def get_access_token_with_roles(user):
    """
    Tạo Access Token và chèn Claims 'roles' vào Payload.
    """
    # 💥 IMPORT TRÌ HOÃN: Chỉ import khi hàm được gọi
    from rest_framework_simplejwt.tokens import RefreshToken 
    
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    # Lấy Roles (sử dụng tên Groups của Django) và chèn vào Access Token
    user_roles = [g.name for g in user.groups.all()]
    access['roles'] = user_roles

    logger.info(f"--- Token Generation for User: {user.username} ---")
    logger.info(f"User Roles: {user_roles}")
    logger.info(f"Generated Access Token: {str(access)[:50]}...")
    logger.info(f"Generated Refresh Token: {str(refresh)[:50]}...")


    # Trả về Access Token dưới dạng chuỗi
    return str(access)

def get_refresh_token(user):
    """
    Tạo Refresh Token.
    """
    # 💥 IMPORT TRÌ HOÃN: Chỉ import khi hàm được gọi
    from rest_framework_simplejwt.tokens import RefreshToken 
    
    refresh = RefreshToken.for_user(user)
    # Trả về Refresh Token dưới dạng chuỗi
    return str(refresh)

# --- CẤU HÌNH MAMA_CAS (SỬ DỤNG HÀM RIÊNG BIỆT CHO MỖI THUỘC TÍNH) ---

MAMA_CAS_SERVICES = [
    {
        'SERVICE': r'^http://localhost:8001/.*',
        'NAME': 'Flask Client',
        'ATTRIBUTES': {
            'jwt_access_token': get_access_token_with_roles,
            'jwt_refresh_token': get_refresh_token,
        }
    },
]


MAMA_CAS_ATTRIBUTE_CALLBACKS = [
    'sso_backend.cas_callbacks.jwt_attributes',
]

# Định nghĩa URL gốc của CAS Server
CAS_SERVER_URL = 'http://127.0.0.1:8000/' 

# --- CẤU HÌNH JWT (JSON WEB TOKEN) ---
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1), 
    "ROTATE_REFRESH_TOKENS": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Timezone
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'