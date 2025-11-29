import requests

BASE = "http://127.0.0.1:5000"  # URL server Flask

# -------------------------------
# 1️⃣ Lấy danh sách session ban đầu
# -------------------------------
print("=== Sessions ban đầu ===")
r = requests.get(f"{BASE}/sessions")
print(r.json())

# -------------------------------
# 2️⃣ Tạo session
# -------------------------------
print("\n=== Tạo session ===")
data_create = {
    "teacher_id": "t1",
    "title": "Toán 101",        # Unicode
    "start_time": "2025-12-01T09:00",
    "capacity": 2
}
r = requests.post(f"{BASE}/session/create", json=data_create)
print(r.json())

session_id = r.json().get("session_id")
if not session_id:
    raise Exception("Tạo session thất bại, dừng test!")

# -------------------------------
# 3️⃣ Sinh viên đăng ký session
# -------------------------------
print("\n=== Sinh viên đăng ký ===")
data_register = {
    "student_id": "s1",
    "session_id": session_id
}
r = requests.post(f"{BASE}/session/register", json=data_register)
print(r.json())

# -------------------------------
# 4️⃣ Sinh viên hủy đăng ký
# -------------------------------
print("\n=== Sinh viên hủy đăng ký ===")
r = requests.post(f"{BASE}/session/unregister", json=data_register)
print(r.json())

# -------------------------------
# 5️⃣ Xóa session
# -------------------------------
print("\n=== Xóa session ===")
r = requests.delete(f"{BASE}/session/delete/{session_id}")
print(r.json())

# -------------------------------
# 6️⃣ Lấy danh sách session cuối cùng
# -------------------------------
print("\n=== Sessions cuối ===")
r = requests.get(f"{BASE}/sessions")
print(r.json())
