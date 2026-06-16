import React, { useState, useEffect } from 'react';
import { Compass, RefreshCw, AlertCircle, Clock, MapPin, Navigation, ToggleLeft, ToggleRight, Phone, Play, Pause, ChevronRight } from 'lucide-react';
import { BusRoute } from '../types';

interface LiveTrackingProps {
  routes: BusRoute[];
}

interface SimulatedCoordinates {
  [routeNumber: string]: { x: number; y: number; name: string }[];
}

export default function LiveTracking({ routes }: LiveTrackingProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('rt-01');
  const [direction, setDirection] = useState<'Morning' | 'Evening'>('Morning');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<string>('07:45 AM');
  const [progress, setProgress] = useState<number>(0.45); // 0.0 to 1.0 progress along path
  const [speedVal, setSpeedVal] = useState<number>(42);

  // Define SVG grid coordinates representing geographic points of Greater Visakhapatnam to ANITS in Sangivalasa
  const MAP_POINTS = {
    gajuwaka: { x: 80, y: 410, name: "Gajuwaka Junction" },
    kurmannapalem: { x: 40, y: 440, name: "Kurmannapalem" },
    scindia: { x: 140, y: 380, name: "Scindia Office" },
    rtc_complex: { x: 210, y: 340, name: "RTC Complex" },
    maddilapalem: { x: 290, y: 300, name: "Maddilapalem" },
    mvp: { x: 330, y: 260, name: "MVP Double Road" },
    hanumanthawaka: { x: 390, y: 230, name: "Hanumanthawaka" },
    yendada: { x: 440, y: 200, name: "Yendada" },
    madhurawada: { x: 490, y: 170, name: "Madhurawada" },
    kommadi: { x: 530, y: 140, name: "Kommadi" },
    anandapuram: { x: 450, y: 80, name: "Anandapuram" },
    tagarapuvalasa: { x: 590, y: 70, name: "Tagarapuvalasa" },
    vizianagaram: { x: 400, y: 30, name: "Vizianagaram" },
    anits: { x: 680, y: 110, name: "ANITS Campus (Sangivalasa)" }
  };

  // Paths mapping stops for each route index
  const ROUTE_PATHS: SimulatedCoordinates = {
    'rt-01': [
      MAP_POINTS.kurmannapalem,
      MAP_POINTS.gajuwaka,
      MAP_POINTS.scindia,
      MAP_POINTS.rtc_complex,
      MAP_POINTS.maddilapalem,
      MAP_POINTS.hanumanthawaka,
      MAP_POINTS.anits
    ],
    'rt-02': [
      MAP_POINTS.gajuwaka,
      MAP_POINTS.rtc_complex,
      MAP_POINTS.maddilapalem,
      MAP_POINTS.yendada,
      MAP_POINTS.madhurawada,
      MAP_POINTS.anits
    ],
    'rt-03': [
      MAP_POINTS.rtc_complex,
      MAP_POINTS.maddilapalem,
      MAP_POINTS.mvp,
      MAP_POINTS.hanumanthawaka,
      MAP_POINTS.yendada,
      MAP_POINTS.anits
    ],
    'rt-04': [
      MAP_POINTS.kurmannapalem,
      MAP_POINTS.gajuwaka,
      MAP_POINTS.rtc_complex,
      MAP_POINTS.hanumanthawaka,
      MAP_POINTS.anits
    ],
    'rt-05': [
      MAP_POINTS.madhurawada,
      MAP_POINTS.kommadi,
      MAP_POINTS.anandapuram,
      MAP_POINTS.tagarapuvalasa,
      MAP_POINTS.anits
    ],
    'rt-06': [
      MAP_POINTS.vizianagaram,
      MAP_POINTS.tagarapuvalasa,
      MAP_POINTS.anits
    ]
  };

  // Interpolate along coordinates based on progress state
  const getInterpolatedPosition = (routeId: string, progressValue: number) => {
    const list = ROUTE_PATHS[routeId] || ROUTE_PATHS['rt-01'];
    if (list.length === 0) return { x: 0, y: 0 };
    
    // adjust if evening direction
    const pathPoints = direction === 'Morning' ? list : [...list].reverse();

    if (progressValue <= 0) return { x: pathPoints[0].x, y: pathPoints[0].y };
    if (progressValue >= 1) return { x: pathPoints[pathPoints.length - 1].x, y: pathPoints[pathPoints.length - 1].y };

    const segmentCount = pathPoints.length - 1;
    const rawIndex = progressValue * segmentCount;
    const segmentIndex = Math.floor(rawIndex);
    const segmentOffset = rawIndex - segmentIndex;

    const p1 = pathPoints[segmentIndex];
    const p2 = pathPoints[segmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segmentOffset,
      y: p1.y + (p2.y - p1.y) * segmentOffset
    };
  };

  // Auto animation simulation ticking
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          let next = prev + 0.015;
          if (next >= 1.0) next = 0.0;
          return next;
        });

        // vary speeds dynamically corresponding to checkpoints
        setSpeedVal((prev) => {
          const delta = Math.floor(Math.random() * 9) - 4;
          const next = prev + delta;
          return Math.max(15, Math.min(next, 48));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync clocks based on progress bar
  useEffect(() => {
    // scale progress mapping from 07:00 AM to 08:35 AM
    const totalMinutes = 95; // minutes of commute duration
    const currentCommuteMinutes = Math.floor(progress * totalMinutes);
    
    let baseHour = 7;
    let baseMin = 0 + currentCommuteMinutes;
    if (baseMin >= 60) {
      baseHour = 8;
      baseMin = baseMin - 60;
    }
    
    const fmtHr = String(baseHour).padStart(2, '0');
    const fmtMn = String(baseMin).padStart(2, '0');
    setSimTime(`${fmtHr}:${fmtMn} AM`);
  }, [progress]);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const busPosition = getInterpolatedPosition(selectedRouteId, progress);

  // estimate eta
  const getEtaString = () => {
    if (progress >= 0.95) return 'Arrived at destination';
    const remainingFraction = 1.0 - progress;
    const mins = Math.floor(remainingFraction * 45); // roughly max 45 mins left
    return mins > 0 ? `${mins} mins` : 'Reaching campus now';
  };

  const getActiveHubName = () => {
    const list = ROUTE_PATHS[selectedRouteId] || ROUTE_PATHS['rt-01'];
    const idx = Math.floor(progress * list.length);
    return list[Math.min(idx, list.length - 1)].name;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Visual Header Row */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-3xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 px-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-mono font-bold animate-pulse">● FEED ACTIVE</span>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">ANITS GPS Fleet Tracking</h1>
          </div>
          <p className="text-sm text-gray-500">
            Real-time simulated tracking of all college coaches enroute to Bheemunipatnam (Sangivalasa) Campus.
          </p>
        </div>

        {/* Buttons for interactive adjustments */}
        <div className="flex items-center gap-3">
          {/* Direction toggle */}
          <button
            id="sim-direction-btn"
            onClick={() => {
              setDirection(prev => prev === 'Morning' ? 'Evening' : 'Morning');
              setProgress(0);
            }}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center space-x-1.5 transition active:scale-95"
          >
            <span>Run:</span>
            <span className="text-sky-800 uppercase font-black font-mono">{direction} Shift</span>
          </button>

          {/* Pause / Play simulation */}
          <button
            id="sim-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-amber-500 text-sky-950 font-bold hover:bg-amber-600 shadow-sm transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-sky-950" /> : <Play className="w-4 h-4 fill-sky-950" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: SVG Vector Map Representation */}
        <div className="lg:col-span-8 bg-sky-950 border border-sky-900 rounded-[32px] overflow-hidden p-4 shadow-xl relative">
          
          {/* Hologram aesthetic overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_95%,_rgba(14,165,233,0.05)_98%,_rgba(14,165,233,0.1)_100%)] pointer-events-none" />

          {/* Map Compass */}
          <div className="absolute left-6 top-6 bg-sky-900/40 text-sky-300 p-2.5 rounded-2xl border border-sky-800/80 flex items-center space-x-2 text-xs font-mono">
            <Compass className="w-4 h-4 animate-spin-slow text-amber-400" />
            <span>VIZAG REGION GRID</span>
          </div>

          {/* Simulation digital Clock */}
          <div className="absolute right-6 top-6 bg-sky-900/60 text-white font-mono font-black border border-sky-700 rounded-2xl px-3.5 py-1.5 shadow-sm text-sm">
            🕒 {simTime}
          </div>

          {/* Real SVG rendering */}
          <div className="w-full h-[400px] bg-slate-950/80 rounded-2xl border border-sky-900/40 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 480"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Coastline background curve */}
              <path
                d="M 50,480 Q 250,420 380,310 T 520,190 T 700,120 T 800,90"
                fill="none"
                stroke="#0369a1"
                strokeWidth="15"
                strokeLinecap="round"
                className="opacity-15"
              />

              {/* Bay of Bengal Text */}
              <text x="560" y="320" fill="#0284c7" className="text-[11px] uppercase font-mono font-black tracking-widest opacity-20">
                BAY OF BENGAL (COASTAL RIDGE)
              </text>

              {/* Highway NH-16 Main Line */}
              <path
                d="M 30,460 L 90,420 L 150,390 L 220,350 L 300,310 L 400,240 Q 480,180 540,150 T 630,120 L 780,100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 30,460 L 90,420 L 150,390 L 220,350 L 300,310 L 400,240 Q 480,180 540,150 T 630,120 L 780,100"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="4,5"
                className="opacity-60"
              />

              {/* Vizianagaram connection road line */}
              <path
                d="M 400,30 L 450,55 L 590,70 L 680,110"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 400,30 L 450,55 L 590,70 L 680,110"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                className="opacity-55"
              />

              {/* Draw road markings/checkpoints */}
              {Object.entries(MAP_POINTS).map(([key, value]) => {
                const isAnits = key === 'anits';
                return (
                  <g key={key}>
                    <circle
                      cx={value.x}
                      cy={value.y}
                      r={isAnits ? '7' : '4'}
                      className={isAnits ? 'fill-amber-400 stroke-white stroke-[2]' : 'fill-sky-400/90'}
                    />
                    {isAnits && (
                      <circle
                        cx={value.x}
                        cy={value.y}
                        r="12"
                        className="fill-none stroke-amber-400 stroke-[1.5] animate-ping"
                      />
                    )}
                    <text
                      x={value.x + 8}
                      y={value.y + 4}
                      fill={isAnits ? '#fbbf24' : '#94a3b8'}
                      className={`text-[9px] font-mono font-bold ${isAnits ? 'font-black scale-105 shadow-xs' : 'opacity-70'}`}
                    >
                      {value.name.split(' (')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Active Tracking bus marker dot */}
              <g transform={`translate(${busPosition.x}, ${busPosition.y})`} className="cursor-pointer">
                {/* pulsing radar scan */}
                <circle r="14" className="fill-amber-500/25 stroke-amber-400/30 stroke-[1] animate-pulse" />
                <circle r="6" className="fill-amber-400 stroke-sky-950 stroke-[2.5]" />
                {/* Tiny descriptive float marker */}
                <rect x="-24" y="-22" width="48" height="13" rx="3" className="fill-sky-950 border border-sky-800" />
                <text x="0" y="-13" textAnchor="middle" fill="#f59e0b" className="text-[7.5px] font-mono font-black">
                  {activeRoute.routeNumber.toUpperCase()}
                </text>
              </g>

            </svg>
          </div>

          {/* Grid Footer metadata status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 text-xs text-sky-400/85 font-mono gap-2">
            <span>📡 Last GPS ping: 3 seconds ago</span>
            <span>GPS Module ID: ANITS-COACH-77A2</span>
          </div>

        </div>

        {/* Right column: Bus list & tracking details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-xs space-y-5">
            <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase font-mono">Select Bus Tracker</h3>
            
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <button
                    key={route.id}
                    id={`tracking-selector-${route.id}`}
                    onClick={() => {
                      setSelectedRouteId(route.id);
                      setProgress(0.35); // reset with mid-run starter offset
                    }}
                    className={`w-full text-left p-3.5 border rounded-xl flex items-center justify-between transition cursor-pointer text-xs ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/10 font-bold'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-950 text-amber-400' : 'bg-gray-100 text-gray-500'}`}>
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="block text-gray-900 font-extrabold">{route.routeNumber}</span>
                        <span className="block text-[10px] text-gray-400 truncate w-32 font-medium">{route.startPoint}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h4 className="font-sans font-black text-xs text-gray-800 uppercase tracking-widest">
                Active Transit Status
              </h4>

              {/* Transit Details Cards */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-400 font-bold uppercase text-[9px] block">Expected Active ETA</span>
                    <span className="font-black text-sky-950 text-sm leading-none block">{getEtaString()}</span>
                  </div>
                  <div className="p-2.5 bg-sky-100 text-sky-900 rounded-xl">
                    <Clock className="w-4 h-4 text-sky-700" />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-400 font-bold uppercase text-[9px] block">Current Velocity</span>
                    <span className="font-black text-emerald-600 text-sm leading-none block font-mono">{speedVal} km/h</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Navigation className="w-4 h-4 text-emerald-600 rotate-45" />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                  <div className="space-y-1">
                    <span className="text-gray-400 font-bold uppercase text-[9px] block">Nearing Hub Checkpoint</span>
                    <span className="font-black text-gray-800 text-sm leading-none block">{getActiveHubName()}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <MapPin className="w-4 h-4 text-amber-650" />
                  </div>
                </div>
              </div>

              {/* Driver Quick Dial block */}
              <div className="bg-sky-950 text-white rounded-2xl p-4 flex justify-between items-center gap-2">
                <div>
                  <span className="text-[8px] text-sky-300 font-bold uppercase block tracking-wider font-mono">Assigned Pilot</span>
                  <span className="font-extrabold text-xs">{activeRoute.driverName}</span>
                </div>
                <a
                  href={`tel:${activeRoute.driverPhone}`}
                  className="bg-amber-500 hover:bg-amber-600 text-sky-950 p-2 rounded-xl transition duration-150 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-sky-950 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
