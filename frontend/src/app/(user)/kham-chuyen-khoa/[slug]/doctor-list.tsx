import DoctorCardItem from "@/src/components/doctor/doctor-card-item";
import { DoctorCard } from "@/src/types/doctor";

export default async function DoctorList({
  doctors,
  specialtySlug,
}: {
  doctors: DoctorCard[];
  specialtySlug: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {doctors?.length > 0 ? doctors.map((doctor) => (
        <DoctorCardItem
          key={doctor.slug}
          doctor={doctor}
          specialtySlug={specialtySlug}
        />
      )) : (
        <div className="text-center text-gray-500">Không tìm thấy bác sĩ</div>
      )}
    </div>
  );
}
