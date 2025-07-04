import { Actor, HttpAgent } from "@dfinity/agent";

// Get environment variables
const BACKEND_CANISTER_ID = process.env.REACT_APP_BACKEND_CANISTER_ID;
const DFX_NETWORK = process.env.REACT_APP_DFX_NETWORK || "local";

console.log("Environment variables:");
console.log("BACKEND_CANISTER_ID:", BACKEND_CANISTER_ID);
console.log("DFX_NETWORK:", DFX_NETWORK);

// Candid interface for the backend canister
const idlFactory = ({ IDL }) => {
  const UploadRequest = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'filename' : IDL.Text,
  });
  const UploadResponse = IDL.Record({
    'message' : IDL.Text,
    'hash' : IDL.Opt(IDL.Text),
  });
  const StoredFile = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'filename' : IDL.Text,
    'data' : IDL.Vec(IDL.Nat8),
    'hash' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const FileInfo = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'filename' : IDL.Text,
    'hash' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'size' : IDL.Nat64,
  });
  return IDL.Service({
    'upload_file' : IDL.Func([UploadRequest], [UploadResponse], []),
    'get_file_by_hash' : IDL.Func([IDL.Text], [IDL.Opt(StoredFile)], ['query']),
    'get_file_info_by_hash' : IDL.Func([IDL.Text], [IDL.Opt(FileInfo)], ['query']),
    'list_all_files' : IDL.Func([], [IDL.Vec(FileInfo)], ['query']),
  });
};

const backendCanisterId = BACKEND_CANISTER_ID;

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

// Helper function to convert File to Uint8Array
const fileToUint8Array = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(uint8Array);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Upload file function
export const uploadFile = async (title, description, file) => {
  try {
    console.log("📤 Starting file upload...");
    
    if (!backendActor) {
      throw new Error("Backend actor not initialized. Please refresh the page.");
    }

    // Convert file to Uint8Array
    const fileData = await fileToUint8Array(file);
    
    // Prepare upload request
    const uploadRequest = {
      title: title,
      description: description,
      file_data: fileData,
      filename: file.name
    };

    console.log("📦 Upload request prepared:", {
      title,
      description,
      filename: file.name,
      fileSize: fileData.length
    });

    // Call backend canister
    const result = await backendActor.upload_file(uploadRequest);
    
    console.log("✅ Upload response:", result);
    
    return result;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

// Export default actor
export const backend = backendActor;