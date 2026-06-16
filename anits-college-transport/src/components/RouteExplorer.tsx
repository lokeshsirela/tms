import React, { useState } from 'react';
import { Bus, MapPin, Search, Phone, Users, Clock, ArrowRight, CheckCircle2, DollarSign, User } from 'lucide-react';
import { BusRoute } from '../types';

interface RouteExplorerProps {
  routes: BusRoute[];
  setCurrentTab: (tab: string) => void;
  setSelectedRouteIdForRegistration: (id: string) => void;
}

export default function RouteExplorer({ routes, setCurrentTab, setSelectedRouteIdForRegistration }: RouteExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>('rt-01');

  // Filter routes based on search (by Route ID, name, or stop names)
  const filteredRoutes = routes.filter((route) => {
    const isNumMatch = route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const isNameMatch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase());
    const isStopMatch = route.stops.some(stop => stop.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return isNumMatch || isNameMatch || isStopMatch;
  });

  const handleRegisterOnRoute = (route: BusRoute) => {
    setSelectedRouteIdForRegistration(route.id);
    setCurrentTab('pass');
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header and Search Index bar */}
      <div className="bg-white border-4 border-slate-900 p-6 rounded-none shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display uppercase">Bus Routes & Rosters</h1>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wide">
            View detailed college timetables, boarding list, and operator contacts.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-slate-900 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            id="route-search-input"
            type="text"
            className="w-full text-xs bg-slate-50 border-2 border-slate-900 rounded-none pl-11 pr-4 py-3.5 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:bg-white transition-all font-black uppercase tracking-wider font-mono"
            placeholder="Search boarding area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Routes and Timeline details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left list of Routes */}
        <div className="lg:col-span-5 space-y-3.5">
          <span className="text-xs font-black text-slate-400 font-mono tracking-widest uppercase block mb-1">
            AVAILABLE LINES ({filteredRoutes.length})
          </span>

          {filteredRoutes.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 text-center py-10 px-4 rounded-none">
              <span className="text-4xl">🔍</span>
              <h3 className="font-black text-slate-900 mt-2 text-xs uppercase font-mono">No matching routes</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">Try searching for NAD, RTC, Gajuwaka, or Pendurthi.</p>
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const seatsAvailable = route.capacity - route.filledSeats;
              const isExpanded = expandedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  id={`route-list-item-${route.id}`}
                  onClick={() => setExpandedRouteId(route.id)}
                  className={`bg-white border-2 text-left p-5 rounded-none cursor-pointer transition shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
                    isExpanded
                      ? 'bg-blue-50 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                      : 'border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="bg-slate-900 text-white px-2.5 py-1 rounded-none text-[10px] font-mono font-black tracking-wider">
                      {route.routeNumber.toUpperCase()}
                    </div>
                    {/* Seat status badge */}
                    <div className={`text-[9px] uppercase font-mono font-black border px-2 py-0.5 rounded-none ${
                      seatsAvailable > 5 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-600' 
                        : seatsAvailable > 0
                        ? 'bg-amber-50 text-amber-800 border-amber-600'
                        : 'bg-red-100 text-red-800 border-red-600'
                    }`}>
                      {seatsAvailable > 0 ? `${seatsAvailable} Seats Free` : 'Route Housefull'}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mt-3 tracking-snug uppercase">
                    {route.routeName}
                  </h3>

                  <div className="flex items-center space-x-3.5 text-[10px] text-slate-500 mt-3 font-mono font-black uppercase">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
                      <span>Starts: {route.stops[0]?.time}</span>
                    </div>
                    <div className="flex items-center space-x-1 border-l-2 border-slate-300 pl-3.5">
                      <Users className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
                      <span>{route.capacity} seats</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 font-extrabold text-slate-400 uppercase font-mono">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Driver: {route.driverName}</span>
                    </div>
                    <span className="text-blue-700 font-extrabold flex items-center space-x-0.5 uppercase tracking-wide">
                      <span>View Stops</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right timeline details for selected Route */}
        <div className="lg:col-span-7">
          {expandedRouteId ? (() => {
            const selectedRoute = routes.find(r => r.id === expandedRouteId);
            if (!selectedRoute) return null;
            return (
              <div className="bg-white border-2 border-slate-900 rounded-none p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
                {/* Route Header Info */}
                <div className="border-b-2 border-slate-200 pb-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-slate-900 text-white font-mono font-black text-xs px-3 py-1.5 rounded-none uppercase tracking-widest">
                      🚌 {selectedRoute.routeNumber.toUpperCase()} ROUTE DETAILED PATH
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">Coach Plate: {selectedRoute.busNumber.toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display uppercase">{selectedRoute.routeName}</h2>
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 pt-1 text-[11px] text-slate-500 font-extrabold uppercase font-mono">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-slate-900" />
                      <span>Starts from: <strong className="text-slate-950 font-black">{selectedRoute.startPoint.toUpperCase()}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 stroke-[2.5]" />
                      <span>ANITS arrival: <strong className="text-slate-950 font-black">08:35 AM</strong></span>
                    </div>
                  </div>
                </div>

                {/* Driver & Bus Info Box */}
                <div className="bg-slate-55 bg-slate-50 border-2 border-slate-900 rounded-none p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-none bg-slate-900 text-white flex items-center justify-center font-black text-sm border-2 border-slate-900">
                      {selectedRoute.driverName.split(' ')[1]?.[0] || selectedRoute.driverName[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs md:text-sm leading-none uppercase">{selectedRoute.driverName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Assigned Coach Operator • 8+ Yrs Exp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${selectedRoute.driverPhone}`}
                      className="flex-1 sm:flex-none bg-white hover:bg-slate-50 text-slate-950 border-2 border-slate-900 font-black px-4 py-2.5 rounded-none text-xs flex items-center justify-center space-x-1.5 transition uppercase tracking-wider"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
                      <span>Call driver</span>
                    </a>
                    <button
                      id={`apply-route-register-btn-${selectedRoute.routeNumber}`}
                      onClick={() => handleRegisterOnRoute(selectedRoute)}
                      className="flex-1 sm:flex-none bg-blue-705 bg-blue-700 hover:bg-slate-900 text-white border-2 border-slate-900 font-black px-5 py-2.5 rounded-none text-xs flex items-center justify-center space-x-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 duration-100 uppercase tracking-widest cursor-pointer"
                    >
                      <span>Join Route</span>
                    </button>
                  </div>
                </div>

                {/* Vertical Boarding Timeline list */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">
                    Boarding Terminals & Timings
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-900">
                    {selectedRoute.stops.map((stop, index) => {
                      const isFirst = index === 0;
                      const isLast = index === selectedRoute.stops.length - 1;
                      return (
                        <div key={stop.id} id={`stop-timeline-node-${stop.id}`} className="relative">
                          {/* Dot pointer indicator */}
                          <div className={`absolute -left-[21px] top-1.5 w-[13px] h-[13px] rounded-none border-2 bg-white transition ${
                            isLast
                              ? 'border-red-600 bg-red-100 ring-4 ring-red-50'
                              : isFirst
                              ? 'border-emerald-600 bg-emerald-100 ring-4 ring-emerald-50'
                              : 'border-slate-900'
                          }`} />

                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className={`font-extrabold text-sm uppercase tracking-wide ${isLast ? 'text-slate-900 font-black' : 'text-slate-700'}`}>
                                {stop.name}
                              </h4>
                              {isLast ? (
                                <span className="text-[9px] bg-blue-100 text-blue-800 font-mono font-black border border-blue-300 px-1.5 py-0.5 rounded-none mt-1 inline-block uppercase tracking-wider">
                                  CAMPUS TERMINAL
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5 font-mono uppercase tracking-wide">
                                  Pickup stop #{index + 1}
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-black text-slate-900 bg-white border-2 border-slate-900 rounded-none px-2.5 py-1 font-mono flex items-center space-x-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                <Clock className="w-3 h-3 text-blue-700 inline mr-0.5 stroke-[2.5]" />
                                <span>{stop.time}</span>
                              </div>
                              {stop.fee > 0 && (
                                <span className="text-[10px] text-emerald-700 font-extrabold block mt-2 font-mono uppercase tracking-widest">
                                  ₹{stop.fee.toLocaleString('en-IN')}/YR
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="text-[10px] text-red-700 bg-red-50 border-2 border-slate-900 rounded-none p-3.5 flex items-start space-x-1.5 font-mono uppercase tracking-wide">
                  <span className="text-sm">💡</span>
                  <p className="leading-snug">
                    Make sure to arrive at your preferred pickup location at least 5 minutes before the scheduled pickup timing. Bus doors close instantly to ensure arrival at ANITS college campus beforehand by 08:35 AM.
                  </p>
                </div>
              </div>
            );
          })() : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 text-center py-20 px-4 rounded-none flex flex-col items-center justify-center">
              <Bus className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <h3 className="font-extrabold text-slate-400 mt-3 text-xs uppercase font-mono tracking-wider">Explore details</h3>
              <p className="text-[10px] text-slate-400 max-w-sm mt-1 uppercase font-mono tracking-wider">Select any bus route on the left side panel to view detailed timings, driver details and stop-by-stop fee structure schedules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
