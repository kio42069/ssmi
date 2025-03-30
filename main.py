#!/usr/bin/env python3
from utils import *
from time import sleep
import signal

# Constants
GET_ACTIVE_WINDOW_COMMAND = "hyprctl activewindow -j"
xX_TimeTracker_Xx = {'idle': 0}

# Initialize the database
initialize_db()

while True:
    try:
        RAW_JSON_OUTPUT = execute_shell_command(GET_ACTIVE_WINDOW_COMMAND)

        if RAW_JSON_OUTPUT == {}:
            xX_TimeTracker_Xx['idle'] += 1
            update_time_tracking('idle', 1)
            sleep(1)
            continue

        current_window = RAW_JSON_OUTPUT['initialTitle']
        
        if current_window not in xX_TimeTracker_Xx:
            xX_TimeTracker_Xx[current_window] = 0
        xX_TimeTracker_Xx[current_window] += 1
        update_time_tracking(current_window, 1)
        
        print(xX_TimeTracker_Xx)
        
        sleep(1)
    
    except KeyboardInterrupt:
        save_and_exit(signal.SIGINT, None, xX_TimeTracker_Xx)
    
    except Exception as e:
        print(f"Error: {e}")