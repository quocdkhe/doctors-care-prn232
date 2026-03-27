import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import ClinicCarousel from "@/src/components/landing/clinic-carousel";
import Hero from "@/src/components/landing/hero";
import SpecialtyCarousel from "@/src/components/landing/specialty-carousel";
import TopDoctorCarousel from "@/src/components/landing/top-doctor-carousel";

import Link from "next/link";
import { Button } from "antd";
import { Metadata } from "next";
import { Clinic } from "@/src/types/clinic";
import { Specialty } from "@/src/types/specialty";
import { DoctorTop } from "@/src/types/doctor";

export const metadata: Metadata = {
  title: "Trang chủ | Doctors Care",
  description: "Doctors Care - Nền tảng y tế chăm sóc sức khỏe toàn diện. Đặt lịch khám với các chuyên gia đầu ngành, tìm kiếm cơ sở y tế uy tín.",
  keywords: ["Doctors Care", "đặt lịch khám", "bác sĩ giỏi", "cơ sở y tế", "chuyên khoa"],
};

export default async function LandingPage() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  console.log("Fetching data from", apiUrl);

  // Parallelize data fetching to eliminate waterfalls (Best Practice 1.4)
  const [specialties, clinics, topDoctors] = await Promise.all([
    fetch(`${apiUrl}/api/specialties`, { next: { tags: ["specialties"] } }).then((res) => res.json()),
    fetch(`${apiUrl}/api/clinics`, { next: { tags: ["clinics"] } }).then((res) => res.json()),
    fetch(`${apiUrl}/api/doctors/top`, { next: { tags: ["top-doctors"] } }).then((res) => res.json()),
  ]);

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
