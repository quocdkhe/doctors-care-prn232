import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { DoctorDetail as DoctorDetailType } from "@/src/types/doctor";
import Link from "next/link";
import DoctorDetail from "./doctor-detail";

export default async function DoctorDetailPage({ params }: { params: Promise<{ doctorSlug: string }> }) {
  const { doctorSlug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const doctor: DoctorDetailType = await fetch(
    `${apiUrl}/api/doctors/${doctorSlug}`,
  ).then((res) => res.json());
  return <MainContentWrapper
    breadcrumbItems={[
      { title: <Link href="/">Trang chủ</Link> },
      {
        title: <Link href="/kham-chuyen-khoa">Khám chuyên khoa</Link>,
      },
      { title: <Link href={`/kham-chuyen-khoa/${doctor.specialtySlug}`}>{doctor.specialtyName}</Link> },
      { title: doctor.doctorName },
    ]}>
    <DoctorDetail doctor={doctor} />
  </MainContentWrapper>
}