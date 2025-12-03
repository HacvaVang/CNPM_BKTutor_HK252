<<<<<<< HEAD
# CNPM_BKTutor_HK252
SE_assignment. Don't fuck up

## Nhiêm vụ chung:
 - Front-end (Vũ, An, Quang): Xây dựng Frame, thiết kế bổ sung UI va Screenflow.
 Ngôn ngữ hiện thực: React (Ưu tiên), HTML5, CSS,...
 - Back-end (Thịnh, Phát, Sang, Bắc)
Ngôn ngữ hiện thực: Python (Ưu tiên), JS/TS, Java,...

## Nhiệm vụ riêng:
 - Chỉnh sửa bài làm, nhất là phần Sequence diagram, Activity diagram.
 - THống nhất các kí hiệu trong phần Sequence diagram: Database, Actor Boundary.

Cách đê clone git:
```
git clone https://github.com/HacvaVang/CNPM_BKTutor_HK252.git
```

=======
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
>>>>>>> bb9d63e58be747a01bdc421972c34da081d866ce
