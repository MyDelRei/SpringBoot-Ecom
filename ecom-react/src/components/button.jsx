// src/components/Button.js
import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary", icon: Icon, ...props }) => {
    // Define base and variant specific styles
    const baseStyles = "w-full flex items-center justify-center py-3 rounded-md transition duration-200";
    let variantStyles = "";

    switch (variant) {
        case "primary":
            variantStyles = "bg-black text-white hover:bg-gray-800";
            break;
        case "outline":
            variantStyles = "border border-gray-300 text-gray-700 hover:bg-gray-50";
            break;
        // Add more variants as needed (e.g., "secondary", "danger")
        default:
            variantStyles = "bg-black text-white hover:bg-gray-800";
    }

    return (
        <button
            type="button" // Default to type="button" to prevent form submission unless explicitly set
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props} // Spread any other standard button props
        >
            {Icon && <Icon className="w-5 h-5 mr-2" />} {/* Render icon if provided */}
            {children}
        </button>
    );
};

export default Button;
