"use client"

import { Card, Typography } from "antd";
import Image from "next/image";
import { Specialty } from "@/src/types/specialty";
import CarouselWrapper from "./carousel-wrapper";

const { Title } = Typography;

export default function SpecialtyCarousel({ specialties }: { specialties: Specialty[] }) {
  if (!specialties || specialties.length === 0) return null;

  return (
    <CarouselWrapper>
      {specialties.map((specialty) => (
        <div key={specialty.id} className="p-2 cursor-pointer">
          <Card
            hoverable
            cover={
              <div style={{ position: "relative", height: "200px" }}>
                <Image
                  src={specialty.imageUrl || "/placeholder.png"}
                  alt={specialty.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
          >
            <Title style={{ textAlign: "center" }} level={4}>{specialty.name}</Title>
          </Card>
        </div>
      ))}
    </CarouselWrapper>
  );
}