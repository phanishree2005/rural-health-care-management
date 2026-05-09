import { useState, useEffect } from 'react';
import { CreditCard, Printer, Download, Search, CheckCircle2, TrendingUp, Filter } from 'lucide-react';
import { patientService } from '../services/api';
import { motion } from 'framer-motion';

const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        const localPatients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
        const formatted = localPatients.map(p => ({
          ...p,
          patientId: p.patientId || `PT-${String(p.id).slice(-4)}`,
          totalCost: parseFloat(p.medicineCost || 0) + parseFloat(p.consultationCost || 0)
        }));
        setPatients(formatted.reverse());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Billing & Invoices</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage financial transactions and export settlements</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Transactions Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="xl:col-span-2 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-white/40">
            <h3 className="text-lg font-extrabold text-slate-800">Recent Transactions</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={16} strokeWidth={2.5} />
                <input type="text" placeholder="Search bill ID..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-300 transition-all outline-none font-medium w-64" />
              </div>
              <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl text-slate-500 hover:text-medical-600 transition-colors">
                <Filter size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Date of Visit</th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 bg-white/20">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-400 font-medium">
                      No billing records found. Add a patient to see transactions here.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.id} className="hover:bg-white/60 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-800">{p.name}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{p.patientId}</div>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-500">{p.dateOfVisit}</td>
                      <td className="px-6 py-5 font-black text-slate-800">₹{p.totalCost}</td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full w-fit uppercase tracking-wide">
                          <CheckCircle2 size={14} strokeWidth={3} /> Paid
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="p-2.5 text-medical-600 hover:bg-medical-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 transform group-hover:scale-110 duration-200">
                          <Printer size={18} strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Side: Summary Cards */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
                <CreditCard size={28} />
              </div>
              <TrendingUp size={28} className="text-white/50" />
            </div>
            <p className="text-blue-100 text-xs mb-1 uppercase tracking-widest font-extrabold relative z-10">Total Collection</p>
            <h3 className="text-5xl font-black mb-10 relative z-10 tracking-tight">₹{patients.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString()}</h3>
            
            <div className="flex justify-between items-end relative z-10 p-4 bg-black/10 rounded-2xl backdrop-blur-sm">
              <div>
                <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-0.5">Account Holder</p>
                <p className="text-sm font-bold tracking-wide">RURALCARE HQ</p>
              </div>
              <p className="text-sm font-black opacity-80">12/26</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <h3 className="text-lg font-extrabold text-slate-800 mb-6">Quick Summary</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Consultation Fees</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">₹{patients.reduce((acc, curr) => acc + (parseFloat(curr.consultationCost) || 0), 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Pharmacy Sales</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">₹{patients.reduce((acc, curr) => acc + (parseFloat(curr.medicineCost) || 0), 0).toLocaleString()}</span>
              </div>
              <div className="h-[1px] bg-slate-200"></div>
              <div className="flex justify-between items-center text-base">
                <span className="font-black text-slate-800 uppercase tracking-wider text-sm">Total Net</span>
                <span className="text-2xl font-black text-medical-600">₹{patients.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 shadow-xl shadow-slate-300">
              <Download size={18} strokeWidth={2.5} /> Export Settlement
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
