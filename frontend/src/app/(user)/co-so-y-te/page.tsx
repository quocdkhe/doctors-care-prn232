import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import AllClinic from "./all-clinic";
import Link from "next/link";

export default async function ClinicsPage() {
  const allClinics = await fetch("http://localhost:5000/api/clinics");
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