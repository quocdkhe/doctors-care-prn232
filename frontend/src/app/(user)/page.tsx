import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import ClinicCarousel from "@/src/components/landing/clinic-carousel";
import Hero from "@/src/components/landing/hero";
import SpecialtyCarousel from "@/src/components/landing/specialty-carousel";

import Link from "next/link";
import { Button } from "antd";

export default async function LandingPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const allSpecialties = await fetch(`${apiUrl}/api/specialties`);
  const specialties = await allSpecialties.json();
  const allClinics = await fetch(`${apiUrl}/api/clinics`);
  const clinics = await allClinics.json();
  return (
    <>
      <Hero />
      <MainContentWrapper>
        <div className="flex justify-between items-center px-8">
          <h2 className="text-2xl font-bold">Chuyên khoa</h2>
          <Link href="/kham-chuyen-khoa">
            <Button type="primary" size="large">Xem thêm</Button>
          </Link>
        </div>
        <SpecialtyCarousel specialties={specialties} />

        <div className="flex justify-between items-center px-8">
          <h2 className="text-2xl font-bold">Cơ sở y tế</h2>
          <Link href="/co-so-y-te">
            <Button type="primary" size="large">Xem thêm</Button>
          </Link>
        </div>
        <ClinicCarousel clinics={clinics} />
      </MainContentWrapper>
    </>
  );
}
