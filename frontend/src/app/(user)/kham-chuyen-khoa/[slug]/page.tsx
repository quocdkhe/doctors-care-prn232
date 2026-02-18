import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { SpecialtyInfo } from "@/src/types/specialty";
import Link from "next/link";
import SpecialtyDetail from "./specialty-detail";
import { DoctorCard } from "@/src/types/doctor";
import DoctorList from "./doctor-list";

export default async function SpecialtyDetailsAndDoctorsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialty: SpecialtyInfo = await fetch(
    `http://localhost:5000/api/specialties/${slug}/doctors`,
  ).then((res) => res.json());
  const doctors: DoctorCard[] = await fetch(
    `http://localhost:5000/api/doctors?specialtySlug=${slug}`,
  ).then((res) => res.json());
  return (
    <>
      <MainContentWrapper
        breadcrumbItems={[
          { title: <Link href="/">Trang chủ</Link> },
          {
            title: <Link href="/kham-chuyen-khoa">Khám chuyên khoa</Link>,
          },
          { title: specialty.specialtyName },
        ]}
      >
        <SpecialtyDetail specialty={specialty} />
        <DoctorList doctors={doctors} />
      </MainContentWrapper>
    </>
  );
}
