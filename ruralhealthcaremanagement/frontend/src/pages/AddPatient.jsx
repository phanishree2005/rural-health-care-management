import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, User, MapPin, Stethoscope, Phone, Calendar, Info, Activity } from 'lucide-react';
import { patientService } from '../services/api';
import { motion } from 'framer-motion';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 relative group">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-medical-500 transition-colors">
          <Icon size={18} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300`}
      />
    </div>
  </div>
);

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', disease: '', village: '',
    doctorAssigned: '', dateOfVisit: new Date().toISOString().split('T')[0],
    treatmentDetails: '', medicineCost: 0, consultationCost: 500, contactNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      age: parseInt(formData.age) || 0,
      medicineCost: parseFloat(formData.medicineCost) || 0,
      consultationCost: parseFloat(formData.consultationCost) || 0
    };

    try {
      await patientService.create(payload);
      navigate('/patients');
    } catch (error) {
      // Mock saving logic if backend is not running
      if (error.code === 'ERR_NETWORK') {
        const storedPatients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
        storedPatients.push({ ...payload, id: Date.now() });
        localStorage.setItem('mock_patients', JSON.stringify(storedPatients));
        navigate('/patients');
      } else {
        alert('Error saving patient data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-medical-200/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors font-semibold bg-white/50 px-4 py-2 rounded-full backdrop-blur-md border border-white"
      >
        <ChevronLeft size={18} /> Back to Directory
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Register Patient</h2>
          <p className="text-slate-500 mt-2 font-medium">Add a new patient record to the secure system</p>
        </div>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="space-y-8 pb-10"
      >
        {/* Personal Information */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-inner"><User size={24} /></div>
            <h3 className="text-xl font-extrabold text-slate-800">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" icon={User} required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" name="age" type="number" required value={formData.age} onChange={handleChange} placeholder="e.g. 34" />
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <InputField label="Village" name="village" icon={MapPin} required value={formData.village} onChange={handleChange} placeholder="e.g. Greenwood" />
            <InputField label="Contact Number" name="contactNumber" icon={Phone} value={formData.contactNumber} onChange={handleChange} placeholder="+91 98765 43210" />
          </div>
        </div>

        {/* Medical Details */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 rounded-2xl shadow-inner"><Stethoscope size={24} /></div>
            <h3 className="text-xl font-extrabold text-slate-800">Medical Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Disease / Symptoms" name="disease" icon={Activity} required value={formData.disease} onChange={handleChange} placeholder="Fever, Cough" />
            <InputField label="Assigned Doctor" name="doctorAssigned" icon={Stethoscope} required value={formData.doctorAssigned} onChange={handleChange} placeholder="Dr. Smith" />
            <InputField label="Date of Visit" name="dateOfVisit" type="date" icon={Calendar} required value={formData.dateOfVisit} onChange={handleChange} />
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Treatment Details</label>
              <textarea 
                name="treatmentDetails"
                value={formData.treatmentDetails}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-4 bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-3xl text-sm focus:bg-white focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300 resize-none"
                placeholder="Details of treatment provided..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-2xl shadow-inner"><Info size={24} /></div>
            <h3 className="text-xl font-extrabold text-slate-800">Billing Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Medicine Cost (₹)" name="medicineCost" type="number" value={formData.medicineCost} onChange={handleChange} />
            <InputField label="Consultation Cost (₹)" name="consultationCost" type="number" value={formData.consultationCost} onChange={handleChange} />
            <div className="md:col-span-2 p-6 bg-gradient-to-r from-medical-50 to-blue-50 rounded-3xl flex justify-between items-center border border-medical-100/50 mt-2">
              <span className="font-extrabold text-medical-800 tracking-wide uppercase text-sm">Total Calculation</span>
              <span className="text-3xl font-black text-medical-600 drop-shadow-sm">₹{parseFloat(formData.medicineCost || 0) + parseFloat(formData.consultationCost || 0)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-gradient-to-r from-medical-600 to-blue-600 hover:from-medical-700 hover:to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
          >
            <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Patient Record'}
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddPatient;
