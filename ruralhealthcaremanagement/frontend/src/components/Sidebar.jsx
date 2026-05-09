import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserPlus, FileText, 
  CreditCard, Activity, LogOut, Stethoscope, Map, HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
      active 
        ? 'text-white shadow-xl shadow-medical-500/30' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-medical-600 to-blue-600 rounded-2xl -z-10"></div>
    )}
    <Icon size={22} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-medical-500'}`} />
    <span className={`font-bold tracking-wide text-sm ${active ? '' : 'group-hover:translate-x-1 transition-transform duration-300'}`}>{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Users, label: 'Patient Directory', to: '/patients' },
    { icon: UserPlus, label: 'Register Patient', to: '/patients/add' },
    { icon: CreditCard, label: 'Billing & Invoice', to: '/billing' },
    { icon: FileText, label: 'Analytics Reports', to: '/reports' },
    { icon: Stethoscope, label: 'Doctor Roster', to: '/doctors' },
    { icon: Map, label: 'Village Mapping', to: '/villages' },
  ];

  return (
    <div className="w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.01)] relative z-30">
      <div className="flex items-center gap-4 mb-12 mt-2 px-2 cursor-pointer group">
        <div className="relative">
          <div className="absolute inset-0 bg-medical-400 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-medical-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl relative z-10 transform group-hover:scale-105 transition-transform duration-300">
            <HeartPulse size={28} strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">RuralCare</h1>
          <p className="text-[10px] font-bold text-medical-500 uppercase tracking-widest mt-0.5">Healthcare OS</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4">Main Menu</div>
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))} 
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl mb-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-medical-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Authenticated Session</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center font-black text-slate-500 text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-medical-600 mt-0.5 uppercase tracking-wider">{user?.roles?.[0]?.replace('ROLE_', '') || user?.role || 'USER'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
        >
          <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
            <LogOut size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform duration-300">Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
