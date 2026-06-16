import React, { useState } from 'react';
import { ShieldAlert, FileText, Send, User, ChevronRight, MessageSquare, AlertTriangle, CheckCircle2, ListFilter, HelpCircle } from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintBoxProps {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
}

export default function ComplaintBox({ complaints, setComplaints }: ComplaintBoxProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    routeNumber: 'Route 01',
    category: 'Bus Delay' as const,
    subject: '',
    description: ''
  });

  const [activeFilter, setActiveFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [ticketFlicker, setTicketFlicker] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentName || !formData.rollNumber || !formData.subject || !formData.description) {
      alert('Please fill out all mandatory fields before dispatching ticket.');
      return;
    }

    const newTicket: Complaint = {
      id: 'COMP-' + Math.floor(100 + Math.random() * 900),
      studentName: formData.studentName,
      rollNumber: formData.rollNumber,
      routeNumber: formData.routeNumber,
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTicket, ...complaints];
    setComplaints(updated);
    localStorage.setItem('anits_complaints', JSON.stringify(updated));

    // Reset inputs
    setFormData({
      studentName: '',
      rollNumber: '',
      routeNumber: 'Route 01',
      category: 'Bus Delay',
      subject: '',
      description: ''
    });

    setTicketFlicker(true);
    setTimeout(() => setTicketFlicker(false), 2000);
  };

  const filteredComplaints = complaints.filter(
    comp => activeFilter === 'All' ? true : comp.status === activeFilter
  );

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header and overview block */}
      <div className="bg-white border-4 border-slate-900 p-6 rounded-none shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-display">Active Grievance & Student Support desk</h1>
          <p className="text-xs text-slate-500 font-bold uppercase">
            Submit feedback, report equipment breakage, file transit delay concerns, or suggest enhancements.
          </p>
        </div>
        <span className="text-[10px] font-mono font-black text-slate-900 bg-amber-400 border-2 border-slate-900 px-3 py-2 rounded-none uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Avg Response Time: 2-3 Business Days
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left side column: Submit Complaint ticket */}
        <div className="lg:col-span-5 bg-white border-4 border-slate-900 rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6 animate-fadeIn">
          <div className="border-b-2 border-slate-200 pb-2">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide font-mono">File Grievance Ticket</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">All submissions are monitored and resolved by the ANITS Transport Office.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Student Name</label>
                <input
                  id="complaint-student-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2.5 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                  value={formData.studentName}
                  onChange={(e) => setFormData(p => ({ ...p, studentName: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Roll Number</label>
                <input
                  id="complaint-roll-number"
                  type="text"
                  required
                  placeholder="321126510001"
                  className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2.5 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono font-bold"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData(p => ({ ...p, rollNumber: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Assigned Bus Route</label>
                <select
                  id="complaint-route-select"
                  className="w-full text-xs font-black bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white tracking-wider cursor-pointer"
                  value={formData.routeNumber}
                  onChange={(e) => setFormData(p => ({ ...p, routeNumber: e.target.value }))}
                >
                  {['Route 01', 'Route 02', 'Route 03', 'Route 04', 'Route 05', 'Route 06'].map(num => (
                    <option key={num} value={num}>{num.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Incident Tag Category</label>
                <select
                  id="complaint-category-select"
                  className="w-full text-xs font-black bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white tracking-wider cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any }))}
                >
                  <option value="Bus Delay">⌛ BUS DELAY / DELAYS</option>
                  <option value="Driver Behavior">👨‍✈️ STAFF BEHAVIOR</option>
                  <option value="Maintenance">🔧 BUS MAINTENANCE</option>
                  <option value="Crowding">👫 OVERCROWDING</option>
                  <option value="Other">❓ OTHER INQUIRY</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Ticket Subject</label>
              <input
                id="complaint-subject"
                type="text"
                required
                placeholder="Brief summary of the issue..."
                className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2.5 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                value={formData.subject}
                onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-900 uppercase tracking-wider block">Full Description / Detail</label>
              <textarea
                id="complaint-desc"
                required
                rows={4}
                placeholder="Kindly type in explicit details including bus registration, dates, boarding point reference etc..."
                className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            {ticketFlicker && (
              <div className="text-[10px] text-emerald-950 bg-emerald-100 border-2 border-emerald-500 p-3 rounded-none block font-bold uppercase tracking-wide animate-fadeIn">
                ✔ Ticket recorded successfully. Active tracking token has been synchronized inside current dashboard history.
              </div>
            )}

            <button
              type="submit"
              id="submit-complaint"
              className="w-full bg-[#1e3a8a] text-amber-400 font-black border-2 border-slate-900 hover:bg-slate-900 py-3.5 px-4 rounded-none text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider duration-100 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dispatch Grievance Ticket</span>
            </button>
          </form>
        </div>

        {/* Right side column: Ticket Log with filtering */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 border-4 border-slate-900 rounded-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase font-mono flex items-center space-x-2">
              <ListFilter className="w-4 h-4 text-[#1e3a8a]" />
              <span>Grievance Log Channels ({filteredComplaints.length})</span>
            </h3>

            {/* Filter buttons */}
            <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900 rounded-none">
              {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(status => (
                <button
                  key={status}
                  id={`comp-filter-${status.toLowerCase().replace(' ', '')}`}
                  onClick={() => setActiveFilter(status)}
                  className={`px-3 py-1.5 text-[9.5px] font-mono font-black uppercase cursor-pointer transition ${
                    activeFilter === status
                      ? 'bg-slate-900 text-[#FFDF00] rounded-none'
                      : 'text-slate-500 hover:text-slate-900 rounded-none'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4.5 overflow-y-auto max-h-[580px] pr-1.5">
            {filteredComplaints.length === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-300 text-center py-20 px-4 rounded-none">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5]" />
                <h3 className="font-black uppercase tracking-wider text-slate-900 mt-3 text-xs font-mono">No ticket matches</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are currently no tickets logged under the "{activeFilter}" state category.</p>
              </div>
            ) : (
              filteredComplaints.map((comp) => (
                <div
                  key={comp.id}
                  id={`complaint-card-${comp.id}`}
                  className="bg-white border-4 border-slate-900 rounded-none p-5 hover:border-blue-700 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-sans space-y-3.5"
                >
                  {/* Title block with custom status tags */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-black bg-slate-100 border-2 border-slate-900 text-slate-900 px-2 py-0.5 rounded-none uppercase">
                        {comp.category} • {comp.routeNumber}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-2 uppercase tracking-wide leading-snug">{comp.subject}</h4>
                    </div>

                    <span className={`text-[9px] font-mono font-black tracking-wider uppercase px-2.5 py-1 rounded-none border-2 ${
                      comp.status === 'Open' ? 'bg-orange-100 text-orange-900 border-slate-900' :
                      comp.status === 'In Progress' ? 'bg-amber-150 text-amber-900 border-slate-900' :
                      'bg-emerald-150 text-emerald-900 border-slate-900'
                    }`}>
                      {comp.status}
                    </span>
                  </div>

                  {/* Complaint Description content */}
                  <p className="text-xs text-slate-700 font-mono uppercase font-bold leading-relaxed whitespace-pre-line">
                    {comp.description}
                  </p>

                  {/* Reply block if existing */}
                  {comp.adminReply && (
                    <div className="bg-blue-50 border-2 border-blue-400 text-slate-900 rounded-none p-3.5 text-xs font-mono space-y-1.5 animate-fadeIn">
                      <span className="font-black text-[9px] uppercase tracking-widest text-[#1e3a8a] block">
                        Official Administrator Response:
                      </span>
                      <p className="font-extrabold text-slate-800 uppercase tracking-wide">{comp.adminReply}</p>
                    </div>
                  )}

                  {/* Stamp footer metadata */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono uppercase font-bold pt-2 border-t-2 border-slate-200">
                    <span className="font-black text-slate-900 font-mono uppercase">Student Signature: {comp.studentName} ({comp.rollNumber.substring(0, 4)}***)</span>
                    <span className="font-mono text-slate-400">Logged: {comp.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
