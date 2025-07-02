export const idlFactory = ({ IDL }) => {
  const StoredFile = IDL.Record({
    'title' : IDL.Text,
    'data' : IDL.Vec(IDL.Nat8),
    'hash' : IDL.Text,
    'description' : IDL.Text,
    'filename' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const FileInfo = IDL.Record({
    'title' : IDL.Text,
    'hash' : IDL.Text,
    'size' : IDL.Nat64,
    'description' : IDL.Text,
    'filename' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const UploadRequest = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'filename' : IDL.Text,
  });
  const UploadResponse = IDL.Record({
    'hash' : IDL.Opt(IDL.Text),
    'message' : IDL.Text,
  });
  return IDL.Service({
    'get_file_by_hash' : IDL.Func([IDL.Text], [IDL.Opt(StoredFile)], ['query']),
    'get_file_info_by_hash' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(FileInfo)],
        ['query'],
      ),
    'list_all_files' : IDL.Func([], [IDL.Vec(FileInfo)], ['query']),
    'upload_file' : IDL.Func([UploadRequest], [UploadResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
