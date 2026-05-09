import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, User, MapPin, Stethoscope, Phone, Calendar, Info, Loader2 } from 'lucide-react';
import { patientService } from '../services/api';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          <Icon size={18} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300`}
      />
    </div>
  </div>
);

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', disease: '', village: '',
    doctorAssigned: '', dateOfVisit: '',
    treatmentDetails: '', medicineCost: 0, consultationCost: 500, contactNumber: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientService.getById(id);
        setFormData(response.data);
      } catch (error) {
        alert('Error fetching patient data');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientService.update(id, {
        ...formData,
        age: parseInt(formData.age),
        medicineCost: parseFloat(formData.medicineCost),
        consultationCost: parseFloat(formData.consultationCost)
      });
      navigate('/patients');
    } catch (error) {
      alert('Error updating patient data');
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin text-medical-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors font-medium"
      >
        <ChevronLeft size={20} /> Back to Directory
      </button>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Edit Patient Record</h2>
          <p className="text-slate-500 mt-1">Updating record for <span className="text-medical-600 font-bold">{formData.patientId}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
            <h3 className="font-bold text-slate-700">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" icon={User} required value={formData.name} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" name="age" type="number" required value={formData.age} onChange={handleChange} />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <InputField label="Village" name="village" icon={MapPin} required value={formData.village} onChange={handleChange} />
            <InputField label="Contact Number" name="contactNumber" icon={Phone} value={formData.contactNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Stethoscope size={20} /></div>
            <h3 className="font-bold text-slate-700">Medical Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Disease / Symptoms" name="disease" icon={Activity} required value={formData.disease} onChange={handleChange} />
            <InputField label="Assigned Doctor" name="doctorAssigned" icon={Stethoscope} required value={formData.doctorAssigned} onChange={handleChange} />
            <InputField label="Date of Visit" name="dateOfVisit" type="date" icon={Calendar} required value={formData.dateOfVisit} onChange={handleChange} />
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Treatment Details</label>
              <textarea 
                name="treatmentDetails"
                value={formData.treatmentDetails}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 transition-all duration-300"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Info size={20} /></div>
            <h3 className="font-bold text-slate-700">Billing Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Medicine Cost (₹)" name="medicineCost" type="number" value={formData.medicineCost} onChange={handleChange} />
            <InputField label="Consultation Cost (₹)" name="consultationCost" type="number" value={formData.consultationCost} onChange={handleChange} />
            <div className="md:col-span-2 p-4 bg-medical-50 rounded-2xl flex justify-between items-center">
              <span className="font-bold text-medical-800">Total Calculation</span>
              <span className="text-xl font-black text-medical-700">₹{parseFloat(formData.medicineCost || 0) + parseFloat(formData.consultationCost || 0)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit"
            className="flex-1 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-bold shadow-lg shadow-medical-200 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Save size={20} /> Update Record
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;
