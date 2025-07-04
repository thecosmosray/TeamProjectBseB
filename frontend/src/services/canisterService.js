import { Actor, HttpAgent } from "@dfinity/agent";

// Get environment variables
const BACKEND_CANISTER_ID = process.env.REACT_APP_BACKEND_CANISTER_ID;
const DFX_NETWORK = process.env.REACT_APP_DFX_NETWORK || "local";

console.log("Environment variables:");
console.log("BACKEND_CANISTER_ID:", BACKEND_CANISTER_ID);
console.log("DFX_NETWORK:", DFX_NETWORK);

// Import candid interface from generated files
let idlFactory;
let backendCanisterId;

try {
  // Try to import from generated dfx files
  const backend = require("../../../.dfx/local/canisters/backend");
  idlFactory = backend.idlFactory;
  backendCanisterId = BACKEND_CANISTER_ID || backend.canisterId;
} catch (error) {
  console.warn("Could not import from .dfx, using fallback IDL factory");
  
  // Fallback IDL factory for basic functionality
  idlFactory = ({ IDL }) => {
    return IDL.Service({
      'greet': IDL.Func([IDL.Text], [IDL.Text], ['query']),
    });
  };
  backendCanisterId = BACKEND_CANISTER_ID;
}

// Validate canister ID
if (!backendCanisterId) {
  throw new Error("Canister ID is required, but received undefined instead.");
}

// Create HTTP agent
const agent = new HttpAgent({
  host: DFX_NETWORK === "local" ? "http://localhost:4943" : "https://ic0.app",
});

// Fetch root key for certificate validation during development
if (DFX_NETWORK !== "ic") {
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });
}

// Create actor
export const createActor = (canisterId, options = {}) => {
  const effectiveCanisterId = canisterId || backendCanisterId;
  
  if (!effectiveCanisterId) {
    throw new Error("Canister ID is required, but received undefined instead.");
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: effectiveCanisterId,
    ...options,
  });
};

// Global backend actor instance
let backendActor = null;

// Initialize actor
export const initActor = async () => {
  try {
    console.log("Initializing backend actor with canister ID:", backendCanisterId);
    
    if (!backendCanisterId) {
      throw new Error("Backend canister ID is not set. Please check your environment variables.");
    }
    
    backendActor = createActor(backendCanisterId);
    console.log("✅ Backend actor initialized successfully");
    return backendActor;
  } catch (error) {
    console.error("❌ Failed to initialize backend actor:", error);
    throw error;
  }
};

// Get the backend actor instance
export const getBackendActor = () => {
  if (!backendActor) {
    throw new Error("Backend actor not initialized. Call initActor() first.");
  }
  return backendActor;
};

// Export default actor
export const backend = backendActor;