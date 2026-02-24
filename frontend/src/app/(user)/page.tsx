import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import ClinicCarousel from "@/src/components/landing/clinic-carousel";
import Hero from "@/src/components/landing/hero";
import SpecialtyCarousel from "@/src/components/landing/specialty-carousel";
import TopDoctorCarousel from "@/src/components/landing/top-doctor-carousel";

import Link from "next/link";
import { Button } from "antd";
import { Clinic } from "@/src/types/clinic";
import { Specialty } from "@/src/types/specialty";
import { DoctorTop } from "@/src/types/doctor";

export default async function LandingPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const specialties: Specialty[] = await fetch(
    `${apiUrl}/api/specialties`,
  ).then((res) => res.json());

  const clinics: Clinic[] = await fetch(`${apiUrl}/api/clinics`).then((res) =>
    res.json(),
  );

  const topDoctors: DoctorTop[] = await fetch(`${apiUrl}/api/doctors/top`).then(
    (res) => res.json(),
  );

  return (
    <>
      <Hero />
      <MainContentWrapper>
        <div className="flex justify-between items-center px-8">
          <h2 className="text-2xl font-bold">Chuyên khoa</h2>
          <Link href="/kham-chuyen-khoa">
            <Button type="primary" size="large">
              Xem thêm
            </Button>
          </Link>
        </div>
        <SpecialtyCarousel specialties={specialties} />

        <div className="flex justify-between items-center px-8">
          <h2 className="text-2xl font-bold">Cơ sở y tế</h2>
          <Link href="/co-so-y-te">
            <Button type="primary" size="large">
              Xem thêm
            </Button>
          </Link>
        </div>
        <ClinicCarousel clinics={clinics} />
        <TopDoctorCarousel topDoctors={topDoctors} />
      </MainContentWrapper>
    </>
  );
}
