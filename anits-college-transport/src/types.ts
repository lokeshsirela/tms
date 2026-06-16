export interface BoardingPoint {
  id: string;
  name: string;
  time: string;
  fee: number; // Annual fee in INR
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string; // Typically ANITS College (Sangivalasa)
  capacity: number;
  filledSeats: number;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  stops: BoardingPoint[];
}

export interface BusPass {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  department: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: string;
  rollNumber: string;
  phoneNumber: string;
  routeId: string;
  routeNumber: string;
  boardingPointId: string;
  boardingPointName: string;
  feeAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Processing';
  applicationStatus: 'Pending' | 'Approved' | 'Rejected';
  photoUrl?: string;
  paymentReceiptUrl?: string;
  transactionId?: string;
  appliedDate: string;
  validUntil: string;
  qrCodeData?: string;
}

export interface Complaint {
  id: string;
  studentName: string;
  rollNumber: string;
  routeNumber: string;
  category: 'Bus Delay' | 'Driver Behavior' | 'Maintenance' | 'Crowding' | 'Other';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  adminReply?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Alert' | 'Schedule Change' | 'General' | 'Holiday';
  routeAffected?: string; // 'All' or specific route number
  important: boolean;
}

export type UserRole = 'Student' | 'Admin' | 'Guest';

export interface RouteStatus {
  routeId: string;
  currentLatOffset: number; // 0 to 1 progress on route
  currentStopId: string;
  status: 'In Transit' | 'At Stop' | 'Completed' | 'Idle';
  speed: number;
}
