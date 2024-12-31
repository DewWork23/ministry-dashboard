import { Map, Calendar, Users, BarChart2, Settings, HelpCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const menuItems = [
    { icon: Map, label: 'Map', active: true },
    { icon: Calendar, label: 'Visits' },
    { icon: Users, label: 'Contacts' },
    { icon: BarChart2, label: 'Analytics' },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:w-20 
        transition-transform duration-300 ease-in-out
        z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <div className="flex-1 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`
                  w-full flex items-center px-3 py-2 text-gray-600
                  hover:bg-gray-50 transition-colors
                  ${item.active ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                <item.icon className="h-6 w-6" />
                <span className="ml-3 lg:hidden">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Menu Items */}
          <div className="p-4 border-t space-y-1">
            {bottomMenuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="h-6 w-6" />
                <span className="ml-3 lg:hidden">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default Sidebar;