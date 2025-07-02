import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface FileInfo {
  'title' : string,
  'hash' : string,
  'size' : bigint,
  'description' : string,
  'filename' : string,
  'timestamp' : bigint,
}
export interface StoredFile {
  'title' : string,
  'data' : Uint8Array | number[],
  'hash' : string,
  'description' : string,
  'filename' : string,
  'timestamp' : bigint,
}
export interface UploadRequest {
  'title' : string,
  'description' : string,
  'file_data' : Uint8Array | number[],
  'filename' : string,
}
export interface UploadResponse { 'hash' : [] | [string], 'message' : string }
export interface _SERVICE {
  'get_file_by_hash' : ActorMethod<[string], [] | [StoredFile]>,
  'get_file_info_by_hash' : ActorMethod<[string], [] | [FileInfo]>,
  'list_all_files' : ActorMethod<[], Array<FileInfo>>,
  'upload_file' : ActorMethod<[UploadRequest], UploadResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
