from flask import Flask, request, jsonify
import uuid
from datetime import datetime
import json, os, threading

app = Flask(__name__)

SESSONS_FILE = "sessions.json"
USERS_FILE = "users.json"


def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)
    
def save_users(data):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def load_sessions():
    if not os.path.exists(SESSONS_FILE):
        return {}
    with open(SESSONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)
    
def save_sessions(data):
    with open(SESSONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


@app.route("/session/create", methods=["POST"])
def create_session():
    data = request.json
    teacher_id = data.get("teacher_id")
    title = data.get("title")
    start_time = data.get("start_time")
    capacity = data.get("capacity")

    users = load_users()
    if teacher_id not in users or users[teacher_id]["role"] != "teacher":
        return jsonify({"error": "Teacher không hợp lệ"}), 400
    
    sessions = load_sessions()
    session_id = str(uuid.uuid4())
    sessions[session_id]={
        "id":session_id,
        "title":title,
        "teacher_id":teacher_id,
        "start_time":start_time,
        "capacity":capacity,
        "students":[]
    }
    save_sessions(sessions)

    users[teacher_id]["sessions"].append(session_id)
    save_users(users)

    return jsonify({"message": "Tạo buổi học thành công", "session_id": session_id})


@app.route("/session/delete/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    sessions = load_sessions()
    users = load_users()

    if session_id not in sessions:
        return jsonify({"error": "Không tìm thấy buổi học trong hệ thống"}), 404

    for student_id in sessions[session_id].get("students", []):
        if student_id in users:
            users[student_id].setdefault("sessions", [])
            if session_id in users[student_id]["sessions"]:
                users[student_id]["sessions"].remove(session_id)
    save_users(users)

    del sessions[session_id]
    save_sessions(sessions)

    return jsonify({"message": "Xóa buổi học thành công"})


@app.route("/session/register", methods=["POST"])
def register_session():
    data = request.json
    session_id = data.get("session_id")
    student_id = data.get("student_id")

    sessions = load_sessions()
    users = load_users()

    if student_id not in users or users[student_id]["role"] != "student":
        return jsonify({"error": "Sinh viên không hợp lệ"}), 400
    
    if session_id not in sessions:
        return jsonify({"error": "Buổi học không tồn tại trong hệ thống"}), 404
    
    session = sessions[session_id]

    if len(session["students"]) >= session["capacity"]:
        return jsonify({"error": "Buổi học hiện đã đủ người"}), 400
    
    if student_id in session["students"]:
        return jsonify({"error": "Bạn đã đăng ký rồi"}), 400
    
    session["students"].append(student_id)
    users[student_id]["sessions"].append(session_id)

    save_sessions(sessions)
    save_users(users)

    return jsonify({"message": "Đăng ký thành công"})


@app.route("/session/unregister", methods=["POST"])
def unregister_session():
    data = request.json
    session_id = data.get("session_id")
    student_id = data.get("student_id")

    sessions = load_sessions()
    users = load_users()

    if session_id not in sessions:
        return jsonify({"error": "Buổi học không tồn tại trong hệ thống"}), 404
    
    if student_id not in users or users[student_id]["role"] != "student":
        return jsonify({"error": "Sinh viên không hợp lệ"}), 400
    
    session = sessions[session_id]

    if student_id not in session["students"]:
        return jsonify({"error": "Bạn không thuộc trong buổi học này"}), 400
    
    session["students"].remove(student_id)
    users[student_id]["sessions"].remove(session_id)

    save_sessions(sessions)
    save_users(users)

    return jsonify({"message": "Hủy đăng ký buổi học thành công"})



@app.route("/sessions", methods=["GET"])
def list_sessions():
    return jsonify(load_sessions())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
