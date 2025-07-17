
import React from 'react';

const Input = ({ type = "text", placeholder, value, onChange, className = "", icon: Icon, ...props }) => {
    return (
        <div className="relative w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                // Base styles for Material UI inspired look, with hover/focus transitions
                className={`w-full px-4 py-3 border border-gray-300 rounded-md 
                    hover:border-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500 transition duration-200
                    ${Icon ? 'pr-10' : ''} ${className}`} // Add padding for icon if present
                {...props} // Spread any other standard input props
            />
            {Icon && (
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-gray-500" />
        </span>
            )}
        </div>
    );
};

export default Input;
