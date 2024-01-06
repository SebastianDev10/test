import React, { useState } from 'react';
import axios from 'axios';
//import './Login.css';

function Login() {
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/token/', userData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
           
            window.location.href = '/home';
            // przekierowanie po zalogowaniu [to do]
        } catch (error) {
            console.error('Błąd logowania:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                {/* Zmień ścieżkę do loga na odpowiednią */}
                <img src="/logo/Fashionova-logos_white.png" alt="Fashionova" />
            </div>
            <div className="login-form">
                <h2>Login in to your account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                    <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                    <button type="submit">Login</button>
                    <p className="register-link">
                        Nie posiadasz jeszcze konta? 
                        <a href="/register"> Zarejestruj się</a> 
                </p>
                </form>
            </div>
        </div>
        
    );
}

export default Login;

