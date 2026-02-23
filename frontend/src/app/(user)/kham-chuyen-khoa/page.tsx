import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import AllSpecialties from "./all-specialties";
import Link from "next/link";

export default async function SpecialtiesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const allSpecialties = await fetch(`${apiUrl}/api/specialties`);
  const specialties = await allSpecialties.json();
  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: "Khám chuyên khoa" },
      ]}
    >
      <AllSpecialties specialties={specialties} />
    </MainContentWrapper>
  );
}
