from rest_framework_simplejwt.tokens import RefreshToken

def jwt_attributes(user, service):
    """
    MamaCAS sẽ gọi hàm này khi validate ticket.
    Nó phát hành JWT token và trả về như CAS attributes.
    """
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    # Thêm roles (nhóm của user) vào payload nếu cần
    user_roles = [g.name for g in user.groups.all()]
    access['roles'] = user_roles

    return {
        'jwt_access_token': str(access),
        'jwt_refresh_token': str(refresh),
    }
