import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/Login.css";


function Login() {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Call signIn and destructure the response
        const { data, error } = await signIn({ email, password });
        
        if (error) {
            console.error("Login failed:", error.message);
            alert("Login failed. Please check your credentials and try again.");
        } else {
            navigate("/home");
        }
    };

    

    return (
        <div className="user-detail-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Log In</button>
            </form>
            <p id="sign-up">
                Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
            <p id="forgot-password">
                <Link to="/enterEmail">Forgot Password?</Link>
            </p>
        </div>
    )
}

export default Login;