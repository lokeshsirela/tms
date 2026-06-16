import React, { useState } from 'react';
import { Settings2, Users, FileCheck, ShieldAlert, PlusCircle, CheckCircle2, XCircle, Send, ScrollText, Bus, User, Edit } from 'lucide-react';
import { BusRoute, Announcement, Complaint, BusPass } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface AdminConsoleProps {
  routes: BusRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<BusRoute[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  activePasses: BusPass[];
  setActivePasses: React.Dispatch<React.SetStateAction<BusPass[]>>;
}

export default function AdminConsole({
  routes,
  setRoutes,
  announcements,
  setAnnouncements,
  complaints,
  setComplaints,
  activePasses,
  setActivePasses
}: AdminConsoleProps) {
  // Tabs: 1 = Pass Registrations, 2 = Routes Management, 3 = Publish Alert, 4 = Manage Inquiries
  const [activeTab, setActiveTab] = useState<'passes' | 'routes' | 'publish' | 'complaints'>('passes');

  // Publish Announcement Form States
  const [alertForm, setAlertForm] = useState({
    title: '',
    content: '',
    category: 'General' as const,
    routeAffected: 'All',
    important: false
  });
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Edit Route States
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState({
    driverName: '',
    driverPhone: '',
    busNumber: '',
    capacity: 60
  });

  // Complaint Response states
  const [replyingComplaintId, setReplyingComplaintId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Handle Pass approval/rejection
  const handlePassStatus = (passId: string, status: 'Approved' | 'Rejected') => {
    const updated = activePasses.map(pass => {
      if (pass.id === passId) {
        return { ...pass, applicationStatus: status };
      }
      return pass;
    });
    setActivePasses(updated);
    localStorage.setItem('anits_bus_passes', JSON.stringify(updated));
  };

  // Handle publishing circular announcements
  const handlePublishAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.content) {
      alert('Announcement title and circular content are mandatory.');
      return;
    }

    const newAnn: Announcement = {
      id: 'ann-' + Math.floor(100 + Math.random() * 900),
      title: alertForm.title,
      content: alertForm.content,
      date: new Date().toISOString().split('T')[0],
      category: alertForm.category,
      routeAffected: alertForm.routeAffected === 'All' ? undefined : alertForm.routeAffected,
      important: alertForm.important
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('anits_announcements', JSON.stringify(updated));

    setAlertForm({
      title: '',
      content: '',
      category: 'General',
      routeAffected: 'All',
      important: false
    });

    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2000);
  };

  // Start Editing Route Details
  const handleStartEditRoute = (route: BusRoute) => {
    setEditingRouteId(route.id);
    setRouteForm({
      driverName: route.driverName,
      driverPhone: route.driverPhone,
      busNumber: route.busNumber,
      capacity: route.capacity
    });
  };

  // Save Route details
  const handleSaveRoute = (routeId: string) => {
    const updated = routes.map(r => {
      if (r.id === routeId) {
        return {
          ...r,
          driverName: routeForm.driverName,
          driverPhone: routeForm.driverPhone,
          busNumber: routeForm.busNumber,
          capacity: routeForm.capacity
        };
      }
      return r;
    });
    setRoutes(updated);
    localStorage.setItem('anits_bus_routes', JSON.stringify(updated));
    setEditingRouteId(null);
  };

  // File response to student inquiry
  const handleSendReply = (compId: string) => {
    if (!replyText.trim()) return;

    const updated = complaints.map(c => {
      if (c.id === compId) {
        return {
          ...c,
          status: 'Resolved' as const,
          adminReply: replyText
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('anits_complaints', JSON.stringify(updated));
    setReplyText('');
    setReplyingComplaintId(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header element */}
      <div className="bg-sky-950 text-white p-6 rounded-3xl shadow-md flex items-center justify-between border border-sky-800">
        <div className="space-y-1.5Col">
          <div className="inline-flex items-center space-x-1.5 bg-sky-900 px-3 py-1 rounded-lg border border-sky-800 text-xs font-semibold text-amber-400 font-mono">
            🛡️ Administrative Desk Mode
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">ANITS Campus Transport Desk</h1>
          <p className="text-xs text-sky-200">
            Internal console database management tools to track schedules, registrations, circular rosters, and logs.
          </p>
        </div>
      </div>

      {/* Local Tab bar for administrative consoles */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200/60 max-w-2xl">
        <button
          onClick={() => setActiveTab('passes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-extrabold cursor-pointer transition ${
            activeTab === 'passes'
              ? 'bg-sky-950 text-white shadow-sm font-black'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Pass Applications</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-extrabold cursor-pointer transition ${
            activeTab === 'routes'
              ? 'bg-sky-950 text-white shadow-sm font-black'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Fleet Allocations</span>
        </button>

        <button
          onClick={() => setActiveTab('publish')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-extrabold cursor-pointer transition ${
            activeTab === 'publish'
              ? 'bg-sky-950 text-white shadow-sm font-black'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-extrabold cursor-pointer transition ${
            activeTab === 'complaints'
              ? 'bg-sky-950 text-white shadow-sm font-black'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Student Inquiries ({complaints.filter(c => c.status !== 'Resolved').length})</span>
        </button>
      </div>

      {/* Main Console layouts */}
      <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-[32px] shadow-3xs">
        
        {/* VIEW 1: Active Pass Applications */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-800 text-base">Student Bus Pass Registration Board</h3>
                <p className="text-xs text-gray-400">Total record registries ({activePasses.length} registered students in active semester).</p>
              </div>
            </div>

            {activePasses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <ScrollText className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-bold text-gray-600 text-sm mt-3">No active enrollments</h4>
                <p className="text-xs text-gray-400 mt-1">There are currently no registers available. Switch to Student role to file an application.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-mono font-bold">
                      <th className="pb-3.5 pl-3">Student Details</th>
                      <th className="pb-3.5">Branch / Year</th>
                      <th className="pb-3.5">Assigned Route</th>
                      <th className="pb-3.5">Boarding stop</th>
                      <th className="pb-3.5">Fees Amount</th>
                      <th className="pb-3.5 text-center">Status state</th>
                      <th className="pb-3.5 text-right pr-3">Desk Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePasses.map((pass) => (
                      <tr key={pass.id} id={`admin-pass-row-${pass.id}`} className="border-b border-gray-100/60 hover:bg-gray-50/50 transition">
                        <td className="py-4 pl-3 flex items-center space-x-3">
                          <img
                            src={pass.photoUrl}
                            alt="avatar"
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-sans font-black text-gray-900 block leading-tight">{pass.studentName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{pass.rollNumber}</span>
                          </div>
                        </td>
                        <td className="py-4 font-medium text-gray-700">
                          <span className="block truncate w-32">{pass.department.split(' (')[1]?.replace(')', '') || pass.department}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">{pass.year}</span>
                        </td>
                        <td className="py-4 font-extrabold text-sky-950 font-mono">{pass.routeNumber}</td>
                        <td className="py-4 text-gray-600 font-medium">{pass.boardingPointName}</td>
                        <td className="py-4 text-emerald-700 font-black font-mono">₹{pass.feeAmount.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-center">
                          <span className={`inline-block text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded ${
                            pass.applicationStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                            pass.applicationStatus === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {pass.applicationStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3">
                          {pass.applicationStatus === 'Pending' ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                id={`approve-pass-btn-${pass.id}`}
                                onClick={() => handlePassStatus(pass.id, 'Approved')}
                                className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition"
                                title="Approve Student Pass"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                id={`reject-pass-btn-${pass.id}`}
                                onClick={() => handlePassStatus(pass.id, 'Rejected')}
                                className="p-1.5 bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200 transition"
                                title="Reject Student Pass"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Finalized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Fleet Management */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-800 text-base">Fleet Operations & Drivers Roster</h3>
              <p className="text-xs text-gray-400">Configure assigned drivers, update license plate records, and capacities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((route) => {
                const isEditing = editingRouteId === route.id;
                return (
                  <div
                    key={route.id}
                    id={`admin-route-card-${route.id}`}
                    className="border border-gray-150 p-5 rounded-2xl bg-gray-50/50 space-y-4 font-sans"
                  >
                    <div className="flex justify-between items-start gap-2 border-b border-gray-200/50 pb-3">
                      <div>
                        <span className="bg-sky-950 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono font-black shadow-xs">
                          {route.routeNumber}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm mt-1">{route.routeName.split(' to')[0]}</h4>
                      </div>
                      {!isEditing && (
                        <button
                          id={`edit-route-btn-${route.id}`}
                          onClick={() => handleStartEditRoute(route)}
                          className="p-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl flex items-center justify-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-1 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 uppercase text-[9px]">Driver Name</label>
                            <input
                              type="text"
                              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-sans font-medium"
                              value={routeForm.driverName}
                              onChange={(e) => setRouteForm(p => ({ ...p, driverName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 uppercase text-[9px]">Driver Mobile</label>
                            <input
                              type="text"
                              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono"
                              value={routeForm.driverPhone}
                              onChange={(e) => setRouteForm(p => ({ ...p, driverPhone: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 uppercase text-[9px]">Coach Plate Number</label>
                            <input
                              type="text"
                              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono"
                              value={routeForm.busNumber}
                              onChange={(e) => setRouteForm(p => ({ ...p, busNumber: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 uppercase text-[9px]">Total Seating Capacity</label>
                            <input
                              type="number"
                              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono"
                              value={routeForm.capacity}
                              onChange={(e) => setRouteForm(p => ({ ...p, capacity: Number(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => setEditingRouteId(null)}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            id={`save-route-btn-${route.id}`}
                            onClick={() => handleSaveRoute(route.id)}
                            className="bg-sky-950 text-white font-bold px-3.5 py-1.5 rounded-lg"
                          >
                            Save Records
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[9px] block">Assigned Driver</span>
                          <span className="font-black text-gray-700 block mt-0.5">{route.driverName}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">{route.driverPhone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[9px] block">Coach details</span>
                          <span className="font-black text-gray-700 block mt-0.5 font-mono">{route.busNumber}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{route.filledSeats} / {route.capacity} seats filled</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: Circular publication */}
        {activeTab === 'publish' && (
          <div className="space-y-6 max-w-2xl">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-800 text-base">Roster a New Official Announcement</h3>
              <p className="text-xs text-gray-400">Circular notifications will immediately broadcast on student dashboards.</p>
            </div>

            <form onSubmit={handlePublishAlert} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Announcement Header Title</label>
                <input
                  id="admin-alert-title"
                  type="text"
                  required
                  placeholder="e.g. Schedule diversion on Route 03"
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:bg-white focus:border-sky-500 transition-all font-medium font-sans"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category Tag</label>
                  <select
                    id="admin-alert-category"
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 cursor-pointer"
                    value={alertForm.category}
                    onChange={(e) => setAlertForm(p => ({ ...p, category: e.target.value as any }))}
                  >
                    <option value="General">General Notice</option>
                    <option value="Alert">Critical Alert</option>
                    <option value="Schedule Change">Schedule Modification</option>
                    <option value="Holiday">Holiday suspends</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Affected Bus Channel</label>
                  <select
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 cursor-pointer"
                    value={alertForm.routeAffected}
                    onChange={(e) => setAlertForm(p => ({ ...p, routeAffected: e.target.value }))}
                  >
                    <option value="All">All Operations</option>
                    <option value="Route 01">Route 01</option>
                    <option value="Route 02">Route 02</option>
                    <option value="Route 03">Route 03</option>
                    <option value="Route 04">Route 04</option>
                    <option value="Route 05">Route 05</option>
                    <option value="Route 06">Route 06</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Circular Text Content</label>
                <textarea
                  id="admin-alert-content"
                  required
                  rows={5}
                  placeholder="Draft official notification message guidelines cleanly..."
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:bg-white focus:border-sky-500 transition-all font-medium font-sans"
                  value={alertForm.content}
                  onChange={(e) => setAlertForm(p => ({ ...p, content: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <input
                  type="checkbox"
                  id="admin-alert-important"
                  className="w-4 h-4 text-sky-950 focus:ring-sky-500 border-gray-300 rounded cursor-pointer"
                  checked={alertForm.important}
                  onChange={(e) => setAlertForm(p => ({ ...p, important: e.target.checked }))}
                />
                <label htmlFor="admin-alert-important" className="text-xs font-bold text-sky-950 cursor-pointer select-none">
                  Tag as ⚠️ CRITICAL NOTICE (Forces yellow highlight overlay on main portal)
                </label>
              </div>

              {alertSuccess && (
                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl block font-medium animate-fadeIn">
                  ✔ Announcement dispatch registered successfully inside persistent database tree.
                </div>
              )}

              <button
                type="submit"
                id="publish-btn"
                className="bg-amber-500 hover:bg-amber-600 text-sky-950 font-extrabold px-6 py-3.5 rounded-xl text-xs transition flex items-center space-x-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>Publish Official Broadcast</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW 4: Manage Student Inquiries */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-800 text-base">Unresolved Grievance & Complaint Tickets</h3>
              <p className="text-xs text-gray-400">Review, categorize, and respond back to active students.</p>
            </div>

            <div className="space-y-4">
              {complaints.filter(c => c.status !== 'Resolved').length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-gray-600 text-sm mt-3">All clear!</h4>
                  <p className="text-xs text-gray-400 mt-1">There are currently no outstanding student grievance requests waiting response.</p>
                </div>
              ) : (
                complaints.filter(c => c.status !== 'Resolved').map((comp) => (
                  <div
                    key={comp.id}
                    id={`admin-complaint-ticket-${comp.id}`}
                    className="border border-orange-200 rounded-2xl p-5 bg-orange-50/10 space-y-4 font-sans"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
                          {comp.category} • {comp.routeNumber}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm mt-1">{comp.subject}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{comp.date}</span>
                    </div>

                    <p className="text-xs text-gray-600 font-sans leading-relaxed">
                      "{comp.description}"
                    </p>

                    <div className="text-[11px] font-mono text-sky-800 font-medium">
                      🎫 Logged Registration: {comp.studentName} ({comp.rollNumber})
                    </div>

                    {replyingComplaintId === comp.id ? (
                      <div className="space-y-3 pt-2 animate-fadeIn">
                        <textarea
                          placeholder="Draft the official coordination response message here..."
                          className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 outline-hidden text-gray-800 font-medium"
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => {
                              setReplyingComplaintId(null);
                              setReplyText('');
                            }}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-3.5 py-1.5 rounded-lg font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            id={`submit-reply-btn-${comp.id}`}
                            onClick={() => handleSendReply(comp.id)}
                            className="bg-sky-950 text-white px-4 py-1.5 rounded-lg font-bold"
                          >
                            Send Response & Close Ticket
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        id={`reply-btn-${comp.id}`}
                        onClick={() => {
                          setReplyingComplaintId(comp.id);
                          setReplyText('');
                        }}
                        className="bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Address Ticket Inquiries</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
