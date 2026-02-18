"use client";

import { Specialty } from "@/src/types/specialty";
import { Card, Col, Row, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function AllSpecialties({
  specialties,
}: {
  specialties: Specialty[];
}) {
  const router = useRouter();
  return (
    <Row gutter={[24, 24]}>
      {specialties.map((specialty) => (
        <Col
          key={specialty.id}
          xs={24}
          sm={12}
          lg={6}
          className="cursor-pointer"
        >
          <Card
            onClick={() => router.push(`/kham-chuyen-khoa/${specialty.slug}`)}
            hoverable
            className="h-full"
            cover={
              <div
                style={{ position: "relative", height: "160px" }}
                className="p-4"
              >
                <Image
                  src={specialty.imageUrl || "/placeholder.png"}
                  alt={specialty.name}
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
              {specialty.name}
            </Title>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
