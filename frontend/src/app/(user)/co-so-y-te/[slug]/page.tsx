import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { ClinicDetail } from "@/src/types/clinic";
import Link from "next/link";

export default async function ClinicDetailServerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { slug } = await params;
  const clinic: ClinicDetail = await fetch(
    `${apiUrl}/api/clinics/${slug}`,
  ).then((res) => res.json());
  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: <Link href="/co-so-y-te">Cơ sở y tế</Link> },
        { title: clinic.name },
      ]}
    >
      <h1>Clinic Detail</h1>
    </MainContentWrapper>
  );
}
