"use client";

import { DoctorCard } from "@/src/types/doctor";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { Text, Title, Paragraph } = Typography;

interface DoctorCardItemProps {
  doctor: DoctorCard;
}

export default function DoctorCardItem({ doctor }: DoctorCardItemProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );
  const { token } = theme.useToken();

  // Fake slots data
  const slots = [
    { time: "09:00 - 09:30" },
    { time: "09:30 - 10:00" },
    { time: "10:00 - 10:30" },
    { time: "10:30 - 11:00" },
    { time: "11:00 - 11:30" },
    { time: "13:30 - 14:00" },
    { time: "14:00 - 14:30" },
    { time: "14:30 - 15:00" },
    { time: "15:00 - 15:30" },
    { time: "15:30 - 16:00" },
  ];

  // Helper function to calculate price based on slot duration
  const calculatePrice = (slotTime: string) => {
    const [start, end] = slotTime.split(" - ");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    const durationInMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const price = (doctor.pricePerHour * durationInMinutes) / 60;
    return price;
  };

  return (
    <Card
      styles={{ body: { padding: "20px" } }}
      style={{
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Left Column: Avatar + Info */}
        <Col xs={24} sm={12} style={{ borderRight: "1px solid #f0f0f0" }}>
          <Row gutter={[16, 16]}>
            {/* Avatar & Link */}
            <Col
              xs={24}
              md={8}
              lg={6}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Avatar
                size={80}
                src={doctor.imageUrl || "/default-avatar.png"}
                style={{ border: "1px solid #d9d9d9" }}
              />
              <Link
                href={`/doctor/${doctor.slug}`}
                style={{
                  color: token.colorPrimary,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Xem thêm
              </Link>
            </Col>

            {/* Info */}
            <Col xs={24} md={16} lg={18}>
              <Title level={4} style={{ marginBottom: "8px" }}>
                {doctor.doctorName}
              </Title>

              <Paragraph
                ellipsis={{ rows: 3 }}
                style={{
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: token.colorTextSecondary,
                }}
              >
                {doctor.shortDescription || "Bác sĩ chưa có mô tả ngắn."}
              </Paragraph>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginTop: "16px",
                  color: token.colorTextSecondary,
                }}
              >
                <EnvironmentOutlined style={{ marginTop: "4px" }} />
                <Text type="secondary">{doctor.clinicCity}</Text>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Right Column: Schedule & Booking */}
        <Col xs={24} sm={12} style={{ paddingLeft: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Select
              defaultValue="today"
              style={{ width: 160, fontWeight: 500 }}
              onChange={setSelectedDate}
              options={[
                { value: "today", label: "Hôm nay - 18/2" },
                { value: "tomorrow", label: "Ngày mai - 19/2" },
                { value: "next", label: "Thứ 5 - 20/2" },
              ]}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <CalendarOutlined />
              <Text strong style={{ textTransform: "uppercase" }}>
                Lịch khám
              </Text>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              {slots.map((slot, index) => {
                const isSelected = selectedSlotIndex === index;
                return (
                  <Button
                    key={index}
                    type={isSelected ? "primary" : "default"}
                    onClick={() =>
                      setSelectedSlotIndex(isSelected ? null : index)
                    }
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {slot.time}
                  </Button>
                );
              })}
            </div>
            <Text
              type="secondary"
              style={{ fontSize: "12px", marginTop: "8px", display: "block" }}
            >
              Chọn <span style={{ cursor: "pointer" }}>👆</span> và đặt (Phí đặt
              lịch 0đ)
            </Text>
            {selectedSlotIndex !== null && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "12px",
                }}
              >
                <div>
                  <Text strong type="secondary" style={{ marginRight: "2px" }}>
                    GIÁ:
                  </Text>
                  <Text>
                    {calculatePrice(
                      slots[selectedSlotIndex].time,
                    ).toLocaleString()}
                    đ
                  </Text>
                </div>
                <Button type="primary" disabled={selectedSlotIndex === null}>
                  Đặt lịch khám
                </Button>
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              paddingTop: "12px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <Text
                strong
                style={{
                  textTransform: "uppercase",
                  color: token.colorTextDescription,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Địa chỉ khám
              </Text>
              <Text strong style={{ display: "block" }}>
                {doctor.clinicName}
              </Text>
              <Text type="secondary" style={{ display: "block" }}>
                {doctor.clinicAddress}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              <Text
                strong
                style={{
                  textTransform: "uppercase",
                  color: token.colorTextDescription,
                }}
              >
                GIÁ KHÁM:
              </Text>
              <Text>{doctor.pricePerHour.toLocaleString()}đ / giờ</Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
