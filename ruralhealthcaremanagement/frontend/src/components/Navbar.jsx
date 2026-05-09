import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Command, CheckCircle2, AlertCircle, Clock, User, Shield, Moon, Sun, BellRing, LogOut, X, Save, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  
  // New modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const notifRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveAction = (e, modalType) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (modalType === 'profile') setShowProfileModal(false);
      if (modalType === 'privacy') setShowPrivacyModal(false);
    }, 1500);
  };

  const notifications = [
    { id: 1, type: 'success', title: 'New Patient Registered', time: '5m ago', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 2, type: 'alert', title: 'Medicine Stock Low', time: '1h ago', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 3, type: 'info', title: 'System Update Completed', time: '2h ago', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <header className="h-[88px] bg-white/60 backdrop-blur-xl border-b border-white shadow-[0_4px_30px_rgb(0,0,0,0.02)] flex items-center justify-between px-10 sticky top-0 z-50">
      
      {/* Search Bar */}
      <div className="relative w-[400px] group">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-medical-500 transition-colors">
          <Search size={18} strokeWidth={2.5} />
        </span>
        <input 
          type="text" 
          placeholder="Search patients, villages, or reports..." 
          className="w-full pl-12 pr-12 py-3.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-medical-100 focus:border-medical-300 transition-all duration-300 outline-none"
        />
        <span className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">
            <span className="flex items-center gap-1"><Command size={10}/> K</span>
          </kbd>
        </span>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
            className={`relative p-2.5 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 ${showNotifications ? 'bg-medical-50 border-medical-200 text-medical-600 shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:text-medical-600 hover:shadow-md'}`}
          >
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-80 bg-white/90 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.1)] overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-800">Notifications</h3>
                  <span className="bg-medical-100 text-medical-700 text-xs font-bold px-2 py-1 rounded-lg">3 New</span>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
                      <div className={`p-2.5 rounded-xl ${notif.bg} ${notif.color} group-hover:scale-110 transition-transform`}>
                        <notif.icon size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{notif.title}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                  <button className="w-full py-2 text-sm font-bold text-medical-600 hover:text-medical-700 transition-colors">Mark all as read</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
            className={`p-2.5 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 ${showSettings ? 'bg-medical-50 border-medical-200 text-medical-600 shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:text-medical-600 hover:shadow-md'}`}
          >
            <Settings size={20} strokeWidth={2.5} className={showSettings ? "animate-spin-slow" : ""} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.1)] overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-extrabold text-slate-800">Quick Settings</h3>
                </div>
                <div className="p-3 space-y-1">
                  <button onClick={() => { setShowProfileModal(true); setShowSettings(false); }} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <User size={16} /> Edit Profile
                  </button>
                  <button onClick={() => { setShowPrivacyModal(true); setShowSettings(false); }} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <Shield size={16} /> Privacy & Security
                  </button>
                  <button onClick={toggleDarkMode} className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <span className="flex items-center gap-3">
                      {isDarkMode ? <Moon size={16} className="text-indigo-500" /> : <Sun size={16} className="text-orange-500" />} Dark Mode
                    </span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </button>
                  <button onClick={() => setSoundAlerts(!soundAlerts)} className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <span className="flex items-center gap-3"><BellRing size={16} /> Sound Alerts</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${soundAlerts ? 'bg-medical-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${soundAlerts ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </button>
                </div>
                <div className="p-3 border-t border-slate-100">
                  <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-10 w-[2px] bg-slate-200/60 mx-2 rounded-full"></div>
        
        {/* User Profile */}
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right transition-transform group-hover:-translate-x-1 duration-300">
            <p className="text-sm font-extrabold text-slate-800 leading-tight">{user?.name || 'Loading...'}</p>
            <p className="text-[11px] font-bold text-medical-500 uppercase tracking-wider mt-0.5">{user?.roles?.[0]?.replace('ROLE_', '') || user?.role || 'USER'}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300 transform rotate-3 group-hover:rotate-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Edit Profile</h3>
                  <p className="text-sm font-medium text-slate-500">Update your account information.</p>
                </div>
              </div>
              
              <form onSubmit={(e) => handleSaveAction(e, 'profile')} className="space-y-5">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-medical-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                    Change Avatar
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Display Name</label>
                  <input required defaultValue={user?.name || "Mock Admin"} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Email Address</label>
                  <input required defaultValue="admin@ruralcare.org" type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" />
                </div>
                
                <button disabled={isSaving} type="submit" className="w-full mt-4 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
                  {isSaving ? "Saving..." : <><Save size={18} strokeWidth={2.5} /> Save Changes</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy & Security Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowPrivacyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Privacy & Security</h3>
                  <p className="text-sm font-medium text-slate-500">Manage your system security settings.</p>
                </div>
              </div>
              
              <form onSubmit={(e) => handleSaveAction(e, 'privacy')} className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Lock size={14} className="text-emerald-500" /> Two-Factor Auth</h4>
                    <p className="text-xs text-slate-500 mt-1">Require a code when logging in.</p>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full transition-all"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">Data Sharing</h4>
                    <p className="text-xs text-slate-500 mt-1">Allow anonymous analytics.</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Change Password</label>
                  <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none" />
                </div>
                
                <button disabled={isSaving} type="submit" className="w-full mt-4 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
                  {isSaving ? "Updating Security..." : <><Save size={18} strokeWidth={2.5} /> Update Security</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;
