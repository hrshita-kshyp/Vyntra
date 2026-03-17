
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Target, LogOut, Activity, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { signOut, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Activity, label: 'AI Coach', path: '/ai-coach' },
        { icon: Target, label: 'Goals', path: '/tracker' },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    const MenuContent = () => (
        <>
            <div className="flex items-center px-4 mb-10">
                <Activity className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800 tracking-tight">Vyntra</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-blue-600'} transition-colors`} />
                            <span className="ml-4 font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center p-3 mb-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <User size={20} />
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email?.split('@')[0]}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Premium Core</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsOpen(false);
                        signOut();
                    }}
                    className="flex items-center w-full px-4 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="ml-4 font-bold">Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-40 flex items-center justify-between px-6">
                <div className="flex items-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <span className="ml-2 font-bold text-gray-900 tracking-tight">Vyntra</span>
                </div>
                <button 
                    onClick={toggleSidebar}
                    className="p-2 bg-gray-50 rounded-xl text-gray-600 hover:text-blue-600 transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen px-6 py-8 bg-white border-r border-gray-100 fixed left-0 top-0 z-50">
                <MenuContent />
            </aside>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[60] md:hidden transform transition-transform duration-300 ease-in-out flex flex-col px-6 py-8 shadow-2xl ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <MenuContent />
            </aside>
            
        </>
    );
};

export default Sidebar;
