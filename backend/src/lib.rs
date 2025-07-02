use ic_cdk::update;
use candid::CandidType;
use serde::{Serialize, Deserialize};
use sha2::{Digest, Sha256};
use hex;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use std::cell::RefCell;
use std::borrow::Cow;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdStore = StableBTreeMap<String, StoredFile, Memory>;

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct UploadRequest {
    pub title: String,
    pub description: String,
    pub file_data: Vec<u8>,
    pub filename: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct UploadResponse {
    pub message: String,
    pub hash: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct StoredFile {
    pub title: String,
    pub description: String,
    pub filename: String,
    pub data: Vec<u8>,
    pub hash: String,
    pub timestamp: u64,
}

impl Storable for StoredFile {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(serde_json::to_vec(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        serde_json::from_slice(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct FileInfo {
    pub title: String,
    pub description: String,
    pub filename: String,
    pub hash: String,
    pub timestamp: u64,
    pub size: u64,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_STORE: RefCell<IdStore> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );
}

#[update]
pub fn upload_file(request: UploadRequest) -> UploadResponse {
    ic_cdk::println!("⏺ New upload request for file: {}", request.filename);
    
    if request.file_data.is_empty() {
        return UploadResponse {
            message: "Error: Empty file data".to_string(),
            hash: None,
        };
    }

    // Calculate SHA-256 hash
    let mut hasher = Sha256::new();
    hasher.update(&request.file_data);
    let hash = hasher.finalize();
    let hash_hex = hex::encode(hash);
    
    // Get current timestamp (nanoseconds since epoch)
    let timestamp = ic_cdk::api::time();
    
    // Create stored file
    let stored_file = StoredFile {
        title: request.title.clone(),
        description: request.description.clone(),
        filename: request.filename.clone(),
        data: request.file_data.clone(),
        hash: hash_hex.clone(),
        timestamp,
    };
    
    // Store the file using hash as key
    ID_STORE.with(|store| {
        store.borrow_mut().insert(hash_hex.clone(), stored_file);
    });
    
    ic_cdk::println!("✅ Stored file: {}", request.filename);
    ic_cdk::println!("🔐 SHA-256 Hash (ownership ID): {}", hash_hex);
    
    UploadResponse {
        message: "File uploaded successfully".to_string(),
        hash: Some(hash_hex),
    }
}

#[ic_cdk::query]
pub fn get_file_by_hash(hash: String) -> Option<StoredFile> {
    ID_STORE.with(|store| {
        store.borrow().get(&hash)
    })
}

#[ic_cdk::query]
pub fn get_file_info_by_hash(hash: String) -> Option<FileInfo> {
    ID_STORE.with(|store| {
        store.borrow().get(&hash).map(|file| FileInfo {
            title: file.title,
            description: file.description,
            filename: file.filename,
            hash: file.hash,
            timestamp: file.timestamp,
            size: file.data.len() as u64,
        })
    })
}

#[ic_cdk::query]
pub fn list_all_files() -> Vec<FileInfo> {
    ID_STORE.with(|store| {
        store
            .borrow()
            .iter()
            .map(|(_, file)| FileInfo {
                title: file.title,
                description: file.description,
                filename: file.filename,
                hash: file.hash,
                timestamp: file.timestamp,
                size: file.data.len() as u64,
            })
            .collect()
    })
}