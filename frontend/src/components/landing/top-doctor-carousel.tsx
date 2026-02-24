"use client";

import { Card, Typography, Avatar, Button } from "antd";
import { DoctorTop } from "@/src/types/doctor";
import CarouselWrapper from "./carousel-wrapper";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import bgImage from "@/src/public/140311-background5.png";
import Link from "next/link";

const { Title, Text } = Typography;

export default function TopDoctorCarousel({
  topDoctors,
}: {
  topDoctors: DoctorTop[];
}) {
  const router = useRouter();
  if (!topDoctors || topDoctors.length === 0) return null;

  return (
    <div
      style={{
        backgroundImage: `url(${typeof bgImage === "string" ? bgImage : bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 0",
        borderRadius: "16px",
        margin: "24px 16px",
      }}
    >
      <div className="flex justify-between items-center px-8 mb-4">
        <h2 className="text-2xl font-bold mb-0">Bác sĩ nổi bật</h2>
        <Link href="/kham-chuyen-khoa">
          <Button size="large" type="primary">
            Xem thêm
          </Button>
        </Link>
      </div>
      <CarouselWrapper bgTransparent>
        {topDoctors.map((doctor) => (
          <div
            key={doctor.doctorSlug}
            className="p-2 cursor-pointer"
            onClick={() =>
              router.push(
                `/kham-chuyen-khoa/${doctor.specialtySlug}/${doctor.doctorSlug}`,
              )
            }
          >
            <Card
              hoverable
              style={{
                textAlign: "center",
                height: "100%",
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
              styles={{ body: { padding: "20px 16px" } }}
              cover={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "24px",
                  }}
                >
                  <Avatar
                    size={200}
                    src={doctor.doctorAvatar || undefined}
                    icon={!doctor.doctorAvatar ? <UserOutlined /> : undefined}
                    style={{ border: "2px solid #fff" }}
                  />
                </div>
              }
            >
              <Title
                level={5}
                style={{
                  marginBottom: 4,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                {doctor.doctorName}
              </Title>
              <Text type="secondary" style={{ display: "block" }}>
                {doctor.specialtyName}
              </Text>
              <Text style={{ display: "block" }}>
                Đã khám: {doctor.appoinmentCount}
              </Text>
            </Card>
          </div>
        ))}
      </CarouselWrapper>
    </div>
  );
}
