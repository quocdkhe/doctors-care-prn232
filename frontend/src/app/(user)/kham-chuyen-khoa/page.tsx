import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import AllSpecialties from "./all-specialties";
import Link from "next/link";
import { Specialty } from "@/src/types/specialty";

export default async function SpecialtiesPage() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const allSpecialties = await fetch(`${apiUrl}/api/specialties`, {
    next: { tags: ["specialties"] },
  });
  const specialties: Specialty[] = await allSpecialties.json();
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
