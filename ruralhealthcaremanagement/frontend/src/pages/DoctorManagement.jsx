import { useState, useEffect } from 'react';
import { Stethoscope, Star, Clock, MapPin, Plus, X, Mail, Phone, Calendar, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorCard = ({ name, specialty, village, rating, status, onViewProfile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
  >
    <div className="flex items-center gap-5 mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
        <Stethoscope size={32} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-slate-800 leading-tight">{name}</h3>
        <p className="text-sm font-bold text-medical-500 mt-1 uppercase tracking-wider">{specialty}</p>
      </div>
    </div>
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <MapPin size={18} className="text-slate-400" /> {village}
      </div>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <Clock size={18} className="text-slate-400" /> 9:00 AM - 5:00 PM
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-orange-500 bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100">
        <Star size={16} fill="currentColor" /> {rating} <span className="text-orange-400 ml-1">(45 Reviews)</span>
      </div>
    </div>
    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
        {status}
      </span>
      <button onClick={onViewProfile} className="text-sm font-extrabold text-medical-600 hover:text-medical-700 transition-colors">View Profile</button>
    </div>
  </motion.div>
);

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalView, setModalView] = useState('profile'); // 'profile', 'message', 'schedule', 'success'
  const [formData, setFormData] = useState({ name: '', specialty: '', village: '', status: 'Active' });

  useEffect(() => {
    const localDoctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
    if (localDoctors.length === 0) {
      const defaultDocs = [
        { id: 1, name: "Dr. Rajesh Kumar", specialty: "General Physician", village: "Rampur", rating: "4.8", status: "Active" },
        { id: 2, name: "Dr. Sarah Jones", specialty: "Pediatrician", village: "Sonpur", rating: "4.9", status: "Active" },
        { id: 3, name: "Dr. Amit Patel", specialty: "Cardiologist", village: "Greenwood", rating: "4.7", status: "On Leave" }
      ];
      localStorage.setItem('mock_doctors', JSON.stringify(defaultDocs));
      setDoctors(defaultDocs);
    } else {
      setDoctors(localDoctors);
    }
  }, []);

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const newDoctor = {
      id: Date.now(),
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      specialty: formData.specialty,
      village: formData.village,
      rating: "5.0",
      status: formData.status
    };
    const updated = [...doctors, newDoctor];
    localStorage.setItem('mock_doctors', JSON.stringify(updated));
    setDoctors(updated);
    setShowAddModal(false);
    setFormData({ name: '', specialty: '', village: '', status: 'Active' });
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    setModalView('success');
    setTimeout(() => {
      setSelectedDoctor(null);
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Doctor Roster</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage medical staff and village assignments</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-medical-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={2.5} /> Add Doctor
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {doctors.map((doc) => (
            <DoctorCard 
              key={doc.id} {...doc} 
              onViewProfile={() => { setSelectedDoctor(doc); setModalView('profile'); }} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Multi-Purpose Modal (Profile, Message, Schedule) */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-medical-500 to-blue-600 -z-0"></div>
              
              <button onClick={() => setSelectedDoctor(null)} className="absolute top-6 right-6 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10">
                <X size={20} strokeWidth={2.5} />
              </button>

              {modalView !== 'profile' && modalView !== 'success' && (
                <button onClick={() => setModalView('profile')} className="absolute top-6 left-6 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10">
                  <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
              )}
              
              <div className="relative z-10 flex flex-col items-center mt-6">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-medical-600 shadow-xl border-4 border-white mb-4">
                  {modalView === 'success' ? <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2} /> : <Stethoscope size={40} strokeWidth={2} />}
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                  {modalView === 'success' ? 'Success!' : selectedDoctor.name}
                </h3>
                <p className="text-sm font-bold text-medical-500 uppercase tracking-wider mt-1">
                  {modalView === 'success' ? 'Action Completed' : selectedDoctor.specialty}
                </p>
                
                {modalView === 'profile' && (
                  <span className={`mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${selectedDoctor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {selectedDoctor.status}
                  </span>
                )}
              </div>

              {modalView === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><MapPin size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Village</p>
                      <p className="text-sm font-bold text-slate-800">{selectedDoctor.village} Healthcare Center</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Clock size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Working Hours</p>
                      <p className="text-sm font-bold text-slate-800">Mon - Sat • 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setModalView('message')} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                      <Mail size={18} strokeWidth={2.5} /> Message
                    </button>
                    <button onClick={() => setModalView('schedule')} className="flex-1 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                      <Calendar size={18} strokeWidth={2.5} /> Schedule
                    </button>
                  </div>
                </motion.div>
              )}

              {modalView === 'message' && (
                <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleActionSubmit} className="mt-8 space-y-5">
                  <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-sm font-medium border border-blue-100">
                    Send a direct secure message to {selectedDoctor.name}. They will be notified immediately.
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Subject</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" placeholder="e.g. Urgent Consultation Needed" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Message</label>
                    <textarea required rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none resize-none" placeholder="Type your message here..."></textarea>
                  </div>
                  <button type="submit" className="w-full mt-2 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                    <Send size={18} strokeWidth={2.5} /> Send Message
                  </button>
                </motion.form>
              )}

              {modalView === 'schedule' && (
                <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleActionSubmit} className="mt-8 space-y-5">
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-medium border border-emerald-100">
                    Book an appointment for a patient visit with {selectedDoctor.name}.
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Date</label>
                      <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Time</label>
                      <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none">
                        <option>09:00 AM</option>
                        <option>11:00 AM</option>
                        <option>02:00 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Select Patient</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" placeholder="Search patient ID or name..." />
                  </div>
                  <button type="submit" className="w-full mt-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                    <Calendar size={18} strokeWidth={2.5} /> Confirm Booking
                  </button>
                </motion.form>
              )}

              {modalView === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center pb-4">
                  <p className="text-slate-500 font-medium text-lg">Your request has been successfully processed.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
              
              <h3 className="text-2xl font-black text-slate-800 mb-6">Register New Doctor</h3>
              
              <form onSubmit={handleAddDoctor} className="space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Specialty</label>
                  <input required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" placeholder="e.g. Neurologist" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2">Assigned Village</label>
                  <input required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all outline-none" placeholder="e.g. Greenwood" />
                </div>
                
                <button type="submit" className="w-full mt-4 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all transform hover:-translate-y-1">
                  Save Doctor Profile
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorManagement;
