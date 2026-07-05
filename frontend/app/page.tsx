import Ws from "./websocket";
export default function Home() {
    return (
        <>
            <h1 className="text-3xl text-center">Chattig using websocket's</h1>
            <Ws />
        </>
    );
}
