// src/pages/DemoPage.jsx
import React from 'react';

const DemoPage = () => {
    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold">🔐 Protected Demo Page</h1>
            <p className="mt-4 text-gray-600">You can only see this because you're logged in!</p>
        </div>
    );
};

export default DemoPage;
