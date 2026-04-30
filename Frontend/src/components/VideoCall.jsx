import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://10.77.239.220:5000");

function VideoCall() {
const myVideo = useRef(null);
const userVideo = useRef(null);
const peerConnection = useRef(null);
const hasCreatedOffer = useRef(false);

const [roomId, setRoomId] = useState("");
const [isMuted, setIsMuted] = useState(false);

useEffect(() => {
    socket.on("connect", () => {
    console.log("Connected:", socket.id);
    });

    // ✅ USER JOINED → CREATE OFFER ONLY ONCE
    socket.on("user-joined", async () => {
    if (!peerConnection.current) return;

      if (hasCreatedOffer.current) return; // 🔥 prevent multiple offers
    hasCreatedOffer.current = true;

    console.log("Creating offer...");

    try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.emit("offer", { offer, roomId });
    } catch (err) {
        console.log("Offer error:", err);
    }
    });

    // ✅ RECEIVE OFFER
    socket.on("offer", async (offer) => {
    if (!peerConnection.current) return;

    console.log("Received offer");

    await peerConnection.current.setRemoteDescription(offer);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", { answer, roomId });
    });

    // ✅ RECEIVE ANSWER
    socket.on("answer", async (answer) => {
    console.log("Received answer");

    await peerConnection.current.setRemoteDescription(answer);
    });

    // ✅ ICE
    socket.on("ice-candidate", async (candidate) => {
    try {
        await peerConnection.current.addIceCandidate(candidate);
    } catch (e) {
        console.log("ICE error:", e);
    }
    });

    return () => {
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    };

}, [roomId]);

  // 🎥 START CAMERA
const startCamera = async () => {
    if (!roomId) {
    alert("Enter Room ID");
    return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
    });

    myVideo.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection({
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
        },
    ],
    });

    stream.getTracks().forEach((track) => {
    peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
    userVideo.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId,
        });
    }
    };
};

  // 📞 START CALL
const startCall = () => {
    if (!roomId) {
    alert("Enter Room ID");
    return;
    }

    console.log("Joining room:", roomId);

    hasCreatedOffer.current = false; // reset
    socket.emit("join-room", roomId);
};

  // ❌ END CALL
const endCall = () => {
    if (myVideo.current.srcObject) {
    myVideo.current.srcObject.getTracks().forEach(track => track.stop());
    }

    if (peerConnection.current) {
    peerConnection.current.close();
    }

    hasCreatedOffer.current = false;

    myVideo.current.srcObject = null;
    userVideo.current.srcObject = null;

    alert("Call Ended");
};

  // 🎤 MUTE
const toggleMute = () => {
    const audioTrack = myVideo.current.srcObject?.getAudioTracks()[0];

    if (audioTrack) {
    audioTrack.enabled = isMuted;
    setIsMuted(!isMuted);
    }
};

return (
    <div style={{
    textAlign: "center",
    background: "#111",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
    }}>

      {/* ROOM INPUT */}
    <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: 10, marginBottom: 10 }}
    />

      {/* BUTTONS */}
    <button onClick={startCamera} style={{ margin: 10 }}>
        Start Camera 🎥
    </button>

    <button onClick={startCall} style={{ margin: 10 }}>
        Start Call 📞
    </button>

    <div style={{ marginBottom: "15px" }}>
        <button onClick={endCall} style={{ margin: 5 }}>
        End Call ❌
        </button>

        <button onClick={toggleMute} style={{ margin: 5 }}>
        {isMuted ? "Unmute 🎤" : "Mute 🔇"}
        </button>
    </div>

      {/* VIDEOS */}
    <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 20
    }}>
        <video
        ref={myVideo}
        autoPlay
        muted
        playsInline
        style={{ width: "40%", borderRadius: "10px" }}
        />

        <video
        ref={userVideo}
        autoPlay
        playsInline
        style={{ width: "40%", borderRadius: "10px" }}
        />
    </div>
    </div>
);
}

export default VideoCall;