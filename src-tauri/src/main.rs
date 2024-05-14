// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::redirect::Policy;
use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime};

#[derive(Deserialize, Serialize)]
struct JellyfinInfoResponse {
    #[serde(rename = "LocalAddress")]
    local_address: String,
    #[serde(rename = "ServerName")]
    server_name: String,
    #[serde(rename = "Version")]
    version: String,
    #[serde(rename = "ProductName")]
    product_name: String,
    #[serde(rename = "Id")]
    id: String,
}

#[tauri::command]
async fn resolve_jellyfin(url: String) -> Result<JellyfinInfoResponse, String> {
    let client = reqwest::ClientBuilder::new()
        .redirect(Policy::limited(20))
        .build()
        .map_err(|e| e.to_string())?;

    let res = client.get(&format!("{url}System/Info/Public")).send().await;

    match res {
        Ok(response) => {
            let jellyfin_info: JellyfinInfoResponse =
                response.json().await.map_err(|e| e.to_string())?;

            Ok(jellyfin_info)
        }
        Err(_) => Err("Unable to connect to Jellyfin server".to_string()),
    }
}

fn inject_script_plugin<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("inject_script")
        .on_page_load(|webview, _| {
            webview
                .eval(include_str!("../../dist/preload.cjs"))
                .unwrap();
        })
        .build()
}

fn main() {
    tauri::Builder::default()
        .plugin(inject_script_plugin())
        .invoke_handler(tauri::generate_handler![resolve_jellyfin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
