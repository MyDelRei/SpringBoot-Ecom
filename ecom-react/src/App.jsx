import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './pages/registerForm';
import LoginForm from "./pages/LoginForm.jsx";
import DemoPage from "./pages/DemoPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
                path="/demo"
                element={
                    <ProtectedRoute>
                        <DemoPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/homepage"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
        </Routes>


    );
};

const Home = () => (
    <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Welcome to My E-Commerce</h1>
        <a href="/register" className="text-blue-600 underline">
            Go to Register
        </a>
        <a href="/login" className="text-blue-600 underline">Go to Login</a>
    </div>
);

export default App;
