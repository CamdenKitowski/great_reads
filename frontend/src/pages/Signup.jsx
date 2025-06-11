import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css';

function Signup() {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await signUp({ email, password });
            navigate('/home');
        } catch (error) {
            console.error("Login failed:", error.message);
            alert("Signup failed. Please check your credentials and try again.");
        }
    };

    return (
        <div className="user-detail-container">
            <h2>Sign Up</h2>
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
            <button onClick={handleSignup}>
                Sign Up
            </button>
            <p>
                Already have an account? <a href="/login">Log In</a>
            </p>
        </div>
    );
}

export default Signup;