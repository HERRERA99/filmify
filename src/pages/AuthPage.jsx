import "../styles/AuthPage.css"
import {useState} from "react";
import {IoEye, IoEyeOff} from "react-icons/io5";



export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Estados para controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
            <div className="auth-background"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
                    <p className="auth-subtitle">
                        {isLogin
                            ? "Welcome back to Filmify"
                            : "Join us to enjoy all content"}
                    </p>
                </div>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

                    {!isLogin && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">First Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="surname">Last Name</label>
                                <input
                                    type="text"
                                    id="surname"
                                    placeholder="Your surname"
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button className="auth-submit-btn">
                        {isLogin ? "Sign In" : "Sign Up"}
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