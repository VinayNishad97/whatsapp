use axum::{
    Router,
    extract::ws::{WebSocket, WebSocketUpgrade},
    response::{IntoResponse, Response},
    routing::{any, get},
};

#[tokio::main]
async fn main() {
    println!("Hello, world!");

    let app = Router::new()
        .route("/", get(|| async { "hellow world " }))
        .route("/ws", any(sockethandler));
    let listner = tokio::net::TcpListener::bind("0.0.0.0:5000").await.unwrap();
    axum::serve(listner, app).await.unwrap();
}

async fn sockethandler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handel_socket)
}

async fn handel_socket(mut Socket: WebSocket) {
    while let Some(mssg) = Socket.recv().await {
        let mssg = if let Ok(mssg) = mssg {
            println!("clent send mssg {:?}", mssg.to_text());
            mssg
        } else {
            return;
        };

        if Socket.send(mssg).await.is_err() {
            return;
        }
    }
}
