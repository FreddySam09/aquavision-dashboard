import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

import random
import math

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# ============================
# INITIAL AUV STATE
# ============================
auv_state = {
    "x": 0, "y": 0, "z": 0,
    "speed": 0.1,
    "battery": 100,

    # Detection States
    "plastic_detected": False,
    "plastic_confidence": 1,
    "plastic_collection": False,
    "fishes_detected": 0,   # << REQUIRED BY FRONTEND

    # Movement
    "direction": 180,
    "distance_traveled": 0,
    "distance_since_last_detection": 0,

    # Health
    "health_status": {
        "motor": 100,
        "sensors": 100,
        "camera": 100,
        "thrusters": 100,
    }
}

TURN_INTERVAL = random.randint(10, 15)
TURN_ANGLE = 90


# ============================
#    AUV MOVEMENT + DETECTION
# ============================
def simulate_auv_movement():
    print("🚀 AUV simulation function has started!")

    while True:
        # --- Movement ---
        angle_rad = math.radians(auv_state["direction"])
        auv_state["x"] += math.sin(angle_rad) * auv_state["speed"]
        auv_state["z"] += math.cos(angle_rad) * auv_state["speed"]

        auv_state["distance_traveled"] += auv_state["speed"]
        auv_state["distance_since_last_detection"] += auv_state["speed"]

        # Depth changes
        auv_state["y"] += 0.1 if random.random() > 0.5 else -0.1

        # Battery drain
        auv_state["battery"] = max(0, auv_state["battery"] - 0.02)

        # ==============================
        #   DETECTION (EVERY 1 METER)
        # ==============================
        if auv_state["distance_since_last_detection"] >= 1:
            auv_state["distance_since_last_detection"] = 0

            # RANDOM FISH DETECTION
            auv_state["fishes_detected"] = random.choice([0, 1])

            # RANDOM PLASTIC DETECTION
            plastic_confidence = random.uniform(0.0, 1.0)
            auv_state["plastic_confidence"] = plastic_confidence
            auv_state["plastic_detected"] = plastic_confidence < 0.5

            # ==============================
            #   COLLECTION LOGIC (PLASTIC ONLY)
            # ==============================
            if auv_state["plastic_detected"] and auv_state["fishes_detected"] == 0:
                auv_state["plastic_collection"] = True
                print("🟡 Plastic detected — Starting collection...")
                socketio.emit("auv_update", auv_state)

                # Battery draining during collection
                for _ in range(7):
                    auv_state["battery"] = max(0, auv_state["battery"] - 0.2)
                    socketio.emit("auv_update", auv_state)
                    socketio.sleep(1)

                # Reset
                auv_state["plastic_collection"] = False
                auv_state["plastic_detected"] = False
                print("✅ Plastic collection complete!")

        # Turn 90 degrees every interval
        if auv_state["distance_traveled"] >= TURN_INTERVAL:
            auv_state["direction"] += TURN_ANGLE
            auv_state["distance_traveled"] = 0

        # Update WebSocket clients
        socketio.emit("auv_update", auv_state)
        socketio.sleep(1)


# ============================
#       HEALTH SIMULATION
# ============================
for component in auv_state["health_status"]:
    if component == "sensors":
        decay = random.uniform(0.5, 1.5)
    else:
        decay = random.uniform(0.05, 0.2)

    auv_state["health_status"][component] = max(0, auv_state["health_status"][component] - decay)

    # random big drops for realism
    if component == "sensors" and random.random() < 0.1:
        auv_state["health_status"][component] -= random.uniform(5, 10)
    elif random.random() < 0.05:
        auv_state["health_status"][component] -= random.uniform(2, 5)

# Convert numeric health to labels
health_labels = {}
for comp, val in auv_state["health_status"].items():
    if val > 90:
        health_labels[comp] = "good"
    elif val > 70:
        health_labels[comp] = "warning"
    else:
        health_labels[comp] = "critical"

auv_state["health_status"] = health_labels


@app.route("/")
def index():
    return f"✅ AUV Server Running<br>State: {auv_state}"


if __name__ == "__main__":
    print("🌍 Flask-SocketIO server is starting...")
    socketio.start_background_task(simulate_auv_movement)
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
