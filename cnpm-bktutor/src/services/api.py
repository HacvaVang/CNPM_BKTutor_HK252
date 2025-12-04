from flask import Flask, jsonify, request, Response, make_response, redirect, url_for
from flask_cors import CORS
import csv, uuid
import json
import requests

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

def identification(id = None):
    cookie_val = session_validate()
    if cookie_val is None:
        return {
            "selfid" : None,
            "name": None,
            "role": None,
            "state": None,
            "major": None
        }
    key = ""
    if id is not None:
        key = str(id).strip()
    else:
        key = str(cookie_val["user_id"]).strip()
    try:
        response = requests.get("http://127.0.0.1:7999/user?user_id=" + key)
        if response.status_code == 200:
            data = response.json()
            print(data["name"])
            return {
                    "selfid": data.get("user_id", None),
                    "name": data.get("name", None),
                    "role": data.get("role", None),
                    "state": data.get("status", None),
                    "major": data.get("major", None)
                }
        else:
            return {
                "selfid": None,
                "name": None,
                "role": None,
                "state": None,
                "major": None
            }
    except requests.exceptions.RequestException:
        return {
                "selfid": None,
                "name": None,
                "role": None,
                "state": None,
                "major": None
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
    

def read_events(all=False):
    cookie_val = session_validate()
    if cookie_val is None:
        return []
    
    key = cookie_val["user_id"]
    events = []
    
    try:
        if all:
            with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                with open("events.csv", newline="", encoding="utf-8") as csvfile2:
                    reader2 = csv.DictReader(csvfile2)
                    with open("roomcapacity.csv", newline="", encoding="utf-8") as csvfile3:
                        reader3 = csv.DictReader(csvfile3)
                        roommap = {row3["room"]: row3["capacity"] for row3 in reader3}
                        csvfile3.seek(0)
                        joined_event_ids = {row2["eventid"] for row2 in reader2 if row2["userid"] == str(key)}
                        csvfile2.seek(0)
                        for row in reader:
                            data = identification(row["tutorid"])
                            events.append({
                                "id": row["eventid"],
                                "title": row["title"],
                                "date": row["date"],
                                "timestart": row["timestart"],
                                "timeend": row["timeend"],
                                "room": row["room"],
                                "capacity": roommap.get(row["room"], "Unknown"),
                                "num_joined": len([1 for r in reader2 if r["eventid"] == row["eventid"]]),
                                "status": "joined" if row["eventid"] in joined_event_ids and row["status"]=="upcoming" else "completed" if row["status"]=="completed" else "available",
                                "tutorname": data.get("name", "Unknown"),
                                "major": data.get("major", "Unknown")
                            })
                            csvfile2.seek(0)
        else:
            with open("sessions.csv", newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                with open("events.csv", newline="", encoding="utf-8") as csvfile2:
                    reader2 = csv.DictReader(csvfile2)
                    joined_event_ids = {row2["eventid"] for row2 in reader2 if row2["userid"] == str(key)}
                    csvfile2.seek(0)
                    for row in reader:
                        if row["eventid"] in joined_event_ids or row["tutorid"] == str(key):
                            events.append({
                                "id": row["eventid"],
                                "title": row["title"],
                                "date": row["date"],
                                "timestart": row["timestart"],
                                "timeend": row["timeend"],
                                "room": row["room"],
                                "status": row["status"],
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

@app.route("/api/user", methods=["GET"])
def get_user():
    
    user_id = request.args.get("id")

    if not user_id:
        # Xử lý trường hợp không có ID được cung cấp
        return jsonify({"error": "Missing 'id' query parameter"}), 400

    data = identification(user_id)

    return jsonify(data)

@app.route("/api/events", methods=["GET"])
def get_events():
    data = read_events()
    return jsonify(data)

@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    data = read_events(all=True)
    return jsonify(data)
@app.route("/api/sessions/<eventid>", methods=["POST"])
def subscribe_session(eventid):
    cookie_val = session_validate()
    if cookie_val is None:
        return redirect(url_for("get_identity"))
    key = cookie_val["user_id"]
    print("Subscribing user:", key, "to event:", eventid)
    if not eventid:
        return jsonify({"error": "Missing 'eventid' in request body"}), 400
    #add entry in events.csv
    row = {
        "eventid": eventid,
        "userid": str(key)
    }
    with open("events.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if f.tell() == 0:
            writer.writeheader()
        writer.writerow(row)
    return jsonify({"status": "subscribed"})
@app.route("/api/sessions/<eventid>", methods=["DELETE"])
def unsubscribe_session(eventid):
    cookie_val = session_validate()
    if cookie_val is None:
        return redirect(url_for("get_identity"))
    key = cookie_val["user_id"]
    if not eventid:
        return jsonify({"error": "Missing 'eventid' in request body"}), 400
    #remove entry in events.csv
    keep = []
    try:
        with open("events.csv", "r", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if not (row["eventid"] == eventid and row["userid"] == str(key)):
                    keep.append(row)
        with open("events.csv", "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, ["eventid", "title", "userid", "date", "timestart", "timeend", "room", "status", "tutorid"])
            writer.writeheader()
            writer.writerows(keep)
    except FileNotFoundError:
        pass
    return jsonify({"status": "unsubscribed"})
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