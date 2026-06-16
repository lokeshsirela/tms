import { BusRoute, Announcement, Complaint } from '../types';

export const INITIAL_ROUTES: BusRoute[] = [
  {
    id: 'rt-01',
    routeNumber: 'Route 01',
    routeName: 'Gajuwaka to ANITS (via Convent, Scindia)',
    startPoint: 'Gajuwaka Junction',
    endPoint: 'ANITS College',
    capacity: 60,
    filledSeats: 48,
    driverName: 'K. Ramana Rao',
    driverPhone: '+91 94401 23456',
    busNumber: 'AP 31 TT 1001',
    stops: [
      { id: 'st-01-1', name: 'Gajuwaka Depot', time: '07:00 AM', fee: 32000 },
      { id: 'st-01-2', name: 'Kurmannapalem X Road', time: '07:10 AM', fee: 33000 },
      { id: 'st-01-3', name: 'Scindia/Malkapuram', time: '07:25 AM', fee: 30000 },
      { id: 'st-01-4', name: 'Convent Junction', time: '07:35 AM', fee: 28000 },
      { id: 'st-01-5', name: 'Lighthouse/Town Hall', time: '07:42 AM', fee: 28000 },
      { id: 'st-01-6', name: 'Maddilapalem (Main Road)', time: '07:55 AM', fee: 26050 },
      { id: 'st-01-7', name: 'Hanumanthawaka Junction', time: '08:05 AM', fee: 24000 },
      { id: 'st-01-8', name: 'ANITS College (Sangivalasa)', time: '08:35 AM', fee: 0 }
    ]
  },
  {
    id: 'rt-02',
    routeNumber: 'Route 02',
    routeName: 'Steel Plant Sector-4 to ANITS (via NAD, Maddilapalem)',
    startPoint: 'Steel Plant Sector-4',
    endPoint: 'ANITS College',
    capacity: 60,
    filledSeats: 52,
    driverName: 'S. Appa Rao',
    driverPhone: '+91 98480 98765',
    busNumber: 'AP 31 TT 1005',
    stops: [
      { id: 'st-02-1', name: 'Sector 4 Shopping Complex', time: '06:50 AM', fee: 34000 },
      { id: 'st-02-2', name: 'Gajuwaka High School Road', time: '07:05 AM', fee: 32000 },
      { id: 'st-02-3', name: 'NAD Junction (Flyover side)', time: '07:20 AM', fee: 30000 },
      { id: 'st-02-4', name: 'Kancharapalem Mettu', time: '07:30 AM', fee: 28000 },
      { id: 'st-02-5', name: 'RTC Complex (In front of Hotel)', time: '07:42 AM', fee: 27000 },
      { id: 'st-02-6', name: 'Maddilapalem Bus Station', time: '07:50 AM', fee: 26050 },
      { id: 'st-02-7', name: 'Yendada Junction', time: '08:02 AM', fee: 23000 },
      { id: 'st-02-8', name: 'Madhurawada (Car Shed)', time: '08:12 AM', fee: 21000 },
      { id: 'st-02-9', name: 'ANITS College (Sangivalasa)', time: '08:40 AM', fee: 0 }
    ]
  },
  {
    id: 'rt-03',
    routeNumber: 'Route 03',
    routeName: 'RTC Complex to ANITS (via MVP Colony, Yendada)',
    startPoint: 'RTC Complex',
    endPoint: 'ANITS College',
    capacity: 55,
    filledSeats: 41,
    driverName: 'Y. Srinivasa Rao',
    driverPhone: '+91 94901 54321',
    busNumber: 'AP 31 UT 2314',
    stops: [
      { id: 'st-03-1', name: 'RTC Complex (Anand Theatre Complex)', time: '07:30 AM', fee: 27000 },
      { id: 'st-03-2', name: 'Satyam Junction', time: '07:35 AM', fee: 27000 },
      { id: 'st-03-3', name: 'Gurudwara Junction', time: '07:40 AM', fee: 27000 },
      { id: 'st-03-4', name: 'Maddilapalem (Ashilmetta road)', time: '07:48 AM', fee: 26050 },
      { id: 'st-03-5', name: 'MVP Double Road (Rythu Bazar)', time: '07:55 AM', fee: 25000 },
      { id: 'st-03-6', name: 'MVP Samata College', time: '08:00 AM', fee: 25000 },
      { id: 'st-03-7', name: 'Hanumanthawaka', time: '08:05 AM', fee: 24000 },
      { id: 'st-03-8', name: 'Yendada (Highway)', time: '08:12 AM', fee: 23000 },
      { id: 'st-03-9', name: 'ANITS College (Sangivalasa)', time: '08:35 AM', fee: 0 }
    ]
  },
  {
    id: 'rt-04',
    routeNumber: 'Route 04',
    routeName: 'Pendurthi to ANITS (via Vepagunta, Gopalapatnam)',
    startPoint: 'Pendurthi Junction',
    endPoint: 'ANITS College',
    capacity: 58,
    filledSeats: 55,
    driverName: 'P. Krishna Murthy',
    driverPhone: '+91 91605 55443',
    busNumber: 'AP 31 TU 7722',
    stops: [
      { id: 'st-04-1', name: 'Pendurthi Railway Station Road', time: '07:00 AM', fee: 33000 },
      { id: 'st-04-2', name: 'Vepagunta Junction', time: '07:10 AM', fee: 31000 },
      { id: 'st-04-3', name: 'Gopalapatnam Petrol Bunk', time: '07:20 AM', fee: 31000 },
      { id: 'st-04-4', name: 'NAD Junction (Highway Side)', time: '07:30 AM', fee: 30000 },
      { id: 'st-04-5', name: 'Kancharapalem Urvasi Junction', time: '07:40 AM', fee: 28000 },
      { id: 'st-04-6', name: 'Gurudwara Gate', time: '07:48 AM', fee: 27000 },
      { id: 'st-04-7', name: 'Hanumanthawaka Petrol Pump', time: '08:03 AM', fee: 24000 },
      { id: 'st-04-8', name: 'ANITS College (Sangivalasa)', time: '08:35 AM', fee: 0 }
    ]
  },
  {
    id: 'rt-05',
    routeNumber: 'Route 05',
    routeName: 'Madhurawada to ANITS (via PM Palem, Kommadi)',
    startPoint: 'PM Palem Last Bus Stop',
    endPoint: 'ANITS College',
    capacity: 55,
    filledSeats: 34,
    driverName: 'Ch. Satyanarayana',
    driverPhone: '+91 88970 44556',
    busNumber: 'AP 31 YY 4004',
    stops: [
      { id: 'st-05-1', name: 'PM Palem (Last Bus Stop)', time: '07:45 AM', fee: 22000 },
      { id: 'st-05-2', name: 'PM Palem (Stadium side)', time: '07:50 AM', fee: 22000 },
      { id: 'st-05-3', name: 'Madhurawada High School Junction', time: '07:58 AM', fee: 21000 },
      { id: 'st-05-4', name: 'Kommadi Junction', time: '08:05 AM', fee: 20000 },
      { id: 'st-05-5', name: 'Marikavalasa Colony', time: '08:12 AM', fee: 18000 },
      { id: 'st-05-6', name: 'Anandapuram Junction', time: '08:22 AM', fee: 17000 },
      { id: 'st-05-7', name: 'Tagarapuvalasa Junction', time: '08:33 AM', fee: 12000 },
      { id: 'st-05-8', name: 'ANITS College (Sangivalasa)', time: '08:42 AM', fee: 0 }
    ]
  },
  {
    id: 'rt-06',
    routeNumber: 'Route 06',
    routeName: 'Vizianagaram to ANITS (via Denkada, Jonnada)',
    startPoint: 'Vizianagaram RTC Complex',
    endPoint: 'ANITS College',
    capacity: 60,
    filledSeats: 58,
    driverName: 'M. Hari Kumar',
    driverPhone: '+91 76740 99881',
    busNumber: 'AP 35 UU 5643',
    stops: [
      { id: 'st-06-1', name: 'Vizianagaram Clock Tower', time: '07:15 AM', fee: 29000 },
      { id: 'st-06-2', name: 'Vizianagaram RTC Complex Road', time: '07:22 AM', fee: 29000 },
      { id: 'st-06-3', name: 'Denkada Junction', time: '07:35 AM', fee: 24000 },
      { id: 'st-06-4', name: 'Jonnada Outposts', time: '07:48 AM', fee: 20000 },
      { id: 'st-06-5', name: 'Tagarapuvalasa Bus Stand', time: '08:10 AM', fee: 12000 },
      { id: 'st-06-6', name: 'Sangivalasa Junction', time: '08:20 AM', fee: 10000 },
      { id: 'st-06-7', name: 'ANITS College Campus', time: '08:30 AM', fee: 0 }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'University Examinations Bus Schedule Extension',
    content: 'In view of the upcoming AU Semester Exams starting from June 20th, college buses will have an additional return service at 04:30 PM. All route buses will run regularly as scheduled in the morning, and two separate return batches (02:45 PM and 04:30 PM) will be made available. Please plan your commute accordingly.',
    date: '2026-06-15',
    category: 'General',
    important: true
  },
  {
    id: 'ann-2',
    title: 'Route 04 (Pendurthi) Diverted for Road Works',
    content: 'Due to major pipeline road construction near Gopalapatnam Highway, Route 04 bus will be diverted via Vepagunta Bypass Road. Boarding points from Gopalapatnam Petrol Bunk to NAD Junction will experience a slight delay of 5-10 minutes. Students are suggested to reach their boarding points by 07:15 AM instead of 07:20 AM to ensure smooth boarding.',
    date: '2026-06-14',
    category: 'Schedule Change',
    routeAffected: 'Route 04',
    important: true
  },
  {
    id: 'ann-3',
    title: 'Maintenance Advisory - Bus Pass RFID Verification',
    content: 'Verification of college Bus Passes utilizing QR Codes/RFID will be conducted by physical checking assistants from June 18th to June 22nd. Students who have not received or renewed their physical/digital bus passes are strictly advised to download their passes from this portal or visit the Transport Cell at Room No. G-12 (Main Block) to settle pending dues.',
    date: '2026-06-12',
    category: 'Alert',
    important: false
  },
  {
    id: 'ann-4',
    title: 'Holiday Notice - EID Milad-un-Nabi',
    content: 'The college will remain closed on June 17th, 2026 in observance of EID Milad-un-Nabi. All transportation routes will remain suspended. Services will resume standard operations on June 18th.',
    date: '2026-06-16',
    category: 'Holiday',
    important: false
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-1',
    studentName: 'N. Saiteja',
    rollNumber: '321126510045',
    routeNumber: 'Route 02',
    category: 'Bus Delay',
    subject: 'Delay at RTC Complex boarding point',
    description: 'The bus is consistently arriving at least 15 minutes late (07:57 AM instead of scheduled 07:42 AM) at RTC Complex. Due to this, we are missing the first ten minutes of our morning lab hours.',
    status: 'In Progress',
    date: '2026-06-14',
    adminReply: 'We have noticed this issue. The driver report indicates traffic congestion at satyam junction due to flyover adjustments. We are rescheduling the timing from Sector 4 to 10 minutes earlier.'
  },
  {
    id: 'comp-2',
    studentName: 'P. Jahnavi',
    rollNumber: '322126512089',
    routeNumber: 'Route 01',
    category: 'Crowding',
    subject: 'Extreme rush near Hanumanthawaka boarding point',
    description: 'Buses are fully crowded by the time they reach Hanumanthawaka. Many girls find it difficult to stand in the footboard area of Route 01. Please add extra seats or another mini-bus for MVP-Hanumanthawaka region.',
    status: 'Open',
    date: '2026-06-15'
  },
  {
    id: 'comp-3',
    studentName: 'V. Ajay Kumar',
    rollNumber: '320126520112',
    routeNumber: 'Route 03',
    category: 'Maintenance',
    subject: 'Broken backrest on Seat 14 & 15',
    description: 'The plastic backrest of seat 14 on left side row in Route 03 is broken, exposing sharp metal edges which could damage clothes or cause scratches. Please have it fixed during weekends.',
    status: 'Resolved',
    date: '2026-06-10',
    adminReply: 'The maintenance team has replaced the broken backrest with new cushioning. Seats 14 and 15 are now fully repaired and verified fit for student seating.'
  }
];

export const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Chemical Engineering',
  'Civil Engineering'
];

export const VIZAG_FEE_SLABS = [
  { region: 'Bheemunipatnam / Sangivalasa Local', fee: 10000 },
  { region: 'Tagarapuvalasa / Anandapuram / Chittivalasa', fee: 12000 },
  { region: 'Madhurawada / PM Palem / Kommadi / Yendada', fee: 21000 },
  { region: 'Hanumanthawaka / MVP Colony / Maddilapalem', fee: 25000 },
  { region: 'Vizianagaram Areas (Clock Tower / Denkada)', fee: 29000 },
  { region: 'Sujatha Nagar / Pendurthi / RTC Complex / Gurudwara', fee: 27000 },
  { region: 'Gajuwaka / Kurmannapalem / Steel Plant Sectors', fee: 32000 }
];
