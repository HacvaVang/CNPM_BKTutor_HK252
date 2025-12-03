from flask import Flask, session, render_template_string, redirect, url_for
from flask_cas import CAS, login_required
import urllib.parse

app = Flask(__name__)
app.secret_key = 'super-secret-key-for-flask-client'

# --- Cấu hình Flask-CAS ---
app.config['CAS_SERVER'] = 'http://localhost:8000'
app.config['CAS_URI'] = '/cas'
app.config['CAS_VALIDATE_ROUTE'] = '/serviceValidate'

FRONTEND_URL = 'http://localhost:5173/'
app.config['CAS_AFTER_LOGIN'] = 'profile'
app.config['CAS_AFTER_LOGOUT'] = FRONTEND_URL

cas = CAS(app)

# --- Route /login ---
@app.route('/login')
def login():
    # Nếu đã có username thì chuyển thẳng về frontend
    if cas.username:
        return redirect(FRONTEND_URL)
    # Ngược lại, redirect sang CAS Server
    service_url = url_for('profile', _external=True)
    cas_login_url = f"{app.config['CAS_SERVER']}{app.config['CAS_URI']}/login"
    return redirect(f"{cas_login_url}?service={urllib.parse.quote(service_url)}")
    # return redirect(cas_login_url)

# --- Route /logout ---
@app.route('/logout')
def logout():
    print(f"Đăng xuất user: {cas.username}")
    session.clear()
    cas_logout_url = f"{app.config['CAS_SERVER']}{app.config['CAS_URI']}/logout"
    return redirect(cas_logout_url)

# --- Route /profile ---
@app.route('/profile')
@login_required
def profile():
    username = session.get('CAS_USERNAME')
    attributes = session.get('CAS_ATTRIBUTES', {})

    access_token = attributes.get('jwt_access_token', ['Token not found'])[0]
    refresh_token = attributes.get('jwt_refresh_token', ['Token not found'])[0]

    # Chuyển hướng về frontend kèm token trong fragment
    fragment = urllib.parse.urlencode({
        'username': username,
        'access_token': access_token,
        'refresh_token': refresh_token
    })
    return redirect(f"{FRONTEND_URL}#{fragment}")

# --- Khởi chạy ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
