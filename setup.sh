#!/bin/bash
# filepath: /home/surt/garage/setup.sh

echo "Setting up the project..."

# Navigate to the backend directory and install dependencies
echo "Installing backend dependencies..."
cd backend || exit
npm install

# Navigate to the frontend directory and install dependencies
echo "Installing frontend dependencies..."
cd ../frontend || exit
npm install

echo "Setup complete. You can now run the start script to launch the application."