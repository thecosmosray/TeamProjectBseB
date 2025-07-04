#!/bin/bash

echo "🚀 Starting ICP deployment process..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install the DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Start dfx local replica if not running
echo "🔄 Starting dfx local replica..."
dfx start --background --clean

# Deploy backend canister
echo "🔧 Building and deploying backend canister..."
dfx deploy backend

# Get backend canister ID
BACKEND_CANISTER_ID=$(dfx canister id backend)
echo "✅ Backend canister deployed with ID: $BACKEND_CANISTER_ID"

# Build frontend
echo "🔄 Building React frontend..."
cd frontend

# Create/update .env file with current canister IDs
echo "📝 Creating .env file with canister IDs..."
cat > .env << EOF
REACT_APP_FRONTEND_CANISTER_ID=$(dfx canister id frontend 2>/dev/null || echo "bd3sg-teaaa-aaaaa-qaaba-cai")
REACT_APP_BACKEND_CANISTER_ID=$BACKEND_CANISTER_ID
REACT_APP_DFX_NETWORK=local
REACT_APP_II_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
EOF

echo "✅ Environment file created:"
cat .env

npm install
npm run build
cd ..

# Deploy frontend canister
echo "🔧 Deploying frontend canister..."
dfx deploy frontend

# Get frontend canister ID
FRONTEND_CANISTER_ID=$(dfx canister id frontend)
echo "✅ Frontend canister deployed with ID: $FRONTEND_CANISTER_ID"

# Print deployment summary
echo ""
echo "🎉 Deployment completed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Deployment Summary:"
echo "   Backend Canister ID:  $BACKEND_CANISTER_ID"
echo "   Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌐 Access your application:"
echo "   Local:     http://localhost:4943/?canisterId=$FRONTEND_CANISTER_ID"
echo "   IC URL:    https://$FRONTEND_CANISTER_ID.ic0.app"
echo ""
echo "💡 Tip: Save these canister IDs for future reference!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"