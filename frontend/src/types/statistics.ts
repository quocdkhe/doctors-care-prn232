export interface AppointmentStatusCount {
  scheduled: number;
  completed: number;
  cancelled: number;
}

export interface Statistics {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentStatusCount: AppointmentStatusCount;
}
