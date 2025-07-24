import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css';

function Signup() {

    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSignup = async (e) => {
        e.preventDefault();
        const { data, error } = await signUp({ email, password });
        
        if (error) {
            console.error("Sign up failed:", error.message);
            alert("Signup failed. Try again.");
        } else {
            navigate("/home");
        }
    };

    return (
        <div className="user-detail-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
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
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <a href="/">Log In</a>
            </p>
        </div>
    );
}

export default Signup;