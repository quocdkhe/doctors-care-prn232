"use client";

import { ClinicDetail } from "@/src/types/clinic";
import { Avatar, Card, Divider, Menu, theme, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { DoctorCard } from "@/src/types/doctor";
import DoctorCardItem from "@/src/components/doctor/doctor-card-item";

const { Title, Text } = Typography;
const { useToken } = theme;

// Height of the sticky navbar in layout.tsx (Ant Design Header default)
const NAVBAR_HEIGHT = 64;
// Height of the sticky clinic menu card (approx)
const MENU_CARD_HEIGHT = 112;

export default function ClinicDetailsAndDoctors({
  clinic,
  doctors,
}: {
  clinic: ClinicDetail;
  doctors: DoctorCard[];
}) {
  const { token } = useToken();
  const [selectedKey, setSelectedKey] = useState("booking");

  const bookingRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (key: string) => {
    setSelectedKey(key);
    const ref = key === "booking" ? bookingRef : introRef;
    if (ref.current) {
      const top =
        ref.current.getBoundingClientRect().top +
        window.scrollY -
        NAVBAR_HEIGHT -
        MENU_CARD_HEIGHT -
        16; // extra gap
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const menuItems = [
    { key: "booking", label: "Đặt lịch khám" },
    { key: "intro", label: "Giới thiệu chung" },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: token.marginXL }}
    >
      {/* ── Sticky header card: logo + info + nav menu ── */}
      <div
        style={{
          position: "sticky",
          top: NAVBAR_HEIGHT,
          zIndex: 40,
        }}
      >
        <Card styles={{ body: { padding: 0 } }}>
          {/* Top row: logo + name + address */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: token.marginMD,
              padding: `${token.paddingMD}px ${token.paddingLG}px`,
              paddingBottom: 0,
            }}
          >
            <Avatar
              src={
                <img
                  src={clinic.imageUrl}
                  alt={clinic.name}
                  style={{ objectFit: "contain" }}
                />
              }
              size={72}
              shape="square"
              style={{
                flexShrink: 0,
                borderRadius: token.borderRadius,
                background: "transparent",
              }}
            />
            <div>
              <Title level={4} style={{ margin: 0, lineHeight: 1.3 }}>
                {clinic.name}
              </Title>
              <Text type="secondary">
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {clinic.address}
                {clinic.city ? `, ${clinic.city}` : ""}
              </Text>
            </div>
          </div>

          <Divider style={{ margin: `${token.marginSM}px 0 0 0` }} />

          {/* Navigation menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => scrollToSection(key)}
            items={menuItems}
            style={{
              borderBottom: "none",
              paddingLeft: token.paddingLG,
              fontWeight: 600,
            }}
          />
        </Card>
      </div>

      {/* ── Doctor cards section ── */}
      <div
        ref={bookingRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: token.marginMD,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Đặt lịch khám
        </Title>
        {doctors?.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCardItem key={doctor.slug} doctor={doctor} />
          ))
        ) : (
          <Card style={{ textAlign: "center" }}>
            <Text type="secondary">Không tìm thấy bác sĩ</Text>
          </Card>
        )}
      </div>

      {/* ── Clinic introduction section ── */}
      <div ref={introRef}>
        <Card>
          <Title level={5} style={{ marginTop: 0 }}>
            Giới thiệu chung
          </Title>
          {clinic.description ? (
            <div
              className="prose"
              style={{ color: token.colorText }}
              dangerouslySetInnerHTML={{ __html: clinic.description }}
            />
          ) : (
            <Text type="secondary">Chưa có thông tin giới thiệu.</Text>
          )}
        </Card>
      </div>
    </div>
  );
}
