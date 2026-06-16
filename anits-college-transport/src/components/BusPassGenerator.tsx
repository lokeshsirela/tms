import React, { useState, useEffect } from 'react';
import { FileText, MapPin, User, Mail, CreditCard, Building, Calendar, Phone, CheckCircle2, Download, RefreshCw, AlertTriangle, Printer, QrCode } from 'lucide-react';
import { BusRoute, BusPass, BoardingPoint } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface BusPassGeneratorProps {
  routes: BusRoute[];
  userRole: string;
  activePasses: BusPass[];
  setActivePasses: React.Dispatch<React.SetStateAction<BusPass[]>>;
  selectedRouteIdForRegistration: string;
}

export default function BusPassGenerator({
  routes,
  userRole,
  activePasses,
  setActivePasses,
  selectedRouteIdForRegistration,
}: BusPassGeneratorProps) {
  // Wizard steps: 1 = Student Info, 2 = Route Select, 3 = Pay Simulation, 4 = Success
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentId: 'ANITS-' + Math.floor(100000 + Math.random() * 900000),
    studentName: '',
    email: '',
    department: DEPARTMENTS[0],
    year: '1st Year' as const,
    section: 'A',
    rollNumber: '',
    phoneNumber: '',
    routeId: '',
    boardingPointId: '',
    transactionId: '',
    photoUrl: '', // Base64 string from upload
  });

  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedStop, setSelectedStop] = useState<BoardingPoint | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [activePass, setActivePass] = useState<BusPass | null>(null);
  const [paymentType, setPaymentType] = useState<'UPI' | 'Card'>('UPI');

  // Load from selection if redirected from Route Listing
  useEffect(() => {
    if (selectedRouteIdForRegistration) {
      const match = routes.find(r => r.id === selectedRouteIdForRegistration);
      if (match) {
        setSelectedRoute(match);
        setFormData(prev => ({
          ...prev,
          routeId: match.id,
          boardingPointId: match.stops[0]?.id || '',
        }));
        if (match.stops[0]) {
          setSelectedStop(match.stops[0]);
        }
      }
    } else if (routes.length > 0 && !formData.routeId) {
      setSelectedRoute(routes[0]);
      setFormData(prev => ({
        ...prev,
        routeId: routes[0].id,
        boardingPointId: routes[0].stops[0]?.id || '',
      }));
      setSelectedStop(routes[0].stops[0]);
    }
  }, [selectedRouteIdForRegistration, routes]);

  // If student role is active, check if they have a pass in the list
  useEffect(() => {
    // If we have passes, show the most recent one
    if (activePasses.length > 0) {
      // Find pass for 'Demo Student' or the freshly created one
      setActivePass(activePasses[activePasses.length - 1]);
    } else {
      setActivePass(null);
    }
  }, [activePasses]);

  // Handle route change in form
  const handleRouteChange = (routeId: string) => {
    const route = routes.find(r => r.id === routeId) || null;
    setSelectedRoute(route);
    if (route) {
      const firstStop = route.stops[0] || null;
      setSelectedStop(firstStop);
      setFormData(prev => ({
        ...prev,
        routeId: routeId,
        boardingPointId: firstStop ? firstStop.id : '',
      }));
    }
  };

  // Handle stop change in form
  const handleStopChange = (stopId: string) => {
    if (selectedRoute) {
      const stop = selectedRoute.stops.find(s => s.id === stopId) || null;
      setSelectedStop(stop);
      setFormData(prev => ({
        ...prev,
        boardingPointId: stopId,
      }));
    }
  };

  // File Upload base64 encoding helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData(prev => ({ ...prev, photoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Skip photo upload fallback
  const handlePhotoFallback = () => {
    const placeholder = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`;
    setPhotoPreview(placeholder);
    setFormData(prev => ({ ...prev, photoUrl: placeholder }));
  };

  // Submit the registration application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoute || !selectedStop) return;

    // Validate inputs
    if (!formData.studentName || !formData.rollNumber || !formData.phoneNumber) {
      alert('Please fill out all personal details before submitting.');
      return;
    }

    const txId = formData.transactionId || 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);

    const newPass: BusPass = {
      id: 'PASS-' + Math.floor(1000 + Math.random() * 9000),
      studentId: formData.studentId,
      studentName: formData.studentName,
      email: formData.email || `${formData.studentName.toLowerCase().replace(/\s/g, '')}@anits.edu.in`,
      department: formData.department,
      year: formData.year,
      section: formData.section,
      rollNumber: formData.rollNumber,
      phoneNumber: formData.phoneNumber,
      routeId: selectedRoute.id,
      routeNumber: selectedRoute.routeNumber,
      boardingPointId: selectedStop.id,
      boardingPointName: selectedStop.name,
      feeAmount: selectedStop.fee,
      paymentStatus: 'Paid', // For sandbox demo, auto-pay succeeds
      applicationStatus: 'Approved', // Auto-approved for sandbox delight
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      transactionId: txId,
      appliedDate: new Date().toISOString().split('T')[0],
      validUntil: '2027-04-30',
      qrCodeData: `ANITS-PASS:${formData.rollNumber}|ROUTE:${selectedRoute.routeNumber}|STOP:${selectedStop.name}`,
    };

    const updatedPasses = [...activePasses, newPass];
    setActivePasses(updatedPasses);
    localStorage.setItem('anits_bus_passes', JSON.stringify(updatedPasses));

    setActivePass(newPass);
    setStep(4);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = () => {
    setStep(1);
    setFormData({
      studentId: 'ANITS-' + Math.floor(100000 + Math.random() * 900000),
      studentName: '',
      email: '',
      department: DEPARTMENTS[0],
      year: '1st Year',
      section: 'A',
      rollNumber: '',
      phoneNumber: '',
      routeId: routes[0]?.id || '',
      boardingPointId: routes[0]?.stops[0]?.id || '',
      transactionId: '',
      photoUrl: '',
    });
    setPhotoPreview('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* If current role is Student and they already have a pass, display the pass directly! */}
      {activePass ? (
        <div className="space-y-8 max-w-4xl mx-auto font-sans">
          {/* Header Action panel */}
          <div className="bg-white border-2 border-slate-900 p-6 rounded-none shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1 px-3 bg-emerald-50 text-emerald-800 border-2 border-emerald-600 rounded-none text-xs font-mono font-black uppercase tracking-wider">ACTIVE</span>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase font-display">ANITS Digital Bus Pass</h1>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Authorized digital identification for onboarding college buses.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="print-pass-btn"
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-900 font-extrabold px-4 py-2.5 rounded-none text-xs flex items-center space-x-1.5 transition uppercase tracking-widest cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Print / PDF</span>
              </button>
              <button
                id="apply-new-pass-btn"
                onClick={handleResetForm}
                className="bg-blue-700 hover:bg-slate-900 text-white font-extrabold px-4 py-2.5 rounded-none text-xs flex items-center space-x-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition uppercase tracking-widest cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Application</span>
              </button>
            </div>
          </div>

          {/* Bus Pass Design Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left side: Rendered Card */}
            <div className="md:col-span-7 flex justify-center">
              <div
                id="printable-bus-pass-card"
                className="w-full max-w-sm rounded-none border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden relative select-none print:shadow-none print:border-slate-900"
              >
                {/* Hologram strip decoration top */}
                <div className="bg-slate-950 h-3 flex">
                  <div className="flex-1 bg-red-600 h-full" />
                  <div className="flex-1 bg-blue-700 h-full" />
                  <div className="flex-1 bg-amber-400 h-full" />
                  <div className="flex-1 bg-slate-900 h-full" />
                </div>

                {/* College Branding Header */}
                <div className="bg-slate-950 text-white p-5 text-center relative border-b-4 border-slate-900">
                  <div className="absolute right-4 top-4 text-blue-400 flex items-center justify-center bg-slate-900/100 p-1.5 rounded-none border-2 border-slate-700">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-sm tracking-widest text-[#FFDF00] uppercase font-mono">ANITS ENGINEERING</h3>
                  <p className="text-[10px] tracking-wider text-slate-300 font-extrabold uppercase mt-0.5">COLLEGE BUS PASS 2026 - 2027</p>
                  <span className="inline-block mt-3 bg-white text-[9px] text-slate-900 font-black px-2.5 py-1 rounded-none border-2 border-slate-900 uppercase font-mono leading-none tracking-widest">
                    Verified commuter
                  </span>
                </div>

                {/* Student Personal details and Image */}
                <div className="p-5 space-y-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={activePass.photoUrl}
                      alt="Student Facehead"
                      className="w-20 h-20 rounded-none object-cover shrink-0 border-4 border-slate-900 bg-slate-50 shadow-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-display font-black text-slate-900 text-base leading-tight uppercase tracking-tight">
                        {activePass.studentName}
                      </h4>
                      <p className="text-[10px] font-black text-blue-700 font-mono tracking-widest uppercase">
                        {activePass.rollNumber}
                      </p>
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">
                        {activePass.year.toUpperCase()} • {activePass.department.split(' (')[1]?.replace(')', '').toUpperCase() || 'CSE'}
                      </div>
                    </div>
                  </div>

                  {/* Route stop specifications */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block font-mono">Bus fleet</span>
                      <span className="font-mono font-black text-sm text-slate-950 text-left block">
                        🚌 {activePass.routeNumber.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block font-mono">Board checkpoint</span>
                      <span className="font-mono font-black text-xs text-blue-700 text-left block leading-tight truncate uppercase">
                        {activePass.boardingPointName}
                      </span>
                    </div>
                  </div>

                  {/* Valid indicator and QR code block */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-2">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase font-mono tracking-wider block">Valid thru</span>
                        <span className="text-xs font-black text-red-600 font-mono block">
                          {activePass.validUntil}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase font-mono tracking-wider block">Transit Serial</span>
                        <span className="text-[10px] font-black text-slate-700 font-mono block">
                          {activePass.id}
                        </span>
                      </div>
                    </div>

                    {/* Barcode drawing container */}
                    <div className="p-2 px-3 border-2 border-slate-900 rounded-none bg-white shadow-none flex flex-col items-center justify-center">
                      <div className="flex items-center space-x-[2px] h-10 w-24">
                        {[1, 3, 1, 2, 1, 4, 1, 1, 2, 1, 3, 1, 2, 1, 1].map((w, idx) => (
                          <div
                            key={idx}
                            style={{ width: `${w}px` }}
                            className={`h-full ${idx % 2 === 0 ? 'bg-slate-950' : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono font-black mt-1 tracking-widest">
                        {activePass.rollNumber.substring(0, 4)}*{activePass.id.substring(5)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Seal watermark */}
                <div className="p-3 bg-slate-950 text-white text-center text-[10px] font-mono tracking-widest uppercase font-black">
                  ⭐ TRANSPORT CONVENER, ANITS OFFICE ⭐
                </div>
              </div>
            </div>

            {/* Right side: Informational metadata */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-5 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wide font-mono">Pass Verification Rules</h4>
                <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed font-mono uppercase text-[10px]">
                  <li>Mandatory: Present this digital pass to bus checkers when queried.</li>
                  <li>Backup: Keep high-contrast printouts with scannable barcode ready.</li>
                  <li>Warning: Do not modify image/roll number records under penalty.</li>
                  <li>Rule: Travel credentials are strictly non-transferable.</li>
                </ul>
              </div>

              <div className="border-2 border-slate-900 p-5 rounded-none bg-white space-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <h4 className="font-black text-xs md:text-sm text-slate-900 uppercase font-mono">Receipt info</h4>
                <div className="text-xs text-slate-500 space-y-1.5 font-mono uppercase text-[10px] font-bold">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Full Student Name:</span>
                    <span className="font-black text-slate-900">{activePass.studentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Roll Number ID:</span>
                    <span className="font-black text-slate-900">{activePass.rollNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Transaction ID:</span>
                    <span className="font-black text-blue-700 break-all ml-4 text-right">
                      {activePass.transactionId || 'SANDBOX-MOCK-OK'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Amount Transacted:</span>
                    <span className="font-black text-emerald-700 text-xs">
                      ₹{activePass.feeAmount?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Issued:</span>
                    <span className="font-black text-slate-900">{activePass.appliedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Render Registration Wizard */
        <div className="max-w-3xl mx-auto bg-white border-4 border-slate-900 rounded-none shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden font-sans">
          {/* Form Header with steps */}
          <div className="bg-slate-950 text-white p-6 md:p-8 space-y-4 rounded-none border-b-4 border-slate-900">
            <div>
              <span className="text-xs font-mono tracking-widest text-amber-400 font-black uppercase">ANITS OFFICE</span>
              <h1 className="text-2xl font-black text-white tracking-tight pt-1 uppercase font-display">Bus Seat Reservation Desk</h1>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="flex items-center justify-between max-w-sm pt-2 text-[10px] font-black uppercase font-mono tracking-widest">
              {[
                { s: 1, label: "Student" },
                { s: 2, label: "Routines" },
                { s: 3, label: "Billing" }
              ].map((item) => (
                <div key={item.s} className="flex items-center space-x-1.5">
                  <div className={`w-6 h-6 rounded-none flex items-center justify-center font-black border-2 transition ${
                    step === item.s
                      ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : step > item.s
                      ? 'bg-emerald-600 text-white border-white'
                      : 'border-slate-800 text-slate-400'
                  }`}>
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span className={step === item.s ? 'text-[#FFDF00] font-black' : 'text-slate-400'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitApplication} className="p-6 md:p-8 space-y-6">
            {/* STEP 1: Student Personal Details */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b-2 border-slate-200 pb-2 mb-2">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide font-mono">1. College Affiliation & Student Info</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Fill in authenticated records that match your admissions receipt.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                      <input
                        id="student-name-input"
                        type="text"
                        required
                        className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none pl-10 pr-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                        placeholder="John Doe"
                        value={formData.studentName}
                        onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Admission Roll Number</label>
                    <input
                      id="student-roll-input"
                      type="text"
                      required
                      placeholder="e.g. 322126511012"
                      className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Department / Branch</label>
                    <select
                      id="student-branch-select"
                      className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-slate-900 focus:outline-none focus:bg-white tracking-wider font-mono cursor-pointer"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Year of Study</label>
                    <select
                      id="student-year-select"
                      className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-slate-900 focus:outline-none focus:bg-white tracking-wider font-mono cursor-pointer"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value as any }))}
                    >
                      <option value="1st Year">1ST YEAR (FRESHER)</option>
                      <option value="2nd Year">2ND YEAR</option>
                      <option value="3rd Year">3RD YEAR</option>
                      <option value="4th Year">4TH YEAR</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Section Designation</label>
                    <input
                      id="student-section-input"
                      type="text"
                      required
                      placeholder="e.g. A, B, C"
                      className="w-full text-xs font-black bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono uppercase"
                      value={formData.section}
                      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Communication Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                      <input
                        id="student-email-input"
                        type="email"
                        required
                        className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none pl-10 pr-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                        placeholder="myemail@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                      <input
                        id="student-phone-input"
                        type="tel"
                        required
                        className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none pl-10 pr-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Passport photo upload segment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">Passport Size Headshot Photo</label>
                  <div className="bg-slate-50 border-2 border-dashed border-slate-900 rounded-none p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Face upload"
                        className="w-16 h-16 rounded-none object-cover shrink-0 border-4 border-slate-900"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded-none border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-900 font-mono font-black shrink-0">
                        NO IMAGE
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <h5 className="font-extrabold text-[#3b82f6] text-xs uppercase font-mono tracking-wider">Identity Headshot</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 leading-snug">Upload a recent photo (Base64 file loading supported), or generate mock face preview instantly on this portal.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                      <input
                        type="file"
                        id="photo-upload-input"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <label
                        htmlFor="photo-upload-input"
                        className="bg-white hover:bg-slate-100 border-2 border-slate-900 font-black px-4 py-2.5 rounded-none text-xs flex items-center justify-center space-x-1 cursor-pointer uppercase tracking-wider"
                      >
                        <span>Choose File</span>
                      </label>
                      <button
                        type="button"
                        id="demo-face-btn"
                        onClick={handlePhotoFallback}
                        className="bg-blue-100 text-[#1e3a8a] border-2 border-blue-400 hover:bg-blue-200 font-black px-4 py-2.5 rounded-none text-xs uppercase tracking-wider"
                      >
                        Mock Photo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    id="step1-next-btn"
                    onClick={() => {
                      if (!formData.studentName || !formData.rollNumber || !formData.phoneNumber) {
                        alert('Please fill out Name, Roll Number, and Mobile Phone prior to continuing.');
                        return;
                      }
                      setStep(2);
                    }}
                    className="bg-blue-700 hover:bg-slate-900 text-white border-2 border-slate-900 font-black px-6 py-3.5 rounded-none text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 duration-100 cursor-pointer"
                  >
                    Continue to Route Selection
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Route and stop selection */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b-2 border-slate-200 pb-2 mb-2">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide font-mono">2. Transport Routes & Stopping Slabs</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Identify the specific route and correct scheduled pickup terminal points.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest block font-mono">Assigned Transport Bus Route</label>
                    <select
                      id="form-route-select"
                      className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-wider font-mono cursor-pointer"
                      value={formData.routeId}
                      onChange={(e) => handleRouteChange(e.target.value)}
                    >
                      {routes.map(r => (
                        <option key={r.id} value={r.id}>{r.routeNumber} ({r.routeName.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest block font-mono">Preferred Stopping Station</label>
                    <select
                      id="form-stop-select"
                      className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-wider font-mono cursor-pointer"
                      value={formData.boardingPointId}
                      onChange={(e) => handleStopChange(e.target.value)}
                    >
                      {selectedRoute?.stops.filter(s => s.fee > 0).map(s => (
                        <option key={s.id} value={s.id}>{s.name.toUpperCase()} ({s.time})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* High Details overview for pricing block */}
                {selectedRoute && selectedStop && (
                  <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-[11px] font-mono uppercase font-black">
                      <div>
                        <span className="text-slate-400 font-black block tracking-wider">Coach Driver In-charge</span>
                        <span className="text-slate-900 block mt-1">{selectedRoute.driverName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-black block tracking-wider">Bus Registration Plate</span>
                        <span className="text-slate-900 block mt-1">{selectedRoute.busNumber}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-slate-200 my-3" />

                    <div className="flex justify-between items-center bg-white p-4 border-2 border-slate-900 rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <div>
                        <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-none font-mono font-black uppercase block w-max mb-1">Fee Slab</span>
                        <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">{selectedStop.name} Station Terminal</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-950 font-mono">
                          ₹{selectedStop.fee.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono uppercase font-bold mt-0.5">payable annually</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-900 font-black px-6 py-3 rounded-none text-xs uppercase tracking-widest duration-100"
                  >
                    Back to Profile
                  </button>
                  <button
                    type="button"
                    id="step2-next-btn"
                    onClick={() => {
                      if (!formData.routeId || !formData.boardingPointId) {
                        alert('Please identify the route and boarding station.');
                        return;
                      }
                      setStep(3);
                    }}
                    className="bg-blue-700 hover:bg-slate-900 text-white border-2 border-slate-900 font-black px-6 py-3.5 rounded-none text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 duration-100 cursor-pointer"
                  >
                    Proceed to Payment Desk
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Sandbox Payment Simulation */}
            {step === 3 && selectedStop && (
              <div className="space-y-5 animate-fadeIn font-sans">
                <div className="border-b-2 border-slate-200 pb-2 mb-2">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide font-mono">3. Pay College Tuition / Transport Dues</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Simulated secure checkout representing direct integration with higher education billing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left checklist of pricing review */}
                  <div className="md:col-span-5 bg-slate-50 border-2 border-slate-900 p-5 rounded-none space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-widest font-mono block">Line-item Review</h4>
                    <div className="space-y-3.5 text-xs font-mono uppercase text-[10px] font-bold">
                      <div className="flex justify-between border-b border-slate-200 pb-1.5 text-slate-500">
                        <span>Seat Reservation Fee:</span>
                        <span className="text-slate-800 font-black">Included</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5 text-slate-500">
                        <span>Route Travel Fee:</span>
                        <span className="text-slate-800 font-black">₹{(selectedStop.fee - 2000).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5 text-slate-500">
                        <span>Safety Insurance:</span>
                        <span className="text-slate-800 font-black">₹2,000</span>
                      </div>
                      <div className="flex justify-between font-black text-xs text-slate-900 pt-2">
                        <span>Overall Slabs:</span>
                        <span className="text-emerald-700">₹{selectedStop.fee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 leading-snug font-mono uppercase font-bold">
                      🔒 Sandbox payment. Submitting this form secures instant boarding authorization pass records.
                    </div>
                  </div>

                  {/* Right payment forms panel */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex bg-slate-150 bg-slate-100 p-1 border-2 border-slate-900 rounded-none">
                      <button
                        type="button"
                        className={`flex-1 font-mono font-black text-[10px] py-2 rounded-none uppercase cursor-pointer transition ${paymentType === 'UPI' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                        onClick={() => setPaymentType('UPI')}
                      >
                        ⚡ Unified UPI
                      </button>
                      <button
                        type="button"
                        className={`flex-1 font-mono font-black text-[10px] py-2 rounded-none uppercase cursor-pointer transition ${paymentType === 'Card' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                        onClick={() => setPaymentType('Card')}
                      >
                        💳 Debit/Credit Card
                      </button>
                    </div>

                    {paymentType === 'UPI' ? (
                      <div className="space-y-3.5 border-2 border-slate-900 p-5 rounded-none bg-white text-center flex flex-col items-center">
                        <span className="p-1 px-2.5 bg-slate-900 text-amber-400 border-2 border-slate-900 rounded-none text-[9px] font-mono font-black uppercase inline-block">
                          Instant QR Dispatcher
                        </span>
                        {/* Drawn mockup qr code */}
                        <div className="w-32 h-32 bg-slate-50 border-4 border-slate-900 rounded-none flex flex-wrap p-3 items-center justify-center relative">
                          <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-85">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div key={i} className={`rounded-none ${(i % 3 === 0 || i % 7 === 0 || i < 5 || i % 9 === 0) ? 'bg-slate-950' : 'bg-transparent'}`} />
                            ))}
                          </div>
                          <div className="absolute inset-x-0 bottom-4 text-[9px] font-mono font-black text-slate-950 uppercase bg-amber-400 py-1 border-2 border-slate-950 rounded-none tracking-widest">
                            Scan to pay
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight font-mono uppercase font-black">
                          Authorize UPI Payment request corresponding to <strong className="text-slate-950">anitstransport@scb</strong> using PhonePe, GooglePay, or Paytm.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 border-2 border-slate-900 p-5 rounded-none bg-white animate-fadeIn font-mono">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-900 uppercase">Interactive Card Number</label>
                          <input
                            type="text"
                            placeholder="4320 XXXX XXXX 4110"
                            className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-2.5 outline-none focus:bg-white text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-900 uppercase">Valid Thru</label>
                            <input
                              type="text"
                              placeholder="12/28"
                              className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-2.5 outline-none focus:bg-white text-slate-900 text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-900 uppercase">CVV Verification</label>
                            <input
                              type="password"
                              placeholder="***"
                              maxLength={3}
                              className="w-full text-xs font-black bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-2.5 outline-none focus:bg-white text-slate-900 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono block">UPI / Bank Transaction Refer ID</label>
                      <input
                        id="transaction-id-input"
                        type="text"
                        placeholder="MOCK1234567890 (Leave empty to skip)"
                        className="w-full text-xs font-black uppercase bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white tracking-widest font-mono"
                        value={formData.transactionId}
                        onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-900 font-black px-6 py-3 rounded-none text-xs uppercase tracking-widest duration-100"
                  >
                    Back to Routes
                  </button>
                  <button
                    type="submit"
                    id="submit-payment-btn"
                    className="bg-emerald-600 hover:bg-slate-900 text-white border-2 border-slate-900 font-black px-6 py-3.5 rounded-none text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 duration-100 cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay ₹{selectedStop.fee.toLocaleString('en-IN')} & Book Passes</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
