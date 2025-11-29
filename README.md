# Cách chạy mô phỏng HCMUT-SSO
Hệ thống sử dụng framework Django làm CAS-server và Flask làm CAS-client

## Tạo môi trường ảo và cài thư viện (Create virtual enviroment and install libraries):
- Tới thư mục đã git clone và nhập các lệnh sau
```bash
python3 -m venv venv
source venv/bin/activate
pip install  -r requirements.txt
```
## Chạy CAS-server
Vào thư mục sso_backend
```bash
cd sso_backend
```
và chạy lệnh như bên dưới:
```bash
python3 manage.py miragte
python3 manage.py runserver 8000
```
Nếu chưa có tài khoản admin, hãy chạy lệnh
```bash
python3 manage.py createsuperuser
```
Nhập username và pass tương ứng: `hac` và `123`

## Chạy CAS-client
Vào thư mục sso_backend chạy lệnh
```bash
python3 cas_client.py
```

## Chạy Web-app BK-TuTor
Vào thư mục cnpm-bktutor chạy lệnh
```bash
npm run dev
```
- Lưu ý: Yêu cầu tối thiểu Node.js phiên bản 20 trở lên

Cài phiên bản bằng cách
```bash
nvm install 20
nvm use 20
```
