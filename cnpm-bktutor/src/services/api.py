from flask import Flask, jsonify, request, Response, make_response, redirect, url_for
from flask_cors import CORS
import csv, uuid
import json

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

#validate session based on given tokenid
def session_validate():
    raw = request.cookies.get("session")
    if not raw:
        return None
    cookie_val = json.loads(raw)
    if cookie_val is None:
        return None
    tokenid = cookie_val.get("jti")
    try:
        with open("ticket.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["ticketid"] == tokenid:
                    return cookie_val
            return None
    except FileNotFoundError:
        return None

def identification():
    cookie_val = session_validate()
    if cookie_val is None:
        return {
            "selfid" : None,
            "name": None,
            "role": None,
            "state": None
        }
    key = str(cookie_val["user_id"]).strip()
    try:
        with open("roles.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if str(row["userid"]) == key:
                    return {
                        "selfid": key,
                        "name": row["name"],
                        "role": row["role"],
                        "state": row["state"]
                    }
            return {
                    "selfid": None,
                    "name": None,
                    "role": None,
                    "state": None
                }
    except FileNotFoundError:
        return {
                "selfid": None,
                "name": None,
                "role": None,
                "state": None
            }
    
def read_notifications():
    cookie_val = session_validate()
    if cookie_val is None:
        return None
    key = cookie_val["user_id"]
    notifications = []
    try:
        with open("notifications.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["userid"] == str(key):
                    notifications.append({
                        "id": row["notifid"],
                        "message": row["message"],
                        "date": row["date"]
                    })
        return notifications
    except FileNotFoundError:
        return []
    
def read_messages():
    cookie_val = session_validate()
    if cookie_val is None:
        return None
    key = cookie_val["user_id"]
    messages = []
    usermap = {}
    try:
        with open("roles.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                usermap[row["userid"]] = row["name"]
    except FileNotFoundError:
        return None
    try:
        with open("messages.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["userid"] == str(key):
                    messages.append({
                        "id": row["messageid"],
                        "to": usermap[row["receiverid"]],
                        "message": row["message"],
                        "date": row["date"]
                    })
            return messages
    except FileNotFoundError:
        return []
    

def read_events():
    cookie_val = session_validate()
    if cookie_val is None:
        return []
    key = cookie_val["user_id"]
    events = []
    try:
        with open("events.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row["userid"] == str(key) and row["status"] == "upcoming":
                    events.append({
                        "id": row["eventid"],
                        "title": row["title"],
                        "userid": row["userid"],
                        "date": row["date"],
                        "timestart": row["timestart"],
                        "timeend": row["timeend"],
                        "room": row["room"],
                        "tutorid": row["tutorid"]
                    })  
            return events
    except FileNotFoundError:
        return []

#set cookie for error checking (gonna delete later)
@app.route("/set-cookie")
def set_cookie():
    resp = make_response(jsonify({"status": "cookie set"}))
    cookie_value = json.dumps({
        "token_type": "refresh",
        "exp": 1764492775, # Thời gian hết hạn (Unix timestamp)
        "iat": 1764406375, # Thời gian tạo (Issued At)
        "jti": "93e37f741c954dcdb9ba07de80fbbb71", # ID token duy nhất
        "user_id": 1,
        "role": "tutor"
    })
    resp.set_cookie("session", cookie_value, httponly=True, samesite="None", secure=True)

    #then add the tokenid into the database
    with open("ticket.csv", "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, ["ticketid"])
        writer.writerow({"ticketid" : "93e37f741c954dcdb9ba07de80fbbb71"})
    return resp

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    data = read_notifications()
    if data is None:
        return redirect(url_for("get_identity"))
    return jsonify(data)

@app.route("/api/messages", methods=["GET"])
def get_messages():
    data = read_messages()
    if data is None:
        return redirect(url_for("get_identity"))
    return jsonify(data)

@app.route("/api/identity", methods=["GET"])
def get_identity():
    data = identification()
    return jsonify(data)

@app.route("/api/events", methods=["GET"])
def get_events():
    data = read_events()
    return jsonify(data)

@app.route("/logout")
def logout():
    #delete entry in ticket.csv
    raw = request.cookies.get("session")
    if raw:
        ticketid = json.loads(raw).get("jti")
        keep = []
        try:
            with open("ticket.csv", "r", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row["ticketid"] != ticketid:
                        keep.append(row)
            
            with open("ticket.csv", "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.DictWriter(csvfile, ["ticketid"])
                writer.writeheader()
                writer.writerows(keep)
        except FileNotFoundError:
            pass

    resp = make_response(jsonify({"status": "logged out"}))
    # overwrite cookie with empty value and expired date
    resp.set_cookie("session", "", expires=0, httponly=True, samesite="None", secure=True)
    return resp

@app.route("/api/create-event", methods=["POST"])
def create_event():
    data = request.json
    eventid = str(uuid.uuid4())

    row = {
        "eventid": eventid,
        "title": data.get("title", ""),
        "userid": data.get("userid", ""),
        "date": str(data.get("start")).split("T")[0],  # YYYY-MM-DD
        "timestart": data.get("start", ""),
        "timeend": data.get("end", ""),
        "room": data.get("room", ""),
        "status": data.get("status", "scheduled"),
        "tutorid": data.get("userid", "")
    }

    with open("events.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if f.tell() == 0:
            writer.writeheader()
        writer.writerow(row)

    return jsonify({"success": True, "eventid": eventid})

if __name__ == "__main__":
    app.run(debug=True, port=8080)