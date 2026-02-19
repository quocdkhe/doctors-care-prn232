import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import AllClinic from "./all-clinic";
import Link from "next/link";

export default async function ClinicsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const allClinics = await fetch(`${apiUrl}/api/clinics`);
  const clinics = await allClinics.json();
  return (
    <>
      <MainContentWrapper breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: "Cơ sở y tế" },
      ]}>
        <AllClinic clinics={clinics} />
      </MainContentWrapper>
    </>
  );
}