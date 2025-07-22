#!/bin/bash

# Medical Clinic Dashboard - Initialization Script
# This script installs dependencies and starts the full application

set -e  # Exit on any error

echo "🏥 Initializing Medical Clinic Dashboard App..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker from https://docker.com/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Install server dependencies
install_server_deps() {
    print_status "Installing server dependencies..."
    cd server
    
    if [ ! -f "package.json" ]; then
        print_error "Server package.json not found!"
        exit 1
    fi
    
    npm install
    print_success "Server dependencies installed!"
    cd ..
}

# Install UI dependencies
install_ui_deps() {
    print_status "Installing UI dependencies..."
    cd ui
    
    if [ ! -f "package.json" ]; then
        print_error "UI package.json not found!"
        exit 1
    fi
    
    npm install
    print_success "UI dependencies installed!"
    cd ..
}

# Start MongoDB with Docker
start_mongodb() {
    print_status "Starting MongoDB with Docker..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Start MongoDB
    docker-compose up -d
    
    # Wait for MongoDB to be ready
    print_status "Waiting for MongoDB to be ready..."
    sleep 10
    
    # Check if MongoDB is running
    if docker-compose ps | grep -q "Up"; then
        print_success "MongoDB is running!"
    else
        print_error "Failed to start MongoDB!"
        exit 1
    fi
}

# Build the UI
build_ui() {
    print_status "Building UI for production..."
    cd ui
    npm run build
    print_success "UI built successfully!"
    cd ..
}

# Start the backend server
start_server() {
    print_status "Starting backend server..."
    cd server
    
    # Build TypeScript
    print_status "Building TypeScript..."
    npm run build
    
    if [ ! -f "dist/index.js" ]; then
        print_error "TypeScript compilation failed! dist/index.js not found."
        exit 1
    fi
    
    # Start server in background
    npm start &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 5
    
    # Check if server is running
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_success "Backend server started! (PID: $SERVER_PID)"
        echo $SERVER_PID > ../server.pid
    else
        print_error "Failed to start backend server!"
        exit 1
    fi
    
    cd ..
}

# Start the backend server in development mode
start_server_dev() {
    print_status "Starting backend server in development mode..."
    cd server
    
    # Start server with ts-node in background
    npm run dev &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 5
    
    # Check if server is running
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_success "Backend server (dev mode) started! (PID: $SERVER_PID)"
        echo $SERVER_PID > ../server.pid
    else
        print_error "Failed to start backend server in dev mode!"
        exit 1
    fi
    
    cd ..
}

# Start the frontend development server
start_ui() {
    print_status "Starting frontend development server..."
    cd ui
    
    # Start UI in background
    npm run dev &
    UI_PID=$!
    
    # Wait a moment for UI to start
    sleep 5
    
    # Check if UI is running
    if kill -0 $UI_PID 2>/dev/null; then
        print_success "Frontend server started! (PID: $UI_PID)"
        echo $UI_PID > ../ui.pid
    else
        print_error "Failed to start frontend server!"
        exit 1
    fi
    
    cd ..
}

# Create stop script
create_stop_script() {
    print_status "Creating stop script..."
    
    cat > stop.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping Medical Clinic Dashboard App..."

# Stop frontend
if [ -f "ui.pid" ]; then
    UI_PID=$(cat ui.pid)
    if kill -0 $UI_PID 2>/dev/null; then
        kill $UI_PID
        echo "✅ Frontend server stopped"
    fi
    rm -f ui.pid
fi

# Stop backend
if [ -f "server.pid" ]; then
    SERVER_PID=$(cat server.pid)
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo "✅ Backend server stopped"
    fi
    rm -f server.pid
fi

# Stop MongoDB
docker-compose down
echo "✅ MongoDB stopped"

echo "🏥 Medical Clinic Dashboard App stopped successfully!"
EOF

    chmod +x stop.sh
    print_success "Stop script created (./stop.sh)"
}

# Display final information
show_info() {
    echo ""
    echo "🎉 Medical Clinic Dashboard App is now running!"
    echo "=============================================="
    echo ""
    echo "📱 Frontend (React):     http://localhost:5173"
    echo "🔧 Backend API:          http://localhost:4000"
    echo "🗄️  MongoDB:             mongodb://localhost:27017"
    echo "🌐 Mongo Express:        http://localhost:8081"
    echo ""
    echo "📋 Default MongoDB credentials:"
    echo "   Username: admin"
    echo "   Password: password123"
    echo ""
    echo "🛑 To stop the application:"
    echo "   ./stop.sh"
    echo ""
    echo "📊 Health checks:"
    echo "   Backend:  curl http://localhost:4000/health"
    echo "   Frontend: Open http://localhost:5173 in browser"
    echo ""
    print_success "Setup complete! Happy coding! 🚀"
}

# Main execution
main() {
    # Check for production mode flag (development is default)
    PROD_MODE=false
    if [ "$1" = "--prod" ] || [ "$1" = "-p" ]; then
        PROD_MODE=true
        print_status "Running in production mode..."
    else
        print_status "Running in development mode (default)..."
    fi
    
    check_requirements
    install_server_deps
    install_ui_deps
    start_mongodb
    
    if [ "$PROD_MODE" = true ]; then
        start_server
    else
        start_server_dev
    fi
    
    start_ui
    create_stop_script
    show_info
}

# Handle script interruption
cleanup() {
    print_warning "Script interrupted. Cleaning up..."
    
    # Kill background processes
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$UI_PID" ]; then
        kill $UI_PID 2>/dev/null || true
    fi
    
    # Stop Docker containers
    docker-compose down 2>/dev/null || true
    
    exit 1
}

trap cleanup INT TERM

# Run main function
main

# Keep script running to show logs
print_status "Application is running. Press Ctrl+C to stop or run ./stop.sh"
print_status "Monitoring logs... (Press Ctrl+C to exit)"

# Follow logs from both servers
tail -f server/logs/*.log ui/logs/*.log 2>/dev/null || {
    print_warning "Log files not found. Servers are running in background."
    print_status "Check individual terminals or use ./stop.sh to stop services."
}