from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # Thêm để lấy token bằng username/password
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # CAS Server endpoints (login, logout, serviceValidate, proxy, etc.)
    # Tất cả các route của mama_cas phải nằm dưới tiền tố 'cas/'
    path('', include('mama_cas.urls')),

    # --- 2. JWT ENDPOINTS (Cho các API Stateless) ---
    # Endpoint này cho phép client yêu cầu Access Token mới bằng Refresh Token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Endpoint để kiểm tra tính hợp lệ của Access Token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Thêm các API khác của bạn tại đây
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # path('api/v1/', include('jwt_debugger.urls')),
]