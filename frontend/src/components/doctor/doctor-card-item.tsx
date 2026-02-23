"use client";

import { DoctorCard } from "@/src/types/doctor";
import { useGetSlotsByDoctorAndDay } from "@/src/queries/slot.queries";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Spin,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { calculatePrice } from "@/src/utils/helper";
import { useRouter } from "next/navigation";

const { Text, Title, Paragraph } = Typography;

export default function DoctorCardItem({ doctor }: { doctor: DoctorCard }) {
  console.log(doctor);
  const { token } = theme.useToken();
  const router = useRouter();

  // Build a Set of available date strings for O(1) lookup
  const availableDateSet = useMemo(
    () => new Set(doctor.availableDates),
    [doctor.availableDates],
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );

  // Fetch slots for the selected doctor + date (only when a date is chosen)
  const { data: slots, isLoading: slotsLoading } = useGetSlotsByDoctorAndDay(
    doctor.doctorId,
    selectedDate ?? "",
    {
      enabled: !!selectedDate,
    },
  );

  // Only show unbooked slots
  const availableSlots = useMemo(
    () => (slots ?? []).filter((s) => !s.isBooked),
    [slots],
  );

  // Disable dates that are NOT in availableDates
  const disabledDate = (current: Dayjs) => {
    return !availableDateSet.has(current.format("YYYY-MM-DD"));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
    setSelectedSlotIndex(null);
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
                size={100}
                src={doctor.imageUrl || "/default-avatar.png"}
                style={{ border: "1px solid #d9d9d9" }}
              />
              <Link
                href={`/kham-chuyen-khoa/${doctor.specialtySlug}/${doctor.slug}`}
                style={{
                  color: token.colorPrimary,
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
            <DatePicker
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              allowClear={false}
              format="DD/MM/YYYY"
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

            {slotsLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <Spin />
              </div>
            ) : availableSlots.length === 0 ? (
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Vui lòng chọn ngày
              </Text>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                }}
              >
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedSlotIndex === index;
                  return (
                    <Button
                      key={slot.id}
                      type={isSelected ? "primary" : "default"}
                      onClick={() =>
                        setSelectedSlotIndex(isSelected ? null : index)
                      }
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  );
                })}
              </div>
            )}
            <Text
              type="secondary"
              style={{ fontSize: "12px", marginTop: "8px", display: "block" }}
            >
              Chọn <span style={{ cursor: "pointer" }}>👆</span> và đặt (Phí đặt
              lịch 0đ)
            </Text>
            {selectedSlotIndex !== null &&
              availableSlots[selectedSlotIndex] && (
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
                    <Text
                      strong
                      type="secondary"
                      style={{ marginRight: "2px" }}
                    >
                      GIÁ:
                    </Text>
                    <Text>
                      {calculatePrice(
                        availableSlots[selectedSlotIndex].startTime,
                        availableSlots[selectedSlotIndex].endTime,
                        doctor.pricePerHour,
                      ).toLocaleString()}
                      đ
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    onClick={() =>
                      router.push(
                        `/dat-lich-kham/${availableSlots[selectedSlotIndex].id}`,
                      )
                    }
                  >
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
