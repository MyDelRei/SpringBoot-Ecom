
import { FaBars, FaTimes } from 'react-icons/fa';

const MobileToggle = ({ onClick, isOpen }) => (
    <div className="block md:hidden">
        <button
            onClick={onClick}
            aria-label="Toggle menu"
            className="flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-gray-900 hover:border-gray-900 focus:outline-none"
        >
            {isOpen ? <FaTimes /> : <FaBars />}
        </button>
    </div>
);

export default MobileToggle;
