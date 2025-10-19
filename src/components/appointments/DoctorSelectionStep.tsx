import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface DoctorSelectionStepProps {
  selectedDentistId: string | null;
  onSelectDentist: (dentistId: string) => void;
  onContinue: () => void;
}

export default function DoctorSelectionStep({
  selectedDentistId,
  onSelectDentist,
  onContinue,
}: DoctorSelectionStepProps) {
  // Mock doctors data for now
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Dentist</h2>
        <p className="text-muted-foreground">Select a dentist for your appointment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedDentistId === doctor.id
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectDentist(doctor.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                      doctor.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{doctor.name}</CardTitle>
                  <CardDescription className="truncate">{doctor.speciality}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="truncate">{doctor.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="truncate">Dental Clinic</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-xs text-muted-foreground">(24 reviews)</span>
                  </div>
                  <Badge variant={doctor.isActive ? "default" : "secondary"}>
                    {doctor.isActive ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {doctor.appointmentCount} appointments this month
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onContinue} disabled={!selectedDentistId}>
          Continue
        </Button>
      </div>
    </div>
  );
}