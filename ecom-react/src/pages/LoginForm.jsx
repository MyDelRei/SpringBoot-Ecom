import React, { useState } from 'react';
import Input from '../components/input.jsx';
import Button from '../components/button.jsx';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Store token or navigate to dashboard
            console.log("Login success:", res.data);
            localStorage.setItem('token', res.data.token); // optional
            navigate('/demo'); // go to home or dashboard

        } catch (err) {
            if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError('Login failed. Try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md p-8">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img className="h-10" src={logo} alt="logo" />
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-black text-left mb-2">Welcome back!</h2>
                    <p className="text-gray-600 text-left">Log in with your email and password</p>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="pr-10"
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-500" />
                            )}
                        </span>
                    </div>

                    <Button type="submit">Login</Button>
                </form>
            </div>
        </div>
    );
}
