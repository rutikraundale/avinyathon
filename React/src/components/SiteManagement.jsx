import { useState, useEffect } from 'react';
import { Building2, Plus, Compass } from 'lucide-react';
import { getSites } from '../../appwrite/services/site.service';

export default function SiteManagement() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await getSites();
        setSites(response.documents);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-orange-800 text-[10px] font-bold uppercase tracking-widest mb-1">Infrastructure Hub</p>
          <h2 className="text-4xl font-extrabold text-gray-800">Site Management</h2>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-50 flex justify-between items-center relative overflow-hidden">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Active Projects</p>
            <h3 className="text-3xl font-black text-gray-800 mb-4">{sites.length}</h3>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">{sites.filter(s => s.status === 'ACTIVE').length} Active</span>
            </div>
          </div>
          <Compass size={120} className="text-gray-50 absolute -right-4 -bottom-4 rotate-12" />
        </div>

        <div className="bg-[#005B8E] p-8 rounded-2xl text-white">
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">Portfolio Completion</p>
          <h3 className="text-5xl font-black mb-6">Average Progress</h3>
          <div className="w-full h-2 bg-blue-900/50 rounded-full mb-3">
            <div className="w-[84%] h-full bg-white rounded-full"></div>
          </div>
          <p className="text-blue-100 text-xs font-medium">calculated globally</p>
        </div>
      </div>

      {/* Site List Table */}
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-6 py-5">Site Name</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Manager</th>
              <th className="px-6 py-5">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-6 text-center text-gray-500">Loading sites...</td></tr>
            ) : sites.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-6 text-center text-gray-500">No sites found. Create one from the sidebar!</td></tr>
            ) : (
              sites.map((site) => (
                <tr key={site.$id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl text-orange-800"><Building2 size={20} /></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{site.siteName || site.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Project {site.siteId || site.$id.substring(0, 8)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-500 font-medium">{site.location || site.loc || 'Not specified'}</td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${
                      (site.status || 'ACTIVE') === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {site.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-6 flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-700">{site.manager || 'Unassigned'}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-800" style={{ width: `${site.progress || 0}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-800">{site.progress || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
