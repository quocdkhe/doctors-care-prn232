import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import ClinicCarousel from "@/src/components/landing/clinic-carousel";
import Hero from "@/src/components/landing/hero";
import SpecialtyCarousel from "@/src/components/landing/specialty-carousel";

export default async function LandingPage() {
  const allSpecialties = await fetch("http://localhost:5000/api/specialties");
  const specialties = await allSpecialties.json();
  const allClinics = await fetch("http://localhost:5000/api/clinics");
  const clinics = await allClinics.json();
  return (
    <>
      <Hero />
      <MainContentWrapper>
        <SpecialtyCarousel specialties={specialties} />
        <ClinicCarousel clinics={clinics} />
      </MainContentWrapper>
    </>
  );
}
