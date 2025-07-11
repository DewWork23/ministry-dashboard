import { Menu, LogOut, Home } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Adjust the path to your logo image

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('dashboardAuth');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* Increased height */}
          {/* Left side - Menu */}
          <div className="flex items-center gap-4">
            <button 
              className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Center - Logo and Title */}
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Changing Destinies Ministry" 
              className="h-12 w-12" // Increased size
            />
            <span className="font-semibold text-gray-900 text-xl"> {/* Increased font size */}
              Changing Destinies Ministry
            </span>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-1 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Public View</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func
};

export default Header;