import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const navigate = useNavigate();

useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    navigate("/dashboard");
    }
}, []);

const handleLogin = async () => {
    try {
    const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
    }

    setMessage(data.message);
    } catch (error) {
    console.log(error);
    setMessage("Something went wrong");
    }
};

  // 👇 YOUR RETURN STARTS HERE (your code is correct)
return (
    <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5"
    }}>
    <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
        textAlign: "center"
    }}>
        <h2>Login</h2>

        <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        />

        <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        />

        <button
        onClick={handleLogin}
        style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }}
        >
        Login
        </button>

        <p style={{ color: message === "Login successful" ? "green" : "red" }}>
        {message}
        </p>

        <p>
        Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
    </div>
    </div>
);
}

export default Login;