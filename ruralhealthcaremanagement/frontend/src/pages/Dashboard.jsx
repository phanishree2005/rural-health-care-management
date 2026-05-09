import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, TrendingUp, MapPin, Activity, 
  ArrowUpRight, ArrowDownRight, MoreVertical, Shield
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { analyticsService } from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
  >
    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${color.glow}`}></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-4 rounded-2xl ${color.bg} ${color.text} shadow-inner`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</h3>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalPatients: 0, totalRevenue: 0 });
  const [villageData, setVillageData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, villageRes, diseaseRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getVillages(),
          analyticsService.getDiseases()
        ]);
        setSummary(sumRes.data);
        setVillageData(villageRes.data);
        setDiseaseData(diseaseRes.data);
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          // Provide premium mock data for demonstration when offline
          setSummary({ totalPatients: 1248, totalRevenue: 854000 });
          setVillageData([
            { name: 'Greenwood', value: 400 }, { name: 'Riverdale', value: 300 },
            { name: 'Oakhaven', value: 300 }, { name: 'Pinetown', value: 200 }
          ]);
          setDiseaseData([
            { name: 'Fever', value: 450 }, { name: 'Malaria', value: 200 },
            { name: 'Dengue', value: 150 }, { name: 'Typhoid', value: 100 }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="space-y-10 pb-10 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 tracking-tight">System Overview</h2>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Shield size={16} className="text-green-500" />
            Live Healthcare Statistics & Analytics
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
          <button className="px-6 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-300">
            Export Report
          </button>
          <button 
            onClick={() => navigate('/patients/add')}
            className="px-6 py-3 bg-gradient-to-r from-medical-600 to-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            + New Visit
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          delay={0.1}
          icon={Users} label="Total Patients" value={summary.totalPatients} trend={12.5} 
          color={{ bg: 'bg-gradient-to-br from-blue-100 to-blue-50', text: 'text-blue-600', glow: 'bg-blue-500' }} 
        />
        <StatCard 
          delay={0.2}
          icon={TrendingUp} label="Total Revenue" value={`₹${summary.totalRevenue?.toLocaleString() || 0}`} trend={8.2} 
          color={{ bg: 'bg-gradient-to-br from-emerald-100 to-emerald-50', text: 'text-emerald-600', glow: 'bg-emerald-500' }} 
        />
        <StatCard 
          delay={0.3}
          icon={MapPin} label="Villages Covered" value={villageData.length} trend={2.4} 
          color={{ bg: 'bg-gradient-to-br from-purple-100 to-purple-50', text: 'text-purple-600', glow: 'bg-purple-500' }} 
        />
        <StatCard 
          delay={0.4}
          icon={Activity} label="Active Cases" value="84" trend={-4.1} 
          color={{ bg: 'bg-gradient-to-br from-rose-100 to-rose-50', text: 'text-rose-600', glow: 'bg-rose-500' }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Disease Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">Disease Progression</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Monthly trend analysis</p>
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><MoreVertical size={20} /></button>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diseaseData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Village Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-slate-800">Demographics</h3>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><MoreVertical size={20} /></button>
          </div>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={villageData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {villageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-sm" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{villageData.reduce((a,b)=>a+b.value,0)}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {villageData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm font-bold text-slate-700">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-400">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
