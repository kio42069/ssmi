#!/bin/bash
# filepath: /home/surt/garage/start.sh

echo "Starting the application..."

# Start the backend server
echo "Starting the backend server..."
cd backend || exit
npm start &

# Start the frontend server
echo "Starting the frontend server..."
cd ../frontend || exit
npm start &

echo "Application is running. Access the frontend at http://localhost:3000"