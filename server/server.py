import eventlet  
eventlet.monkey_patch()

from flask import Flask  
from flask_socketio import SocketIO  
from flask_cors import CORS  
import serial  # ✅ Import Serial for Arduino Communication
import threading  # ✅ Use a Separate Thread for Serial Reading
import random  
import math  
import serial.tools.list_ports  # To list available Serial ports

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")  

# ✅ AUV State
auv_state = {
    "x": 0, "y": 0, "z": 0,
    "speed": 0.1,
    "battery": 100,
    "plastic_detected": False,
    "plastic_collection": False,
    "fishes_detected": 0,  # ✅ Track presence of fishes
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
TURN_INTERVAL = random.randint(10, 15)  # Change direction every 10-15 meters
TURN_ANGLE = 90  # Rotate 90 degrees at each turn

# ✅ Parameters for Pausing and Waiting
DISTANCE_PER_CHECK = 1  # Check for plastic every 1 meter
WAIT_DURATION = 5  # Wait 5 seconds if state is 'w'

# ✅ List Available Serial Ports for Debugging
print("📋 Available Serial Ports:")
ports = serial.tools.list_ports.comports()
for port in ports:
    print(f" - {port.device}: {port.description}")

# ✅ Initialize Serial Connection (COM8 for Arduino)
SERIAL_PORT = "COM8"  
BAUD_RATE = 9600

try:
    arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"✅ Connected to Arduino on {SERIAL_PORT}")
    arduino.flush()  # Clear any stale data in the Serial buffer
    # Skip initial Arduino startup message
    print("⏳ Waiting for Arduino to initialize...")
    socketio.sleep(2)  # Wait for Arduino to send startup message
    while arduino.in_waiting > 0:
        startup_line = arduino.readline().decode('utf-8', errors='ignore').strip()
        print(f"📥 Arduino Startup Message: '{startup_line}'")
except Exception as e:
    print(f"❌ Error connecting to Arduino: {e}")
    arduino = None

# ✅ Flag to Track New Arduino Data
new_data_received = False
last_state = None  # Initialize as None since we won't assume a default state

# ✅ Function to Read Plastic Status from Arduino
def read_arduino_data():
    """ Continuously reads plastic status (y, w, n) from Arduino """
    global auv_state, new_data_received, last_state
    while True:
        if arduino:
            try:
                # Check if data is available to read
                if arduino.in_waiting > 0:
                    line = arduino.readline().decode('utf-8', errors='ignore').strip()
                    print(f"📥 Raw Serial Data: '{line}'")  # Debug: Log all raw Serial data

                    if line and line.startswith("Letter: \""):
                        state = line[len("Letter: \""):-1]
                        print(f"📡 Plastic Status Received: {state}")

                        # Update AUV state based on the received state
                        if state in ['y', 'w', 'n']:
                            if state == 'y':
                                auv_state["plastic_detected"] = True
                                auv_state["fishes_detected"] = 0
                            elif state == 'w':
                                auv_state["plastic_detected"] = True
                                auv_state["fishes_detected"] = 1
                            elif state == 'n':
                                auv_state["plastic_detected"] = False
                                auv_state["fishes_detected"] = 0

                            last_state = state
                            new_data_received = True  # Set flag to indicate new data
                            socketio.emit("auv_update", auv_state)
                        else:
                            print(f"⚠ Unknown state received: {state}")
                    else:
                        print(f"⚠ Non-state message: '{line}'")
                else:
                    print("📴 No Serial data available, waiting...")  # Debug: Confirm no data
            except Exception as e:
                print(f"⚠ Error reading Arduino: {e}")
                # Attempt to reconnect
                try:
                    arduino.close()
                    arduino.open()
                    print(f"🔄 Reconnected to Arduino on {SERIAL_PORT}")
                except Exception as reconnect_e:
                    print(f"❌ Failed to reconnect to Arduino: {reconnect_e}")
        else:
            print("⚠ Arduino not connected, cannot read data.")
        socketio.sleep(0.5)  # Increased sleep to give Serial buffer time to fill

# ✅ Start Serial Reading as a Background Thread
if arduino:
    threading.Thread(target=read_arduino_data, daemon=True).start()
else:
    print("⚠ AUV will wait indefinitely for Arduino data. Please ensure Arduino is connected.")

# ✅ Function to Simulate AUV Movement
def simulate_auv_movement():
    """ Simulates AUV telemetry and follows a structured path """
    global TURN_INTERVAL, new_data_received, last_state  # Declare all globals
    print("🚀 AUV simulation function has started!")

    while True:
        # ✅ Move AUV Forward Based on Direction (if not paused or collecting)
        if not auv_state["plastic_collection"]:
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

        # ✅ Check for Plastic Every DISTANCE_PER_CHECK Meters
        if auv_state["distance_since_last_detection"] >= DISTANCE_PER_CHECK:
            auv_state["distance_since_last_detection"] = 0  # Reset distance tracker
            print("⏸ AUV is pausing to wait for Arduino result...")

            # Reset flag and wait indefinitely for Arduino data
            new_data_received = False
            while not new_data_received:
                socketio.sleep(1)

            print(f"✅ Received new state: {last_state}")

            # ✅ Process the State
            if last_state == 'y' and not auv_state["plastic_collection"]:
                # ✅ State 'y': Initiate Plastic Collection
                auv_state["plastic_collection"] = True
                print("🟡 AUV is collecting plastic...")
                socketio.emit("auv_update", auv_state)

                # Battery drains more during collection
                for _ in range(7):  # 7 seconds of collection
                    auv_state["battery"] = max(0, auv_state["battery"] - 0.2)
                    socketio.emit("auv_update", auv_state)
                    socketio.sleep(1)

                # Reset plastic detection after collection
                auv_state["plastic_collection"] = False
                auv_state["plastic_detected"] = False
                print("✅ Plastic collection complete!")

            elif last_state == 'w':
                # ✅ State 'w': Wait Before Resuming
                print(f"⏳ AUV is waiting for {WAIT_DURATION} seconds (fishes detected)...")
                for _ in range(WAIT_DURATION):
                    socketio.emit("auv_update", auv_state)
                    socketio.sleep(1)
                print("✅ Wait complete, resuming movement...")

            elif last_state == 'n':
                # ✅ State 'n': Move On Without Collection
                print("🚫 No plastic detected (state is 'n'), moving to next point...")

        # ✅ Change Direction Every TURN_INTERVAL Meters
        if auv_state["distance_traveled"] >= TURN_INTERVAL:
            auv_state["direction"] += TURN_ANGLE  # Turn 90 degrees
            auv_state["distance_traveled"] = 0  # Reset distance counter
            TURN_INTERVAL = random.randint(10, 15)  # Randomize next turn interval

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