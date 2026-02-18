import DoctorCardItem from "@/src/components/doctor/doctor-card-item";
import { DoctorCard } from "@/src/types/doctor";

export default async function DoctorList({
  doctors,
}: {
  doctors: DoctorCard[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {doctors.map((doctor) => (
        <DoctorCardItem key={doctor.slug} doctor={doctor} />
      ))}
    </div>
  );
}
