# CNPM_BKTutor_HK252

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
python3 manage.py migrate
python3 manage.py runserver
```
Nếu chưa có tài khoản admin, hãy chạy lệnh
```bash
python3 manage.py createsuperuser
```
Nhập username và pass tương ứng: `hac` và `123` hoặc `DangHuyenVu` và `123`

# Hướng dẫn chạy dự án locally

### Yêu cầu
- Node.js (cho frontend)
- Python 3.10+ (cho backend và data core)
- Git

### Các thành phần cần chạy đồng thời

#### 1. Chạy Client (Frontend)
Mở terminal tại **thư mục gốc của dự án** (nơi có file `package.json`):

```bash
cd cnpm-bktutor
npm install          # chỉ chạy lần đầu hoặc khi có thay đổi dependencies
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```
#### 2. Chạy Server (Backend)
```bash
cd cnpm-bktutor/src/services
pip install -r requirements.txt
python3 api.py        # Mac/Linux
# hoặc
python api.py         # Windows
```
- Chạy http://127.0.0.1:8080/set-cookie để tạo cookie giả lập 
#### 3. Chạy Data_core
```bash
cd cnpm-bktutor/HCMUT_LIBRARY
pip install -r requirements.txt

# Khởi động server
uvicorn libcore_server:app --reload --port 7999
```
