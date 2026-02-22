import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { SpecialtyInfo } from "@/src/types/specialty";
import Link from "next/link";
import SpecialtyDetail from "./specialty-detail";
import { DoctorCard } from "@/src/types/doctor";
import DoctorList from "./doctor-list";
import SpecialtyFilter from "./specialty-filter";

export default async function SpecialtyDetailsAndDoctorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { slug } = await params;
  const { city, date } = await searchParams;
  const specialty: SpecialtyInfo = await fetch(
    `${apiUrl}/api/specialties/${slug}/details`,
  ).then((res) => res.json());

  const doctors: DoctorCard[] = await fetch(
    `${apiUrl}/api/doctors?specialtySlug=${slug}&city=${city || ""}&date=${date || ""}`,
  ).then((res) => res.json());
  return (
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
      <DoctorList doctors={doctors} specialtySlug={slug} />
    </MainContentWrapper>
  );
}
