import React, { useState } from 'react';
import { Bus, MapPin, Calendar, Clock, Phone, FileCheck, ShieldCheck, ChevronRight, Calculator, AlertTriangle, MessageSquare, Info } from 'lucide-react';
import { Announcement, BusRoute } from '../types';
import { VIZAG_FEE_SLABS } from '../data/mockData';
import { motion } from 'motion/react';

interface DashboardHomeProps {
  announcements: Announcement[];
  routes: BusRoute[];
  setCurrentTab: (tab: string) => void;
}

export default function DashboardHome({ announcements, routes, setCurrentTab }: DashboardHomeProps) {
  const [selectedRegion, setSelectedRegion] = useState(VIZAG_FEE_SLABS[2].region);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  // find route list matching the selected slab
  const getSuggestedRoutes = (region: string) => {
    if (region.includes('Gajuwaka') || region.includes('Steel')) return ['Route 01', 'Route 02'];
    if (region.includes('Sujatha') || region.includes('Pendurthi') || region.includes('Complex')) return ['Route 03', 'Route 04'];
    if (region.includes('Madhurawada') || region.includes('Anandapuram')) return ['Route 05'];
    if (region.includes('Vizianagaram')) return ['Route 06'];
    return ['Route 01', 'Route 03', 'Route 05'];
  };

  const activeSlab = VIZAG_FEE_SLABS.find(slab => slab.region === selectedRegion) || VIZAG_FEE_SLABS[2];

  const stats = [
    { value: '32+', label: 'Deluxe Fleet Buses', icon: Bus, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { value: '45+', label: 'Boarding Stations', icon: MapPin, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { value: '2,800+', label: 'Active Commuters', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: '24/7', label: 'Safety Support Desk', icon: Phone, color: 'bg-sky-50 text-sky-600 border-sky-100' }
  ];

  const faqs = [
    {
      q: "Who is eligible to apply for ANITS college bus services?",
      a: "All regular students and registered staff members of ANITS are eligible. Seats are allocated on a first-come, first-serve basis. Priority is given to students applying for full-year passes during semester commencement."
    },
    {
      q: "How can I pay the transportation fee? Is monthly installment allowed?",
      a: "The transport fee is billed annually as per the designated zone. Payment can be processed online through this portal's integrated digital checkout simulation. Standard college guidelines state that the transportation fee must be paid in full at the start of the academic year; quarterly installations require special administrative approval from the Principal."
    },
    {
      q: "What should I do if I lose my physical Bus Pass?",
      a: "Keep your digital bus pass from this portal active on your smartphone as verification. To get a duplicate physical card, present your digital pass or receipt at the Transport Cabin in the Administrative Block, submit an application along with a spare photo, and pay a replacement fee of ₹200."
    },
    {
      q: "What safety protocols are followed in ANITS buses?",
      a: "All college buses are government fitness certified, speed-governed below 50 km/h, fully insured, and equipped with a mandatory First-Aid kit, fire extinguisher, and speed tracking alarms. Experienced professional drivers have undergone rigid vetting. A student transport committee helps monitor discipline."
    }
  ];  return (
    <div className="space-y-10 pb-16 font-sans">
      {/* Hero Banner Section */}
      <div className="relative bg-white border-4 border-slate-900 p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rounded-none overflow-hidden min-h-[300px] flex flex-col justify-center">
        {/* Background massive letters */}
        <h1 className="text-[140px] font-black leading-[0.8] tracking-tighter uppercase select-none pointer-events-none opacity-[0.03] absolute -top-4 left-10 font-display">
          MANAGEMENT
        </h1>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl space-y-4 w-full">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border-2 border-blue-700 text-blue-700 px-3 py-1 text-xs font-black uppercase tracking-widest font-mono">
              🛡️ Safe, Timely & Campus-Managed Bus Fleet
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none font-display">
              SMART CAMPUS <br/>
              <span className="text-blue-700">TRANSPORT</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
              Real-time fleet optimization for Anil Neerukonda Institute of Technology & Sciences.
              Managing active deluxe routes covering Gajuwaka, Madhurawada, Pendurthi, and Vizianagaram.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 w-full md:w-auto">
              <button
                id="hero-apply-btn"
                onClick={() => setCurrentTab('pass')}
                className="w-full sm:w-auto bg-blue-700 hover:bg-slate-900 text-white font-black uppercase tracking-wider px-6 py-3.5 border-2 border-slate-900 transition-all rounded-none text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 duration-150"
              >
                <FileCheck className="w-4 h-4" />
                <span>Apply for Bus Pass</span>
              </button>
              <button
                id="hero-routes-btn"
                onClick={() => setCurrentTab('routes')}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-black uppercase tracking-wider px-6 py-3.5 border-2 border-slate-900 transition-all rounded-none text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 duration-150"
              >
                <MapPin className="w-4 h-4 text-blue-700 stroke-[2.5]" />
                <span>Explore Bus Routes</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end shrink-0 select-none">
            <span className="text-8xl font-black text-slate-200 tabular-nums leading-none font-display">48</span>
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase font-mono">Active Buses</span>
          </div>
        </div>
      </div>

      {/* College Highlights Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-none flex items-center space-x-4 hover:bg-slate-50 transition duration-150"
            >
              <div className={`p-3.5 rounded-none border-2 border-slate-900 bg-slate-100 text-slate-900`}>
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight leading-none font-display">
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 font-extrabold mt-1 uppercase tracking-wider font-mono">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Announcements and Live Alerts Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Announcement Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="p-1 px-3 bg-rose-50 border-2 border-rose-600 text-rose-600 rounded-none text-xs font-mono font-black uppercase">ALERTS SYSTEM</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight font-display">Circulars & Broadcasts</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-extrabold bg-slate-100 border border-slate-300 px-2 py-1 rounded-none font-mono uppercase tracking-wider">
              Live Feed active
            </span>
          </div>

          <div className="space-y-6">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                id={`announcement-card-${ann.id}`}
                className={`bg-white p-5 rounded-none border-2 border-slate-900 transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 relative shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${
                  ann.important ? 'border-l-8 border-l-red-600 bg-red-50/10' : ''
                }`}
              >
                {ann.important && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded-none tracking-widest border border-slate-900">
                    ⚠️ CRITICAL BROADCAST
                  </span>
                )}
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 border-2 border-slate-900 rounded-none mt-1 ${
                    ann.category === 'Alert' ? 'bg-red-100 text-red-600' :
                    ann.category === 'Schedule Change' ? 'bg-amber-100 text-amber-700' :
                    ann.category === 'Holiday' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {ann.category === 'Alert' ? <AlertTriangle className="w-5 h-5 stroke-[2.5]" /> : <Clock className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-mono font-black text-slate-900 uppercase tracking-widest bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-none">
                      {ann.category} {ann.routeAffected ? `| ${ann.routeAffected}` : ''}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base tracking-tight pt-0.5 font-display">
                      {ann.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold pt-1 whitespace-pre-line">
                      {ann.content}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-extrabold pt-2 font-mono uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Posted: {ann.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Interactive Zone Fee Calculator */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2.5">
            <span className="p-1 px-3 bg-blue-50 border-2 border-blue-700 text-blue-700 rounded-none text-xs font-mono font-black uppercase">CALC</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-display">Fee Estimator</h2>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-none shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            <div className="p-5 bg-slate-900 text-white space-y-1 rounded-none">
              <h3 className="font-black text-xs tracking-widest uppercase font-mono text-blue-400">ANITS BUS PRICING</h3>
              <p className="text-[10px] text-slate-400 font-medium">Select your nearest boarding location to estimate annual pass charges.</p>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block font-mono">Boarding Area / Town</label>
                <select
                  id="fee-slab-select"
                  className="w-full text-xs font-black bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 outline-none hover:bg-slate-100 focus:border-blue-700 focus:bg-white focus:ring-0 transition-all cursor-pointer text-slate-900 uppercase tracking-wide font-mono"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {VIZAG_FEE_SLABS.map((slab) => (
                    <option key={slab.region} value={slab.region}>
                      {slab.region.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Details Block */}
              <div className="bg-blue-50/70 rounded-none p-4.5 border-2 border-slate-900 text-center space-y-1">
                <span className="text-[9px] font-mono tracking-wider font-black text-blue-700 block uppercase">Zone Price Estimate</span>
                <div className="text-3xl font-black text-slate-950 tracking-tight font-display">
                  ₹{activeSlab.fee.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-bold text-slate-400">/ YEAR</span>
                </div>
                <div className="text-[9px] text-emerald-700 font-black bg-emerald-100 inline-block px-3 py-1 rounded-none mt-1 border-2 border-emerald-600 uppercase font-mono">
                  ✔ Safe Insurance Covered
                </div>
              </div>

              {/* Details and Routes Block */}
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Recommended Buses:</span>
                  <div className="flex flex-wrap gap-2">
                    {getSuggestedRoutes(selectedRegion).map((routeNo) => (
                      <span key={routeNo} className="bg-white border-2 border-slate-900 text-slate-950 px-2.5 py-1 rounded-none text-xs font-black font-mono">
                        🚌 {routeNo.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-normal font-mono">
                  * Pricing is structured based on real physical distance to ANITS engineering campus located in Sangivalasa, Bheemili Mandal. Slabs are regulated and approved by AP Higher Education Transport wing.
                </p>

                <button
                  id="book-pass-from-calc"
                  onClick={() => setCurrentTab('pass')}
                  className="w-full bg-blue-700 hover:bg-slate-900 text-white font-black py-4 px-4 rounded-none text-xs uppercase tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 mt-2 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Register on this Route</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* College Contact Desk Grid */}
      <div className="bg-white border-2 border-slate-900 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] rounded-none">
        <div className="space-y-2">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-none border-2 border-slate-900 inline-block">
            <Phone className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-display">CAMPUS OFFICE HELPDESK</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Directly connect with our administrative transport supervisors for boarding issues, bus breakdowns, safety alarms, or official feedbacks.
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-300 pt-6 md:pt-0 md:pl-6 space-y-3 text-xs text-slate-700">
          <div>
            <span className="font-extrabold text-slate-400 block uppercase text-[10px] tracking-wider font-mono">Office In-charge:</span>
            <span className="font-extrabold text-slate-900 text-base">Prof. G. Srinivasa Rao</span>
            <span className="text-slate-400 text-xs block font-medium">Transport Convener, ANITS Campus</span>
          </div>
          <div>
            <span className="font-extrabold text-slate-400 block uppercase text-[10px] tracking-wider font-mono">Primary Helpline:</span>
            <span className="font-black text-blue-700 text-base font-mono">+91 94444 88812</span>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-300 pt-6 md:pt-0 md:pl-6 space-y-3 text-xs text-slate-700">
          <div>
            <span className="font-extrabold text-slate-400 block uppercase text-[10px] tracking-wider font-mono">Emergency Hotlines:</span>
            <div className="space-y-1.5 font-mono text-xs font-extrabold text-slate-600 mt-1">
              <div className="flex justify-between border-b border-slate-200 pb-1 uppercase">
                <span>Route Issues Desk:</span>
                <span className="text-blue-700 font-black">+91 89332 23115</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1 uppercase">
                <span>Account & Fees Desk:</span>
                <span className="text-blue-700 font-black">+91 89332 23116</span>
              </div>
              <div className="flex justify-between uppercase">
                <span>Emergency Breakdown:</span>
                <span className="text-red-600 font-black">+91 91108 55422</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2.5">
          <Info className="w-5 h-5 text-blue-700 stroke-[2.5]" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Rules & Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              id={`faq-item-${idx}`}
              className="bg-white p-5 border-2 border-slate-900 rounded-none hover:bg-slate-50 transition cursor-pointer group shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
              onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
            >
              <div className="flex justify-between items-center space-x-2">
                <h3 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wide group-hover:text-blue-700 transition duration-150">
                  {faq.q}
                </h3>
                <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform ${selectedFaq === idx ? 'rotate-90 text-blue-700' : ''}`} />
              </div>
              {selectedFaq === idx && (
                <p className="text-xs text-slate-500 leading-relaxed mt-3 pt-3 border-t-2 border-slate-200 font-medium whitespace-pre-line animate-fadeIn">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
