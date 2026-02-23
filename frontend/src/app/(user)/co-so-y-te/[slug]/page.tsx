import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { ClinicDetail } from "@/src/types/clinic";
import Link from "next/link";
import { DoctorCard } from "@/src/types/doctor";
import ClinicDetailsAndDoctors from "./clinic-details-and-doctors";

export default async function ClinicDetailServerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { slug } = await params;
  const clinic: ClinicDetail = await fetch(
    `${apiUrl}/api/clinics/${slug}/details`,
  ).then((res) => res.json());
  const doctors: DoctorCard[] = await fetch(
    `${apiUrl}/api/doctors?clinicSlug=${slug}`,
  ).then((res) => res.json());
  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: <Link href="/co-so-y-te">Cơ sở y tế</Link> },
        { title: clinic.name },
      ]}
    >
      <ClinicDetailsAndDoctors clinic={clinic} doctors={doctors} />
    </MainContentWrapper>
  );
}
