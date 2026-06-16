import React from 'react';
import { Bus, ShieldAlert, FileText, MapPin, Settings2, ShieldCheck, LogIn, Menu, X } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export default function Navbar({ currentTab, setCurrentTab, userRole, setUserRole }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Bus },
    { id: 'routes', label: 'Routes & Schedules', icon: MapPin },
    { id: 'pass', label: 'Apply Pass / Digital Pass', icon: FileText },
    { id: 'tracking', label: 'Live Spotting', icon: MapPin },
    { id: 'complaints', label: 'Support & Feedback', icon: ShieldAlert },
    ...(userRole === 'Admin' ? [{ id: 'admin', label: 'Transport Desk', icon: Settings2 }] : [])
  ];

  return (
    <nav className="bg-white border-b-4 border-slate-900 text-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="bg-slate-900 text-white p-2.5 rounded-none font-bold flex items-center justify-center transition hover:bg-blue-700 duration-200">
              <Bus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tighter leading-none text-slate-900 font-display">
                ANITS <span className="text-blue-700">TRANSIT</span>
              </div>
              <div className="text-[10px] tracking-widest uppercase font-black text-slate-400 mt-1 font-mono">
                Anil Neerukonda Institute, Vizag
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2.5 border-2 text-[11px] font-black uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-black'
                      : 'text-slate-700 border-transparent hover:text-blue-700 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side: Role Selector & Login state */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="bg-slate-100 border-2 border-slate-900 rounded-none px-3 py-1 flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-black uppercase font-mono">SIMULATE:</span>
              <div className="flex bg-white p-0.5 border border-slate-300">
                {(['Guest', 'Student', 'Admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    id={`role-btn-${role.toLowerCase()}`}
                    onClick={() => {
                      setUserRole(role);
                      if (role !== 'Admin' && currentTab === 'admin') {
                        setCurrentTab('home');
                      }
                    }}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider transition cursor-pointer rounded-none ${
                      userRole === role
                        ? 'bg-slate-900 text-white font-black'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-[10px] text-slate-900 font-bold uppercase font-mono bg-blue-100 px-3 py-2 border-2 border-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
              <span>SECURE_SESSION</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-none text-slate-900 hover:text-blue-700 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-sky-950 border-t border-sky-800 py-3 px-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-150 ${
                  isActive ? 'bg-amber-500 text-sky-950' : 'text-sky-100 hover:bg-sky-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 pb-2 border-t border-sky-800/80 px-4">
            <span className="block text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono mb-2">
              Simulation Persona Status
            </span>
            <div className="flex bg-sky-900 p-1 rounded-xl justify-between">
              {(['Guest', 'Student', 'Admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setIsOpen(false);
                    if (role !== 'Admin' && currentTab === 'admin') {
                      setCurrentTab('home');
                    }
                  }}
                  className={`flex-1 text-center py-2 text-xs rounded-lg font-semibold transition ${
                    userRole === role
                      ? 'bg-amber-500 text-sky-950'
                      : 'text-sky-300 hover:bg-sky-800 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
