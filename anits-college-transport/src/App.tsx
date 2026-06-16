import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardHome from './components/DashboardHome';
import RouteExplorer from './components/RouteExplorer';
import BusPassGenerator from './components/BusPassGenerator';
import LiveTracking from './components/LiveTracking';
import ComplaintBox from './components/ComplaintBox';
import AdminConsole from './components/AdminConsole';

import { BusRoute, Announcement, Complaint, BusPass, UserRole } from './types';
import { INITIAL_ROUTES, INITIAL_ANNOUNCEMENTS, INITIAL_COMPLAINTS } from './data/mockData';
import { Bus, MapPin, Phone, HelpCircle, Shield, School, Award, ChevronRight } from 'lucide-react';

const DEFAULT_PASSES: BusPass[] = [
  {
    id: 'PASS-8842',
    studentId: 'ANITS-411202',
    studentName: 'A. Lokesh Kumar',
    email: 'lokesh.3211265@anits.edu.in',
    department: 'Computer Science & Engineering (CSE)',
    year: '3rd Year',
    section: 'B',
    rollNumber: '321126510012',
    phoneNumber: '+91 94503 21156',
    routeId: 'rt-03',
    routeNumber: 'Route 03',
    boardingPointId: 'st-03-4',
    boardingPointName: 'Maddilapalem (Ashilmetta road)',
    feeAmount: 26050,
    paymentStatus: 'Paid',
    applicationStatus: 'Approved',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    transactionId: 'TXN-90812356',
    appliedDate: '2026-06-12',
    validUntil: '2027-04-30',
    qrCodeData: 'ANITS-PASS:321126510012|ROUTE:Route 03|STOP:Maddilapalem (Ashilmetta road)'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('Student');

  // Application general persistent States
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activePasses, setActivePasses] = useState<BusPass[]>([]);

  // Selected Route state context to bridge Explorer tab -> pass generator tab
  const [selectedRouteIdForRegistration, setSelectedRouteIdForRegistration] = useState<string>('');

  // Hydrate local data on mount
  useEffect(() => {
    // 1. Routes setup
    const localRoutes = localStorage.getItem('anits_bus_routes');
    if (localRoutes) {
      setRoutes(JSON.parse(localRoutes));
    } else {
      setRoutes(INITIAL_ROUTES);
      localStorage.setItem('anits_bus_routes', JSON.stringify(INITIAL_ROUTES));
    }

    // 2. Announcements setup
    const localAnn = localStorage.getItem('anits_announcements');
    if (localAnn) {
      setAnnouncements(JSON.parse(localAnn));
    } else {
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      localStorage.setItem('anits_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    }

    // 3. Complaints setup
    const localComp = localStorage.getItem('anits_complaints');
    if (localComp) {
      setComplaints(JSON.parse(localComp));
    } else {
      setComplaints(INITIAL_COMPLAINTS);
      localStorage.setItem('anits_complaints', JSON.stringify(INITIAL_COMPLAINTS));
    }

    // 4. Passes setup
    const localPasses = localStorage.getItem('anits_bus_passes');
    if (localPasses) {
      setActivePasses(JSON.parse(localPasses));
    } else {
      setActivePasses(DEFAULT_PASSES);
      localStorage.setItem('anits_bus_passes', JSON.stringify(DEFAULT_PASSES));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/45 text-gray-800 flex flex-col font-sans selection:bg-amber-100 selection:text-sky-950">
      
      {/* College Prestige Banner Header */}
      <div className="bg-sky-950 text-white py-2 px-4 text-center border-b border-sky-900 flex flex-col md:flex-row justify-center items-center gap-1.5 md:gap-4 text-xs font-mono select-none">
        <div className="flex items-center space-x-1.5 text-sky-200">
          <School className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold uppercase tracking-wide">Anil Neerukonda Institute of Technology & Sciences (ANITS)</span>
        </div>
        <div className="hidden md:block text-sky-600">|</div>
        <div className="flex items-center space-x-1.5 text-gray-300">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Permanently Affiliated to Andhra University • Accredited by NBA & NAAC 'A' Grade</span>
        </div>
      </div>

      {/* Styled Primary Navigation components */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // Reset bridging state parameter once loaded
          if (tab !== 'pass') {
            setSelectedRouteIdForRegistration('');
          }
        }}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Primary body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        
        {/* Dynamic Route Switching */}
        {currentTab === 'home' && (
          <DashboardHome
            announcements={announcements}
            routes={routes}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'routes' && (
          <RouteExplorer
            routes={routes}
            setCurrentTab={setCurrentTab}
            setSelectedRouteIdForRegistration={setSelectedRouteIdForRegistration}
          />
        )}

        {currentTab === 'pass' && (
          <BusPassGenerator
            routes={routes}
            userRole={userRole}
            activePasses={activePasses}
            setActivePasses={setActivePasses}
            selectedRouteIdForRegistration={selectedRouteIdForRegistration}
          />
        )}

        {currentTab === 'tracking' && (
          <LiveTracking
            routes={routes}
          />
        )}

        {currentTab === 'complaints' && (
          <ComplaintBox
            complaints={complaints}
            setComplaints={setComplaints}
          />
        )}

        {currentTab === 'admin' && userRole === 'Admin' && (
          <AdminConsole
            routes={routes}
            setRoutes={setRoutes}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            complaints={complaints}
            setComplaints={setComplaints}
            activePasses={activePasses}
            setActivePasses={setActivePasses}
          />
        )}

      </main>

      {/* Professional structured Footer block */}
      <footer className="bg-sky-950 border-t border-sky-900 text-sky-200 mt-auto select-none print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: College credentials */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-500 text-sky-950 p-1.5 rounded-lg font-bold">
                <Bus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-white tracking-widest uppercase font-mono">ANITS PORTAL</span>
            </div>
            <p className="text-xs text-sky-300 leading-relaxed">
              Serving the academic commuter needs of Anil Neerukonda Institute, Sangivalasa, Bheemunipatnam mandal, Visakhapatnam since 2001. Registered and managed by the central administrative council.
            </p>
          </div>

          {/* Col 2: High Level Locations */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">Vizag Transit Hubs</h4>
            <ul className="text-xs space-y-2 text-sky-300">
              <li>📍 Gajuwaka & Kurmannapalem</li>
              <li>📍 RTC Complex & Satyam Circle</li>
              <li>📍 Maddilapalem & MVP Colony</li>
              <li>📍 NAD Junction & Pendurthi Road</li>
              <li>📍 Tagarapuvalasa & Madhurawada</li>
            </ul>
          </div>

          {/* Col 3: Useful shortcuts */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">Campus Fast Links</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button onClick={() => setCurrentTab('home')} className="text-left text-sky-300 hover:text-amber-400 font-medium">ANITS Transport Circulars</button>
              <button onClick={() => setCurrentTab('routes')} className="text-left text-sky-300 hover:text-amber-400 font-medium">Timetable Schedules</button>
              <button onClick={() => setCurrentTab('pass')} className="text-left text-sky-300 hover:text-amber-400 font-medium">Simulate Card Generator</button>
              <button onClick={() => setCurrentTab('tracking')} className="text-left text-sky-300 hover:text-amber-400 font-medium">Live Fleet GPS Tracker</button>
              <button onClick={() => setCurrentTab('complaints')} className="text-left text-sky-300 hover:text-amber-400 font-medium font-sans">Grievance & Support Desk</button>
            </div>
          </div>

          {/* Col 4: Central Emergency contact line */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider font-mono">Security Safety Cell</h4>
            <p className="text-xs text-sky-300 leading-snug">
              For bus breakdowns, rapid schedule delays, medical emergencies or lost valuables inside college coaches.
            </p>
            <div className="bg-sky-900 border border-sky-800 rounded-xl p-3 text-center space-y-0.5">
              <span className="text-[10px] text-sky-400 font-mono block">CAMPUS EMERGENCY HOTLINE</span>
              <span className="text-white font-black text-sm font-mono">+91 89332 23115</span>
            </div>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="bg-sky-950/70 border-t border-sky-900/50 py-4 text-center text-[10px] text-sky-400/70 font-mono">
          © {new Date().getFullYear()} Anil Neerukonda Institute of Technology & Sciences (ANITS). Built for Andhra Pradesh College Transportation Administration. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
