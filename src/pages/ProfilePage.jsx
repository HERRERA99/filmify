import {useNavigate} from "react-router-dom";

import {useAuth} from "../components/Auth/AuthContext.jsx";
import "../styles/ProfilePage.css"

export function ProfilePage() {
    const {user, signOut} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            // Al cerrar sesión, redirigimos al login
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    if (!user) return null;

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1>Profile</h1>
                    </div>

                    <div className="profile-info">
                        <div className="avatar-placeholder">
                            {user.user_metadata?.first_name
                                ? user.user_metadata.first_name[0].toUpperCase()
                                : 'U'}
                        </div>

                        <div className="user-details">
                            <h2>
                                {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                            </h2>
                            <p className="email-text">{user.email}</p>

                            <span className="status-badge">
                                Member since {new Date(user.created_at).getFullYear()}
                            </span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="logout-btn" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}