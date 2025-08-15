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

# ✅ AUV State
auv_state = {
    "x": 0, "y": 0, "z": 0,
    "speed": 0.1,
    "battery": 100,
    "plastic_detected": False,
    "plastic_confidence": 1,  # Start with full confidence (no plastic)
    "plastic_collection": False,
    "direction": 180,
    "distance_traveled": 0,
    "distance_since_last_detection": 0,  # ✅ Track movement before next plastic check
    "health_status": {
        "motor": 100,
        "sensors": 100,
        "camera": 100,
        "thrusters": 100,
    }
}

# ✅ Parameters for Turning
TURN_INTERVAL = random.randint(10, 15)  # Change direction every 10-15 seconds
TURN_ANGLE = 90  # Rotate 90 degrees at each turn


# ✅ Function to Simulate AUV Movement
def simulate_auv_movement():
    """ Simulates AUV telemetry and follows a structured path """
    print("🚀 AUV simulation function has started!")

    while True:
        # ✅ Move AUV Forward Based on Direction
        angle_rad = math.radians(auv_state["direction"])
        auv_state["x"] += math.sin(angle_rad) * auv_state["speed"]
        auv_state["z"] += math.cos(angle_rad) * auv_state["speed"]

        # ✅ Update distance traveled
        auv_state["distance_traveled"] += auv_state["speed"]
        auv_state["distance_since_last_detection"] += auv_state["speed"]

        # ✅ Simulate gradual depth changes (up and down motion)
        if random.random() > 0.5:
            auv_state["y"] += 0.1  # Slightly ascend
        else:
            auv_state["y"] -= 0.1  # Slightly descend

        # ✅ Battery Drain (Normal movement)
        auv_state["battery"] = max(0, auv_state["battery"] - 0.02)

        # ✅ Plastic Detection (Only after moving 1 meter)
        if auv_state["distance_since_last_detection"] >= 1:
            auv_state["distance_since_last_detection"] = 0  # Reset distance tracker
            
            plastic_confidence = random.uniform(0.0, 1.0)  # ✅ Equal 50% chance
            auv_state["plastic_confidence"] = plastic_confidence
            auv_state["plastic_detected"] = plastic_confidence < 0.5  # ✅ 50% probability

            if auv_state["plastic_detected"]:  # ✅ Ensure collection always starts
                if not auv_state["plastic_collection"]:
                    auv_state["plastic_collection"] = True  # Start collection
                    print("🟡 AUV is collecting plastic...")
                    socketio.emit("auv_update", auv_state)  # Notify clients

                    # ✅ Battery drains more during collection
                    for _ in range(7):  # 7 seconds of collection
                        auv_state["battery"] = max(0, auv_state["battery"] - 0.2)
                        socketio.emit("auv_update", auv_state)
                        socketio.sleep(1)  # Sleep for 1 second, repeat 7 times

                    # ✅ Reset plastic detection after collection
                    auv_state["plastic_collection"] = False  # Resume movement
                    auv_state["plastic_detected"] = False  # Plastic is cleared
                    print("✅ Plastic collection complete!")
        # ✅ Change Direction Every TURN_INTERVAL Meters
        if auv_state["distance_traveled"] >= TURN_INTERVAL:
            auv_state["direction"] += TURN_ANGLE  # Turn 90 degrees
            auv_state["distance_traveled"] = 0  # Reset distance counter

        # ✅ Send telemetry data to WebSocket clients
        socketio.emit("auv_update", auv_state)

        # ✅ Use socketio.sleep(1) instead of eventlet.sleep()
        socketio.sleep(1)


# ✅ Simulate AUV Health Degradation (Sensors degrade faster)
for component in auv_state["health_status"]:
    if component == "sensors":
        decay = random.uniform(0.5, 1.5)  # 🚀 Sensors degrade 5x-10x faster
    else:
        decay = random.uniform(0.05, 0.2)  # Normal decay for other components

    auv_state["health_status"][component] = max(0, auv_state["health_status"][component] - decay)

    # Occasionally drop by a bigger value (5% - 10%) for sensors
    if component == "sensors" and random.random() < 0.1:
        auv_state["health_status"][component] = max(0, auv_state["health_status"][component] - random.uniform(5, 10))

    # Occasionally drop by a bigger value (2% - 5%) for other components
    elif random.random() < 0.05:
        auv_state["health_status"][component] = max(0, auv_state["health_status"][component] - random.uniform(2, 5))

# ✅ Convert Health Values to Labels
health_labels = {}
for component, value in auv_state["health_status"].items():
    if value > 90:
        health_labels[component] = "good"
    elif value > 70:
        health_labels[component] = "warning"
    else:
        health_labels[component] = "critical"

auv_state["health_status"] = health_labels  # Update state with labels


@app.route("/")
def index():
    """ Simple Web Interface to Check Server Status """
    return f"""
    ✅ AUV Server is Running! <br>
    📡 Current AUV State: {auv_state} 
    """


if __name__ == "__main__":
    print("🌍 Flask-SocketIO server is starting...")  

    # ✅ Run AUV simulation as a background task
    socketio.start_background_task(simulate_auv_movement)  

    # ✅ Start Flask WebSocket Server
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)