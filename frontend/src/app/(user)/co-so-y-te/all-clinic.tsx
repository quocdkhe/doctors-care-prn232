"use client";

import { Clinic } from "@/src/types/clinic";
import { Card, Col, Row } from "antd";
import Image from "next/image";
import { Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;
export default function AllClinic({ clinics }: { clinics: Clinic[] }) {
  const router = useRouter();
  return (
    <Row gutter={[24, 24]}>
      {clinics.map((clinic) => (
        <Col key={clinic.id} xs={24} sm={12} lg={6} className="cursor-pointer">
          <Card
            onClick={() => {
              router.push(`/co-so-y-te/${clinic.slug}`);
            }}
            hoverable
            className="h-full"
            cover={
              <div
                style={{ position: "relative", height: "160px" }}
                className="p-4"
              >
                <Image
                  src={clinic.imageUrl || "/placeholder.png"}
                  alt={clinic.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            }
            styles={{ body: { padding: "12px" } }}
          >
            <Title
              style={{ textAlign: "center", fontSize: "16px", marginBottom: 0 }}
              level={5}
            >
              {clinic.name}
            </Title>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
