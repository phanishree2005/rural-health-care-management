import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, Download, MoreHorizontal } from 'lucide-react';
import { patientService } from '../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      } else {
        console.error('Error fetching patients', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query.length > 0) {
      try {
        const res = await patientService.search(query);
        setPatients(res.data);
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          const localPatients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
          const filtered = localPatients.filter(p => 
            p.name.toLowerCase().includes(query) || p.village.toLowerCase().includes(query)
          ).map(p => ({
            ...p,
            patientId: p.patientId || `PT-${String(p.id).slice(-4)}`,
            totalCost: parseFloat(p.medicineCost || 0) + parseFloat(p.consultationCost || 0)
          }));
          setPatients(filtered.reverse());
        }
      }
    } else {
      fetchPatients();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await patientService.delete(id);
        fetchPatients();
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          const localPatients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
          const filtered = localPatients.filter(p => p.id !== id);
          localStorage.setItem('mock_patients', JSON.stringify(filtered));
          fetchPatients();
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Patient Directory</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download size={18} /> Export
          </button>
          <Link to="/patients/add" className="flex items-center gap-2 px-4 py-2 bg-medical-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-medical-100 hover:bg-medical-700">
            + Add New Patient
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search by name, village..." 
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Filter size={20} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name & Gender</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Disease</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Village</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-400">Loading patients...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-400">No patient records found.</td></tr>
              ) : patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-medical-50 text-medical-700 px-2 py-1 rounded-md text-xs font-bold">
                      {patient.patientId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{patient.name}</div>
                    <div className="text-xs text-slate-400">{patient.age}Y • {patient.gender}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{patient.disease}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{patient.village}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">Dr. {patient.doctorAssigned}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-medical-600">₹{patient.totalCost}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link to={`/patients/edit/${patient.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Showing {patients.length} records</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={20} /></button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
