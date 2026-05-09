import { Map, MapPin, Users, TrendingUp, Info } from 'lucide-react';

const VillageCard = ({ name, population, patients, healthScore }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-medical-50 text-medical-600 rounded-xl">
        <MapPin size={24} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Index</p>
        <p className={`text-xl font-black ${healthScore > 80 ? 'text-green-500' : 'text-orange-500'}`}>{healthScore}%</p>
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-6">{name}</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <Users size={14} /> <span className="text-[10px] font-bold uppercase">Population</span>
        </div>
        <p className="text-lg font-bold text-slate-700">{population}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <TrendingUp size={14} /> <span className="text-[10px] font-bold uppercase">Total Patients</span>
        </div>
        <p className="text-lg font-bold text-slate-700">{patients}</p>
      </div>
    </div>
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-500">Facility Coverage</span>
        <span className="text-xs font-bold text-medical-600">85%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-medical-500 rounded-full" style={{ width: '85%' }}></div>
      </div>
    </div>
  </div>
);

const VillageAnalytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Village Analytics</h2>
        <p className="text-slate-500 mt-1">Geographic health distribution and demographic insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <VillageCard name="Rampur" population="2,450" patients="120" healthScore={88} />
        <VillageCard name="Sonpur" population="1,800" patients="85" healthScore={76} />
        <VillageCard name="Greenwood" population="3,200" patients="210" healthScore={82} />
      </div>

      <div className="bg-blue-600 p-8 rounded-3xl text-white flex items-center gap-8 relative overflow-hidden">
        <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md">
          <Info size={40} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Did you know?</h3>
          <p className="text-blue-100 text-sm max-w-2xl">Rampur village has seen a 15% decrease in recurring fever cases since the last medical camp. Smart interventions are working!</p>
        </div>
        <Map className="absolute right-[-2%] bottom-[-20%] text-white/10" size={250} />
      </div>
    </div>
  );
};

export default VillageAnalytics;
