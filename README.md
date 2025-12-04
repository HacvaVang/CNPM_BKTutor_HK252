# CNPM_BKTutor_HK252

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
# Hướng dẫn chạy dự án locally

### Yêu cầu
- Node.js (cho frontend)
- Python 3.10+ (cho backend và data core)
- Git

### Các thành phần cần chạy đồng thời

#### 1. Chạy Client (Frontend)
Mở terminal tại **thư mục gốc của dự án** (nơi có file `package.json`):

```bash
npm install          # chỉ chạy lần đầu hoặc khi có thay đổi dependencies
npm run start
```
### 2. Chạy Server (Backend)
```bash
cd src/services
python3 api.py        # Mac/Linux
# hoặc
python api.py         # Windows
```
- Chạy http://127.0.0.1:8080/set-cookie để tạo cookie giả lập 
### 3. Chạy Data_core
```bash
cd HCMUT_LIBRARY

# Cài đặt dependencies (chỉ cần chạy lần đầu hoặc khi requirements.txt thay đổi)
pip install -r requirements.txt

# Khởi động server
uvicorn libcore_server:app --reload --port 7999
```
