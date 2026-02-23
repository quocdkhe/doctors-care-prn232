"use client";

import { AppointmentStatus, PatientAppointment } from "@/src/types/appointment";
import { Avatar, Button, Card, Col, Row, Tag, theme, Typography } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { useToken } = theme;

function formatTime(time: string) {
  // "HH:mm:ss" → "HH:mm"
  return time.slice(0, 5);
}

function formatDate(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}

function formatDob(dob: string) {
  return dayjs(dob).format("DD/MM/YYYY");
}

function StatusTag({ status }: { status: AppointmentStatus }) {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.Scheduled]: "blue",
    [AppointmentStatus.Completed]: "green",
    [AppointmentStatus.Cancelled]: "red",
  };
  const labelMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.Scheduled]: "Đã đặt lịch",
    [AppointmentStatus.Completed]: "Hoàn thành",
    [AppointmentStatus.Cancelled]: "Đã huỷ",
  };
  return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
}

export default function AppointmentCard({
  appointment,
}: {
  appointment: PatientAppointment;
}) {
  const { token } = useToken();

  const cardFooter =
    appointment.status === AppointmentStatus.Scheduled ? (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button danger icon={<CloseCircleOutlined />}>
          Huỷ đặt lịch
        </Button>
      </div>
    ) : appointment.status === AppointmentStatus.Completed ? (
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button icon={<FileTextOutlined />}>Tải bệnh án</Button>
        <Button icon={<StarOutlined />} type="primary">
          Viết đánh giá
        </Button>
      </div>
    ) : null;

  return (
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${token.paddingMD}px ${token.paddingLG}px`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: token.marginMD }}
        >
          <Avatar
            size={56}
            src={appointment.doctorAvatar || undefined}
            icon={!appointment.doctorAvatar ? <UserOutlined /> : undefined}
          />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {appointment.doctorName}
            </Title>
            <Text type="secondary">
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {appointment.clinicName}
            </Text>
          </div>
        </div>
        <StatusTag status={appointment.status} />
      </div>

      {/* Card Body */}
      <Row gutter={0}>
        {/* Left – Appointment Info */}
        <Col
          xs={24}
          md={12}
          style={{
            padding: `${token.paddingMD}px ${token.paddingLG}px`,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Text
            style={{
              display: "block",
              color: token.colorTextSecondary,
              fontSize: token.fontSizeSM,
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: token.marginMD,
              textTransform: "uppercase",
            }}
          >
            Thông tin lịch hẹn
          </Text>

          {/* Time */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: token.marginSM,
              marginBottom: token.marginMD,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: token.borderRadius,
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClockCircleOutlined style={{ color: token.colorPrimary }} />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Thời gian khám
              </Text>
              <br />
              <Text strong style={{ fontSize: token.fontSizeLG }}>
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.endTime)}
              </Text>
            </div>
          </div>

          {/* Date */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: token.marginSM,
              marginBottom: token.marginMD,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: token.borderRadius,
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarOutlined style={{ color: token.colorPrimary }} />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Ngày khám
              </Text>
              <br />
              <Text strong style={{ fontSize: token.fontSizeLG }}>
                {formatDate(appointment.date)}
              </Text>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Lý do thăm khám:
              </Text>
              <br />
              <Text italic style={{ color: token.colorTextSecondary }}>
                {appointment.reason}
              </Text>
            </div>
          )}
        </Col>

        {/* Right – Patient Info */}
        <Col
          xs={24}
          md={12}
          style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}
        >
          <Text
            style={{
              display: "block",
              color: token.colorTextSecondary,
              fontSize: token.fontSizeSM,
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: token.marginMD,
              textTransform: "uppercase",
            }}
          >
            Thông tin bệnh nhân
          </Text>

          <Row gutter={[16, 12]}>
            <Col xs={24} sm={12}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                <UserOutlined style={{ marginRight: 4 }} />
                Họ và tên
              </Text>
              <br />
              <Text strong>{appointment.patientName}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Giới tính
              </Text>
              <br />
              <Text strong>{appointment.patientGender ? "Nữ" : "Nam"}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Ngày sinh
              </Text>
              <br />
              <Text strong>{formatDob(appointment.patientDateOfBirth)}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Số điện thoại
              </Text>
              <br />
              <Text strong>{appointment.patientPhone}</Text>
            </Col>
            <Col xs={24}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Địa chỉ thường trú
              </Text>
              <br />
              <Text strong>{appointment.patientAddress}</Text>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Card Footer */}
      {cardFooter && (
        <div
          style={{
            padding: `${token.paddingMD}px ${token.paddingLG}px`,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {cardFooter}
        </div>
      )}
    </Card>
  );
}
