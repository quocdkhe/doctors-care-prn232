import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { SpecialtyInfo } from "@/src/types/specialty";
import Link from "next/link";
import SpecialtyDetail from "./specialty-detail";
import { DoctorCard } from "@/src/types/doctor";
import DoctorList from "./doctor-list";

export default async function SpecialtyDetailsAndDoctorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const { slug } = await params;
  const { city, date } = await searchParams;
  const specialty: SpecialtyInfo = await fetch(
    `${apiUrl}/api/specialties/${slug}/details`,
    { next: { tags: ["specialties", `specialty-${slug}`] } },
  ).then((res) => res.json());

  const doctors: DoctorCard[] = await fetch(
    `${apiUrl}/api/doctors?specialtySlug=${slug}&city=${city || ""}&date=${date || ""}`,
    { next: { revalidate: 0 } },
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
      <DoctorList doctors={doctors} />
    </MainContentWrapper>
  );
}
