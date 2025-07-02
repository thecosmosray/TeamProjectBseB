import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Canister ID will be set after dfx deployment
const BACKEND_CANISTER_ID = process.env.REACT_APP_BACKEND_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai';

// IDL factory for the backend canister
const idlFactory = ({ IDL }) => {
  const UploadRequest = IDL.Record({
    'title': IDL.Text,
    'description': IDL.Text,
    'file_data': IDL.Vec(IDL.Nat8),
    'filename': IDL.Text,
  });
  
  const UploadResponse = IDL.Record({
    'message': IDL.Text,
    'hash': IDL.Opt(IDL.Text),
  });
  
  const StoredFile = IDL.Record({
    'title': IDL.Text,
    'description': IDL.Text,
    'filename': IDL.Text,
    'data': IDL.Vec(IDL.Nat8),
    'hash': IDL.Text,
    'timestamp': IDL.Nat64,
  });
  
  const FileInfo = IDL.Record({
    'title': IDL.Text,
    'description': IDL.Text,
    'filename': IDL.Text,
    'hash': IDL.Text,
    'timestamp': IDL.Nat64,
    'size': IDL.Nat64,
  });

  return IDL.Service({
    'upload_file': IDL.Func([UploadRequest], [UploadResponse], []),
    'get_file_by_hash': IDL.Func([IDL.Text], [IDL.Opt(StoredFile)], ['query']),
    'get_file_info_by_hash': IDL.Func([IDL.Text], [IDL.Opt(FileInfo)], ['query']),
    'list_all_files': IDL.Func([], [IDL.Vec(FileInfo)], ['query']),
  });
};

let actor = null;

export const initActor = async () => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  
  const agent = new HttpAgent({
    host: process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:4943',
    identity,
  });

  // Fetch root key for local development
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID,
  });

  return actor;
};

export const getActor = () => {
  if (!actor) {
    throw new Error('Actor not initialized. Call initActor() first.');
  }
  return actor;
};

// Helper function to convert File to Uint8Array
export const fileToUint8Array = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(uint8Array);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Canister service functions
export const uploadFile = async (title, description, file) => {
  try {
    const actor = getActor();
    const fileData = await fileToUint8Array(file);
    
    const request = {
      title,
      description,
      file_data: Array.from(fileData), // Convert Uint8Array to Array for Candid
      filename: file.name,
    };

    const response = await actor.upload_file(request);
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getFileByHash = async (hash) => {
  try {
    const actor = getActor();
    const result = await actor.get_file_by_hash(hash);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Get file error:', error);
    throw error;
  }
};

export const getFileInfoByHash = async (hash) => {
  try {
    const actor = getActor();
    const result = await actor.get_file_info_by_hash(hash);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Get file info error:', error);
    throw error;
  }
};

export const listAllFiles = async () => {
  try {
    const actor = getActor();
    const files = await actor.list_all_files();
    return files;
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};