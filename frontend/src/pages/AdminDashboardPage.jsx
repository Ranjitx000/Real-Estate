import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API } from '../config/api';
import { Users, Building2, BarChart3, Trash2, Check, X as XIcon, ShieldAlert, Star, MessageSquare, Calendar, Download } from 'lucide-react';
import BulkImport from '../components/BulkImport';

const AdminDashboardPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [token, user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const res = await fetch(API.admin.analytics, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setData(json.data);
      } else if (activeTab === 'users') {
        const res = await fetch(API.admin.users, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setUsers(json.data);
      } else if (activeTab === 'listings') {
        const res = await fetch(API.admin.properties, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setProperties(json.data);
      } else if (activeTab === 'inquiries') {
        const res = await fetch(API.admin.inquiries, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setInquiries(json.data);
      } else if (activeTab === 'visits') {
        const res = await fetch(API.admin.visits, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setVisits(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- User Actions ---
  const deleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(API.admin.deleteUser(id), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if(res.ok) setUsers(users.filter(u => u._id !== id));
    } catch(err) {}
  };

  const updateUser = async (id, updateData) => {
    try {
      const res = await fetch(API.admin.updateUser(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if(res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, ...updateData } : u));
      }
    } catch(err) {}
  };

  // --- Property Actions ---
  const deleteProperty = async (id) => {
    if(!window.confirm('Delete this listing?')) return;
    try {
      const res = await fetch(API.admin.deleteProperty(id), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if(res.ok) setProperties(properties.filter(p => p._id !== id));
    } catch(err) {}
  };

  const updatePropertyGeneral = async (id, updateData) => {
    try {
      const res = await fetch(API.admin.updatePropertyGeneral(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if(res.ok) {
        setProperties(properties.map(p => p._id === id ? { ...p, ...updateData } : p));
      }
    } catch(err) {}
  };

  // --- Inquiry Actions ---
  const updateInquiryStatus = async (id, status) => {
    try {
      const res = await fetch(API.admin.updateInquiry(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if(res.ok) {
        setInquiries(inquiries.map(i => i._id === id ? { ...i, status } : i));
      }
    } catch(err) {}
  };

  // --- Visit Actions ---
  const updateVisitStatus = async (id, status) => {
    try {
      const res = await fetch(API.admin.updateVisit(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if(res.ok) {
        setVisits(visits.map(v => v._id === id ? { ...v, status } : v));
      }
    } catch(err) {}
  };

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4 min-h-[70vh]">
      <div className="relative overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[40px] backdrop-blur pb-10">
        <div className="p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="w-8 h-8 text-indigo-400 stroke-[1.5]" />
            <h1 className="text-3xl font-medium text-white tracking-tight font-geist">Admin Dashboard</h1>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
            <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'analytics' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><BarChart3 className="w-4 h-4 stroke-[1.5]"/> Analytics</button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'users' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><Users className="w-4 h-4 stroke-[1.5]"/> Manage Users</button>
            <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'listings' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><Building2 className="w-4 h-4 stroke-[1.5]"/> Properties</button>
            <button onClick={() => setActiveTab('inquiries')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'inquiries' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><MessageSquare className="w-4 h-4 stroke-[1.5]"/> Inquiries</button>
            <button onClick={() => setActiveTab('visits')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'visits' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><Calendar className="w-4 h-4 stroke-[1.5]"/> Visits</button>
            <button onClick={() => setActiveTab('import')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-geist ${activeTab === 'import' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-neutral-400 hover:bg-white/5 border border-transparent'}`}><Download className="w-4 h-4 stroke-[1.5]"/> Bulk Import</button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-neutral-400 font-geist">Loading admin data...</div>
          ) : (
            <div>
              {/* Import Tab */}
              {activeTab === 'import' && (
                  <div className="text-white">
                      <BulkImport token={token} onImportComplete={() => {
                          fetchData(); // refresh property counts
                          setActiveTab('listings');
                      }} />
                  </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-neutral-400 font-geist">Total Users</p>
                    <p className="text-3xl font-medium text-white mt-2 font-geist">{data.users.total}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-neutral-400 font-geist">Total Agents</p>
                    <p className="text-3xl font-medium text-indigo-300 mt-2 font-geist">{data.users.agents}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-neutral-400 font-geist">Total Properties</p>
                    <p className="text-3xl font-medium text-white mt-2 font-geist">{data.properties.total}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-neutral-400 font-geist">Pending Approvals</p>
                    <p className="text-3xl font-medium text-amber-300 mt-2 font-geist">{data.properties.pending}</p>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm text-neutral-300 font-geist">
                    <thead className="text-xs uppercase bg-black/40 text-neutral-400">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email / Phone</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-black/20">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                          <td className="px-6 py-4">{u.email || u.phone}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={u.role} 
                              onChange={(e) => updateUser(u._id, { role: e.target.value })}
                              className="bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white outline-none cursor-pointer"
                            >
                              <option value="user">Buyer / User</option>
                              <option value="owner">Seller / Owner</option>
                              <option value="agent">Agent</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => updateUser(u._id, { isBlocked: !u.isBlocked })}
                              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wide font-medium border ${u.isBlocked ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}
                            >
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 transition-colors"><Trash2 className="w-4 h-4 stroke-[1.5]"/> Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <div className="grid gap-4">
                  {properties.map(p => (
                    <div key={p._id} className={`flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border ${p.isFeatured ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-white/5'} justify-between items-center transition-colors`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium text-lg font-geist tracking-tight">{p.title}</h3>
                          {p.isFeatured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-xs text-neutral-400 font-geist mt-1">Seller/Agent: <span className="text-neutral-200">{p.agent?.name || 'Unknown'}</span> • Price: <span className="text-neutral-200">{p.price} {p.currency}</span></p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <select 
                            value={p.approvalStatus} 
                            onChange={(e) => updatePropertyGeneral(p._id, { approvalStatus: e.target.value })}
                            className={`text-xs uppercase font-geist tracking-wide px-2.5 py-1 rounded-full border outline-none cursor-pointer ${p.approvalStatus === 'approved' ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : p.approvalStatus === 'rejected' ? 'border-red-500/30 text-red-300 bg-red-500/10' : p.approvalStatus === 'sold' || p.approvalStatus === 'rented' ? 'border-sky-500/30 text-sky-300 bg-sky-500/10' : 'border-amber-500/30 text-amber-300 bg-amber-500/10'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                          </select>

                          <button 
                            onClick={() => updatePropertyGeneral(p._id, { isFeatured: !p.isFeatured })}
                            className={`text-xs px-2.5 py-1 rounded-full border ${p.isFeatured ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-white/20 text-neutral-300 hover:bg-white/10'}`}
                          >
                            {p.isFeatured ? 'Featured' : 'Mark Feature'}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => deleteProperty(p._id)} className="p-2.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Delete completely"><Trash2 className="w-4 h-4 stroke-[1.5]"/></button>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && <p className="text-neutral-400 text-center py-10 font-geist">No properties found.</p>}
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <div className="grid gap-4">
                  {inquiries.map(i => (
                    <div key={i._id} className="p-5 rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-medium font-geist">{i.property?.title || 'Unknown Property'}</h3>
                          <p className="text-xs text-neutral-400 font-geist mt-1">From: <span className="text-neutral-200">{i.customer?.name} ({i.customer?.phone})</span></p>
                        </div>
                        <select 
                          value={i.status} 
                          onChange={(e) => updateInquiryStatus(i._id, e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-sm text-neutral-300">
                        "{i.message}"
                      </div>
                      <div className="mt-3 text-xs text-neutral-500 flex items-center justify-between">
                        <span>Assigned to: <span className="text-neutral-300">{i.assignedAgent?.name || 'Unassigned'}</span></span>
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && <p className="text-neutral-400 text-center py-10 font-geist">No inquiries found.</p>}
                </div>
              )}

              {/* Visits Tab */}
              {activeTab === 'visits' && (
                <div className="grid gap-4">
                  {visits.map(v => (
                    <div key={v._id} className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                      <div>
                        <h3 className="text-white font-medium font-geist">{v.property?.title || 'Unknown Property'}</h3>
                        <p className="text-xs text-neutral-400 font-geist mt-1">Customer: <span className="text-neutral-200">{v.customer?.name}</span> • Agent: <span className="text-neutral-200">{v.agent?.name}</span></p>
                        <p className="text-sm text-indigo-300 mt-2 font-medium">
                          {new Date(v.visitDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <select 
                          value={v.status} 
                          onChange={(e) => updateVisitStatus(v._id, e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rescheduled">Rescheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {visits.length === 0 && <p className="text-neutral-400 text-center py-10 font-geist">No visits scheduled.</p>}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
