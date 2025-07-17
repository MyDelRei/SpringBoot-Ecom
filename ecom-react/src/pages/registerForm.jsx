import React, { useState } from 'react';
import Input from '../components/input.jsx';
import Button from '../components/button.jsx';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import axios from 'axios';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            setSuccess("Registered successfully!");
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });

            // Optionally redirect after delay
            // setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    const GoogleIcon = (props) => (
        <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            {...props}
        />
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md p-8">
                <div className="flex justify-center mb-8">
                    <img className="h-10" src={logo} alt="logo" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-black text-left mb-2">Let's you get started</h2>
                    <p className="text-gray-600 text-left">Enter your details to register and start discovering</p>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Input
                            placeholder="First name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full lg:basis-1/2"
                        />
                        <Input
                            placeholder="Last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full lg:basis-1/2"
                        />
                    </div>

                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        type="tel"
                        placeholder="Phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    {/* Password */}
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

                    {/* Confirm Password */}
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pr-10"
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-500" />
                            )}
                        </span>
                    </div>

                    <Button type="submit">Sign up</Button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-4 text-gray-500">Or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <Button variant="outline" icon={GoogleIcon}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
