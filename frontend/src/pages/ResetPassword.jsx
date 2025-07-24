import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/ResetPassword.css";

function ResetPassword() {
    const { updatePassword } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    // Extract token once on mount -- checking if token is there
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) {
            setMessage("Invalid or missing reset token.");
            setIsError(true);
        }
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        if (!newPassword) {
            setMessage("Please enter a new password.");
            setIsError(true);
            return;
        }

        const hash = window.location.hash;
        let token = null;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            token = params.get("access_token");
        }
        if (!token) {
            setMessage("Invalid or missing reset token.");
            setIsError(true);
            return;
        }

        try {
            const { data, error } = await updatePassword(token, newPassword);
            if (error) {
                setMessage(`Error: ${error}`);
                setIsError(true);
            } else {
                setMessage(data.message || "Password updated successfully. Redirecting to login...");
                setIsError(false);
                setTimeout(() => navigate("/"), 3000);
            }
        } catch (err) {
            console.error("Unexpected error in handleReset:", err);
            setMessage("An unexpected error occurred. Please try again later.");
            setIsError(true);
        }
    };

    return (
        <div className="user-detail-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="reset-input"
                />
                <button id="reset-password-button" type="submit">Reset Password</button>
                {message && <p className={isError ? "error-message" : "success-message"}>{message}</p>}
            </form>
            <p>
                <a href="/">Back to Login</a>
            </p>
        </div>
    );
}

export default ResetPassword;