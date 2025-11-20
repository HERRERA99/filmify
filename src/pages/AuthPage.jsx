import "../styles/AuthPage.css"
import {useState} from "react";
import {IoEye, IoEyeOff} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../components/Auth/AuthContext.jsx";

export function AuthPage() {
    const { signIn, signUp } = useAuth(); // Funciones del contexto
    const [isLogin, setIsLogin] = useState(true);
    
    const navigate = useNavigate();

    // Estados del formulario
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // Para mensajes de éxito
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setMessage("");
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value // Usa el ID del input (name, surname, email, etc)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (isLogin) {
                // LOGICA DE LOGIN
                await signIn(formData.email, formData.password);
                navigate('/');
            } else {
                // LOGICA DE REGISTRO
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!formData.name || !formData.surname) {
                    throw new Error("Please fill in all fields");
                }

                await signUp(formData.email, formData.password, formData.name, formData.surname);

                setMessage("Registration successful! Please wait for an admin to approve your request.");
                setFormData({ name: "", surname: "", email: "", password: "", confirmPassword: "" });
                setIsLogin(true); // Volver al login
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? "Welcome back to Filmify" : "Join us to enjoy all content"}
                    </p>
                </div>

                {/* Mensajes de Feedback */}
                {error && <div style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
                {message && <div style={{color: 'green', marginBottom: '10px', textAlign: 'center'}}>{message}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>

                    {!isLogin && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">First Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="surname">Last Name</label>
                                <input
                                    type="text"
                                    id="surname" // Coincide con formData.surname
                                    placeholder="Your surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword" // Cambiado de confirm-password a confirmPassword para coincidir con state
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button className="auth-submit-btn" disabled={loading}>
                        {loading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "New to Filmify? " : "Already have an account? "}
                        <span onClick={toggleAuthMode} className="auth-toggle-link">
                            {isLogin ? "Sign up now" : "Sign in"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}