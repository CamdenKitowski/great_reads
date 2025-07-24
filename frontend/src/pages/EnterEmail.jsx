import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/EnterEmail.css";

function EnterEmail() {
    const { resetPassword } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        if (!email) {
            setMessage("Please enter your email address.");
            setIsError(true);
            return;
        }
        try {
            const { data, error } = await resetPassword(email);
            if (error) {
                setMessage(`Error: ${error.message}`);
                setIsError(true);
            } else {
                setMessage(data.message || "Password reset email sent. Check your inbox.");
                setIsError(false);
                // Optionally navigate back to login after success
                setTimeout(() => navigate("/"), 3000);
            }
        } catch (err) {
            setMessage("An unexpected error occurred.");
            setIsError(true);
        }
    };

    return (
        <div className="user-detail-container">
            <h2>Forgot Password?</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                <input 
                    className="reset-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <button id="submit-button" type="submit">Submit</button>
                {message && <p className={isError ? "error-message" : "success-message"}>{message}</p>}
            </form>
            <p className="back-to-login">
                <a href="/">Back to Login</a>
            </p>
        </div>
    );
}

export default EnterEmail;