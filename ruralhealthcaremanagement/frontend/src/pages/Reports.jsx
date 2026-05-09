import { useState } from 'react';
import { FileText, Download, PieChart as PieIcon, BarChart3, Map, Calendar, ArrowRight, Activity, X, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportItem = ({ icon: Icon, title, description, color, delay, onGenerate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    onClick={onGenerate}
    className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color.bg} ${color.text} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
      <button className="p-3 text-slate-300 group-hover:text-medical-600 group-hover:bg-medical-50 rounded-xl transition-all transform group-hover:translate-y-1">
        <Download size={22} strokeWidth={2.5} />
      </button>
    </div>
    <h3 className="text-xl font-extrabold text-slate-800 mb-3">{title}</h3>
    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 flex-1">{description}</p>
    <div className="flex items-center gap-2 text-medical-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
      Generate & Download <ArrowRight size={16} strokeWidth={3} />
    </div>
  </motion.div>
);

const Reports = () => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const generateCSV = (title) => {
    setIsGenerating(true);
    setSuccessMessage('');
    
    setTimeout(() => {
      // Fetch data
      const localPatients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Determine what to generate based on title
      if (title.includes('Demographics')) {
        csvContent += "Patient ID,Name,Age,Gender,Village\n";
        localPatients.forEach(p => {
          csvContent += `${p.id},${p.name},${p.age || 'N/A'},${p.gender || 'N/A'},${p.village || 'N/A'}\n`;
        });
      } else if (title.includes('Revenue')) {
        csvContent += "Date,Patient,Consultation Fee,Pharmacy Sales,Total Cost\n";
        localPatients.forEach(p => {
          csvContent += `${p.dateOfVisit},${p.name},${p.consultationCost || 0},${p.medicineCost || 0},${(parseFloat(p.consultationCost||0) + parseFloat(p.medicineCost||0))}\n`;
        });
      } else {
        // Generic dump for other reports
        csvContent += "ID,Name,Disease,Date,Status\n";
        localPatients.forEach(p => {
          csvContent += `${p.id},${p.name},${p.disease || 'N/A'},${p.dateOfVisit},Completed\n`;
        });
      }

      // Download trigger
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title.replace(/\s+/g, '_').toLowerCase()}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      setSuccessMessage(`${title} Downloaded Successfully!`);
      
      setTimeout(() => {
        setSuccessMessage('');
        setShowCustomModal(false);
      }, 3000);
    }, 1000); // simulate network delay for premium feel
  };

  return (
    <div className="space-y-10 pb-10 relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={24} /> {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Analytics & Reports</h2>
          <p className="text-slate-500 mt-2 font-medium">Export clinical and financial data for administration</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportItem 
          delay={0.1} icon={FileText} title="Patient Demographics" 
          description="Complete list of patients with age, gender, and village distribution data."
          color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
          onGenerate={() => generateCSV('Patient Demographics')}
        />
        <ReportItem 
          delay={0.2} icon={BarChart3} title="Revenue Analysis" 
          description="Detailed breakdown of consultation and pharmacy earnings over time."
          color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          onGenerate={() => generateCSV('Revenue Analysis')}
        />
        <ReportItem 
          delay={0.3} icon={Activity} title="Disease Trends" 
          description="Statistical report on the most common diseases and seasonal health patterns."
          color={{ bg: 'bg-rose-50', text: 'text-rose-600' }}
          onGenerate={() => generateCSV('Disease Trends')}
        />
        <ReportItem 
          delay={0.4} icon={Map} title="Village Outreach" 
          description="Analytics on healthcare penetration across different rural segments."
          color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
          onGenerate={() => generateCSV('Village Outreach')}
        />
        <ReportItem 
          delay={0.5} icon={Calendar} title="Doctor Performance" 
          description="Summary of visits handled by each doctor and patient satisfaction metrics."
          color={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
          onGenerate={() => generateCSV('Doctor Performance')}
        />
        <ReportItem 
          delay={0.6} icon={PieIcon} title="Treatment Statistics" 
          description="Data on treatment efficacy and recurring clinical patterns."
          color={{ bg: 'bg-cyan-50', text: 'text-cyan-600' }}
          onGenerate={() => generateCSV('Treatment Statistics')}
        />
      </div>

      {/* Premium Custom Export Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-medical-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-black mb-4 tracking-tight">Custom Data Export</h3>
          <p className="text-slate-300 mb-10 font-medium leading-relaxed">Need a specific data set? Use our advanced filter to generate a custom CSV or PDF report across any date range and metric.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowCustomModal(true)}
              className="px-8 py-4 bg-medical-500 hover:bg-medical-400 rounded-2xl font-black shadow-lg shadow-medical-500/30 transition-all transform hover:-translate-y-1"
            >
              Start Custom Export
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold transition-all border border-white/10 hover:border-white/20">
              View History
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute right-[-10%] top-[-30%] w-96 h-96 bg-medical-500/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
          <FileSpreadsheet size={300} strokeWidth={1} className="transform translate-x-1/4 translate-y-1/4" />
        </div>
      </motion.div>

      {/* Custom Export Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl relative"
            >
              <button onClick={() => setShowCustomModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <h3 className="text-2xl font-black text-slate-800 mb-2">Configure Report</h3>
              <p className="text-sm font-medium text-slate-500 mb-8">Select the parameters for your custom data export.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Data Type</label>
                  <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 outline-none font-bold text-slate-700">
                    <option>All Consolidated Data</option>
                    <option>Patient Records Only</option>
                    <option>Financials Only</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 outline-none font-medium text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 outline-none font-medium text-slate-700" />
                  </div>
                </div>

                <button 
                  onClick={() => generateCSV('Custom Filtered')}
                  disabled={isGenerating}
                  className="w-full mt-4 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isGenerating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Activity size={20} />
                    </motion.div>
                  ) : (
                    <><Download size={20} strokeWidth={2.5} /> Generate Custom CSV</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Reports;
