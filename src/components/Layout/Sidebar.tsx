import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Link as LinkIcon,
  Settings,
  BarChart3,
  Globe,
  Users,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { signOut } from '../../lib/auth';

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        isActive
          ? 'bg-gradient-to-r from-brand-600/10 to-brand-700/10 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className={`relative ${isActive ? 'animate-pulse-slow' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-500 group-hover:text-brand-500'}`
        })}
      </div>
      <span className={`font-medium ${isActive ? 'text-brand-600' : 'group-hover:text-brand-600'}`}>
        {label}
      </span>
      {isActive && (
        <ChevronRight className="w-4 h-4 text-brand-600 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="w-72 bg-white min-h-screen border-r border-gray-100 flex flex-col shadow-lg">
      <div className="flex items-center space-x-3 px-6 py-8">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-3 rounded-2xl shadow-glow animate-float">
          <Target className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 text-transparent bg-clip-text">
            LeadFlow Pro
          </span>
          <span className="text-xs text-gray-500 block">
            Analytics & Tracking
          </span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 py-4">
        <div className="mb-8">
          <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Principal
          </span>
          <div className="mt-4 space-y-1">
            <NavItem
              to="/dashboard"
              icon={<LayoutDashboard />}
              label="Dashboard"
            />
            <NavItem
              to="/analytics"
              icon={<BarChart3 />}
              label="Analytics"
            />
          </div>
        </div>

        <div className="mb-8">
          <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gerenciamento
          </span>
          <div className="mt-4 space-y-1">
            <NavItem
              to="/websites"
              icon={<Globe />}
              label="Websites"
            />
            <NavItem
              to="/leads"
              icon={<Users />}
              label="Leads"
            />
            <NavItem
              to="/conversions"
              icon={<Target />}
              label="Conversões"
            />
            <NavItem
              to="/tracking-links"
              icon={<LinkIcon />}
              label="Links"
            />
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1 bg-gray-50/50">
        <NavItem
          to="/settings"
          icon={<Settings />}
          label="Configurações"
        />
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 w-full group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};