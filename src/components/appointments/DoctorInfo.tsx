function DoctorInfo({ doctorId }: { doctorId: string }) {
  // Mock doctor data for now
  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      speciality: "General Dentistry",
      phone: "+1 (555) 123-4567",
      isActive: true,
      appointmentCount: 15
    },
    {
      id: "2", 
      name: "Dr. Michael Chen",
      speciality: "Orthodontics",
      phone: "+1 (555) 234-5678",
      isActive: true,
      appointmentCount: 8
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      speciality: "Oral Surgery",
      phone: "+1 (555) 345-6789",
      isActive: false,
      appointmentCount: 12
    }
  ];

  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-primary">
          {doctor.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="font-medium">{doctor.name}</p>
        <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
      </div>
    </div>
  );
}

export default DoctorInfo;