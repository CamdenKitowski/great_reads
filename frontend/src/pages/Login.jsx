import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";


function Login() {
    
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signIn({ email, password });
            navigate("/home");
        } catch (error) {
            console.error("Login failed:", error.message);
            alert("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <div className="user-detail-container">
            <h2>Login</h2>
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="user-input-field"
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="user-input-field"
            />
            <button onClick={handleLogin}>Log In</button>
            <p>
                Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
        </div>
    )
}

export default Login;