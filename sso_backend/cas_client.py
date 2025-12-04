from flask import Flask, session, render_template_string, redirect, url_for
from flask_cas import CAS, login_required

# --- Cấu hình Ứng dụng Flask ---
app = Flask(__name__)

# BÍ MẬT KEY: Cần thiết cho phiên (session) của Flask
app.secret_key = 'super-secret-key-for-flask-client'

# --- Cấu hình Flask-CAS ---
app.config['CAS_SERVER'] = 'http://localhost:8000' # Địa chỉ của CAS Server (Django)
app.config['CAS_URI'] = '/sso'                      # Tiền tố URL CAS trên Server (mama_cas)
app.config['CAS_LOGIN_ROUTE'] = '/login'
app.config['CAS_LOGOUT_ROUTE'] = '/logout'
app.config['CAS_VALIDATE_ROUTE'] = '/serviceValidate'
app.config['CAS_AFTER_LOGIN'] = 'http://localhost:5173/' # Chuyển hướng sau khi đăng nhập thành công
app.config['CAS_AFTER_LOGOUT'] = 'http://localhost:5173/' # Chuyển hướng sau khi đăng xuất

cas = CAS(app)

# --- Các View của Ứng dụng Client ---

@app.route('/login')
def login():
    # Flask-CAS sẽ tự động redirect đến http://localhost:8000/sso/login
    print(cas.username)
    if cas.username:
        return redirect(app.config['CAS_AFTER_LOGIN'])
    else:
        return redirect(app.config['CAS_SERVER'] + app.config['CAS_URI'] + app.config['CAS_LOGIN_ROUTE'])
    
@app.route('/logout')
def logout():
    # In ra username hiện tại (nếu có)
    print(cas.username)
    # Xóa session/token trong Flask
    session.clear()
    # Redirect đến CAS Server để đăng xuất
    return redirect(
        app.config['CAS_SERVER'] + app.config['CAS_URI'] + app.config['CAS_LOGOUT_ROUTE']
    )

# @app.route('/profile')
# @login_required
# def profile():
#     """ 
#     Trang yêu cầu xác thực.
#     Trích xuất và hiển thị JWT Tokens cùng các thuộc tính khác.
#     """
    
#     username = session.get('CAS_USERNAME')
#     attributes = session.get('CAS_ATTRIBUTES', {})
    
#     # 💥 TRÍCH XUẤT JWT TOKENS
#     # Các attributes từ mama_cas thường là một danh sách, nên ta lấy phần tử đầu tiên [0]
#     access_token = attributes.get('jwt_access_token', ['Token not found'])[0]
#     refresh_token = attributes.get('jwt_refresh_token', ['Token not found'])[0]
    
#     html_content = f"""
#     <div style="text-align: center; margin-top: 50px; padding: 20px; border: 1px solid #ccc; max-width: 800px; margin: 50px auto; border-radius: 8px;">
#         <h2 style="color: #007bff;">Xin chào, {username}!</h2>
#         <p>Bạn đã đăng nhập thành công.</p>
        
#         <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Token JWT đã nhận được:</h3>
        
#         <div style="text-align: left; background-color: #f4f4f4; padding: 15px; border-radius: 6px; margin-bottom: 20px; overflow-x: auto;">
#             <p><strong>ACCESS TOKEN:</strong></p>
#             <code style="display: block; word-break: break-all; font-size: 0.85em; color: #333;">{access_token}</code>
#             <p style="margin-top: 15px;"><strong>REFRESH TOKEN:</strong></p>
#             <code style="display: block; word-break: break-all; font-size: 0.85em; color: #333;">{refresh_token}</code>
#         </div>
        
#         <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Các Attributes CAS khác:</h3>
#         <ul style="list-style: none; padding: 0;">
#             {''.join(f'<li style="padding: 5px 0;"><strong>{key.upper()}:</strong> {value[0] if isinstance(value, list) else value}</li>' for key, value in attributes.items())}
#         </ul>
        
#         <p style="margin-top: 30px;">
#             <a href="{{ url_for('cas.logout') }}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
#                 Đăng xuất (Single Logout)
#             </a>
#         </p>
#     </div>
#     """
#     return render_template_string(html_content)

# --- Khởi chạy Ứng dụng ---
if __name__ == '__main__':
    # Chạy client trên cổng 8001, phù hợp với cấu hình MAMA_CAS_SERVICES
    app.run(host='0.0.0.0', port=8001, debug=True)