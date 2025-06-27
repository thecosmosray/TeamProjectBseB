use actix_web::{post, App, HttpServer, HttpResponse, Responder, middleware};
use actix_cors::Cors;
use actix_multipart::Multipart;
use futures_util::StreamExt as _;
use std::io::Write;

#[post("/upload")]
async fn upload(mut payload: Multipart) -> impl Responder {
    println!("⏺️ New upload request");

    while let Some(field) = payload.next().await {
        let mut field = field.unwrap();

        // Extract field name and filename first
        let cd = field.content_disposition();
        let name = cd.get_name().unwrap_or("unknown").to_string();
        let filename = cd.get_filename().unwrap_or("no-file").to_string();

        let mut data = Vec::new();
        while let Some(chunk) = field.next().await {
            let chunk = chunk.unwrap();
            data.extend_from_slice(&chunk);
        }

        println!("📦 Field: {name}, Filename: {filename}, Size: {} bytes", data.len());

        if name == "file" && filename != "no-file" {
            std::fs::create_dir_all("uploads").unwrap();
            let mut f = std::fs::File::create(format!("uploads/{}", filename)).unwrap();
           use sha2::{Sha256, Digest};
use hex;

f.write_all(&data).unwrap();

// Hash the uploaded file content
let mut hasher = Sha256::new();
hasher.update(&data);
let hash = hasher.finalize();
let hash_hex = hex::encode(hash);

println!("✅ Saved file: uploads/{}", filename);
println!("🔐 SHA-256 Hash (ownership ID): {}", hash_hex);

        }
    }

    HttpResponse::Ok().body("File uploaded successfully")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .wrap(middleware::Logger::default())
            .service(upload)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
