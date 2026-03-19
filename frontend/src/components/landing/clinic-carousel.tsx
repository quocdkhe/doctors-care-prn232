"use client"

import { Clinic } from "@/src/types/clinic";
import CarouselWrapper from "./carousel-wrapper";
import { Card, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function ClinicCarousel({ clinics }: { clinics: Clinic[] }) {
  const router = useRouter();
  if (!clinics || clinics.length === 0) return null;
  return (
    <CarouselWrapper>
      {clinics.map((clinic) => (
        <div key={clinic.id} className="p-2 cursor-pointer"
          onClick={() => router.push(`co-so-y-te/${clinic.slug}`)  }
        >
          <Card
            hoverable
            cover={
              <div style={{ position: "relative", height: "200px" }}>
                <Image
                  src={clinic.imageUrl || "/placeholder.png"}
                  alt={clinic.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
          >
            <Title style={{ textAlign: "center" }} level={4}>{clinic.name}</Title>
          </Card>
        </div>
      ))}
    </CarouselWrapper>
  )
}