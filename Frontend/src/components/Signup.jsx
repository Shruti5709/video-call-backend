import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const handleSignup = async () => {
    try {
    const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    } catch (error) {
    console.log(error);
    setMessage("Something went wrong");
    }
};

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
        <h2>Signup</h2>

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
        onClick={handleSignup}
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
        Signup
        </button>

        {/* Message */}
        <p style={{ color: message === "User saved successfully" ? "green" : "red" }}>
        {message}
        </p>

        {/* Go back to login */}
        <p>
        Already have an account? <Link to="/">Login</Link>
        </p>
    </div>
    </div>
);
}

export default Signup;