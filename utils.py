import subprocess
import json
import sys
from datetime import datetime
import psycopg2

# Database connection setup
DB_CONFIG = {
    "dbname": "time_tracker",
    "user": "kiddo42069",
    "password": "kiddo42069",
    "host": "localhost",
    "port": 5432
}

def connect_to_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        sys.exit(1)

def initialize_db():
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS time_tracking (
            id SERIAL PRIMARY KEY,
            window_name TEXT NOT NULL UNIQUE,  -- Add UNIQUE constraint
            time_spent INTEGER NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()

def update_time_tracking(window_name, time_spent):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO time_tracking (window_name, time_spent)
        VALUES (%s, %s)
        ON CONFLICT (window_name)
        DO UPDATE SET
            time_spent = time_tracking.time_spent + EXCLUDED.time_spent,
            last_updated = CURRENT_TIMESTAMP;
    """, (window_name, time_spent))
    conn.commit()
    cursor.close()
    conn.close()

def log_dict_to_file(data, log_dir="/var/log"):
    if not isinstance(data, dict):
        raise ValueError("Input data must be a dictionary")
    
    log_filename = datetime.now().strftime("%d-%m-%Y.log")
    log_path = f"{log_dir}/{log_filename}"
    
    try:
        with open(log_path, "a") as log_file:
            json.dump(data, log_file)
            log_file.write("\n")
    except IOError as e:
        raise IOError(f"Failed to write to log file: {e}")

def execute_shell_command(command):
    try:
        result = subprocess.check_output(command, shell=True, text=True)
        return json.loads(result)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}")
    except subprocess.CalledProcessError as e:
        raise e

def save_and_exit(signal_received, frame, xX_TimeTracker_Xx):
    conn = connect_to_db()
    cursor = conn.cursor()
    for window, time_spent in xX_TimeTracker_Xx.items():
        cursor.execute("""
            INSERT INTO time_tracking (window_name, time_spent)
            VALUES (%s, %s)
            ON CONFLICT (window_name)
            DO UPDATE SET
                time_spent = time_tracking.time_spent + EXCLUDED.time_spent,
                last_updated = CURRENT_TIMESTAMP;
        """, (window, time_spent))
    conn.commit()
    cursor.close()
    conn.close()
    print("\nData saved to database. Exiting...")
    sys.exit(0)
