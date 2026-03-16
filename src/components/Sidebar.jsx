
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Target, Heart, LogOut, Activity, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Activity, label: 'AI Coach', path: '/ai-coach' },
    { icon: Target, label: 'Goals', path: '/tracker' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen px-4 py-8 bg-white border-r fixed left-0 top-0">
      <div className="flex items-center px-4 mb-10">
        <Activity className="w-8 h-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-800">Vyntra</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="ml-4 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pt-6 border-t border-gray-100">
        <div className="flex items-center p-2 mb-4">
          <div className="p-2 bg-gray-100 rounded-full">
            <User size={20} className="text-gray-600" />
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-500 truncate">Beta Access</p>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 mt-2"
        >
          <LogOut size={20} />
          <span className="ml-4 font-medium">Clear Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
