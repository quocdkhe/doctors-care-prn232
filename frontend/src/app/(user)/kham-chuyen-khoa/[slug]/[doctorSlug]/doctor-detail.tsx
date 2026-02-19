"use client";

import { DoctorDetail as DoctorDetailType } from "@/src/types/doctor";
import { useGetSlotsByDoctorAndDay } from "@/src/queries/slot.queries";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Row,
  Spin,
  Typography,
  theme,
} from "antd";
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { calculatePrice } from "@/src/utils/helper";
import { useRouter } from "next/navigation";

const { Text, Title, Paragraph } = Typography;

export default function DoctorDetail({ doctor }: { doctor: DoctorDetailType }) {
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
    <div>
      {/* ── Row 1: Avatar + Info (full width) ── */}
      <Row gutter={[24, 16]} align="middle" style={{ marginBottom: "24px" }}>
        <Col flex="none">
          <Avatar
            size={120}
            src={doctor.imageUrl || "/default-avatar.png"}
            style={{ border: "1px solid #d9d9d9" }}
          />
        </Col>
        <Col flex="auto">
          <Title level={3} style={{ marginBottom: "8px" }}>
            {doctor.doctorName}
          </Title>

          <Paragraph
            style={{
              marginBottom: "8px",
              fontSize: "15px",
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
              marginTop: "12px",
              color: token.colorTextSecondary,
            }}
          >
            <EnvironmentOutlined style={{ marginTop: "4px" }} />
            <Text type="secondary" style={{ fontSize: "15px" }}>
              {doctor.clinicCity}
            </Text>
          </div>
        </Col>
      </Row>

      {/* ── Row 2: Schedule (left) + Clinic Info (right) ── */}
      <Row gutter={[24, 24]}>
        {/* Left Column: DatePicker & Slots */}
        <Col xs={24} sm={12} style={{ borderRight: "1px solid #f0f0f0" }}>
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
        </Col>

        {/* Right Column: Clinic Address & Price */}
        <Col xs={24} sm={12} style={{ paddingLeft: "24px" }}>
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
              {doctor.clinicAddress + ", " + doctor.clinicCity}
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
        </Col>
      </Row>

      {/* ── Part 2: Doctor Biography ── */}
      <Divider />
      <div
        className="doctor-biography"
        dangerouslySetInnerHTML={{ __html: doctor.biography || "" }}
        style={{
          fontSize: "14px",
          lineHeight: 1.8,
          color: token.colorText,
        }}
      />
    </div>
  );
}
