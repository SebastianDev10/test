import React, { useState } from 'react';
import axios from 'axios';
//import './Login.css';

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/register/', userData);
            // Przekieruj na stronę logowania po rejestracji
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                {/* Zmień ścieżkę do loga na odpowiednią */}
                <img src="/logo/Fashionova-logos_white.png" alt="Fashionova" />
            </div>
            <div className="login-form">
                <h2>Register for an account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                    <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                    <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                    <button type="submit">Register</button>
                    <p className="login-link">
                        Masz już konto? 
                        <a href="/login"> Zaloguj się tutaj</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
