import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
const navigate = useNavigate();

  // ✅ Protect dashboard (only if logged in)
useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
    navigate("/");
    }
}, []);

  // ✅ Logout function
const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
};

  // ✅ Go to camera page
const handleStartCamera = () => {
    navigate("/video");
};

return (
    <div style={{
    height: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
    }}>
    <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        textAlign: "center",
        width: "350px"
    }}>
        <h1 style={{ marginBottom: "10px" }}>🎉 Welcome</h1>

        <p style={{ color: "#555", marginBottom: "20px" }}>
        You are logged in successfully
        </p>

        {/* 🎥 Camera Button */}
        <button
        onClick={handleStartCamera}
        style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "10px"
        }}
        >
        Start Video Call 🎥
        </button>

        {/* 🚪 Logout Button */}
        <button
        onClick={handleLogout}
        style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
        }}
        >
        Logout
        </button>
    </div>
    </div>
);
}

export default Dashboard;