import Ws from "./websocket";
export default function Home() {
    function mssg() {
        let websocket = new WebSocket("ws://localhost:5000/ws");
        websocket.onmessage = (mssg) => {
            let parsedmssg = JSON.parse(mssg.data);
            console.log(parsedmssg);
        };
    }
    return (
        <>
            <h1 className="text-3xl text-center">Whatsapp clone</h1>
            <Ws />
        </>
    );
}

const newt = 10;
