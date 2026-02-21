"use client";

import React, { useMemo, useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import {
  App,
  Badge,
  Button,
  Calendar,
  Flex,
  Select,
  Spin,
  theme,
  Typography,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useDoctorGetAllAppointments } from "@/src/queries/appointment.queries";
import { AppointmentItem, AppointmentStatus } from "@/src/types/appointment";
import AppointmentDetailModal from "@/src/components/modals/appointment-modal";
import { abbreviateVietnameseName } from "@/src/utils/helper";

// ─── badge status helper ──────────────────────────────────────────────────────

function getBadgeStatus(item: AppointmentItem): BadgeProps["status"] {
  if (!item.isBooked) return "default"; // grey = unbooked slot
  switch (item.status) {
    case AppointmentStatus.Scheduled:
      return "warning"; // yellow
    case AppointmentStatus.Cancelled:
      return "error"; // red
    case AppointmentStatus.Completed:
      return "success"; // green
    default:
      return "default";
  }
}

// // ─── Modal detail label ───────────────────────────────────────────────────────

// function statusLabel(status: AppointmentStatus): string {
//   switch (status) {
//     case AppointmentStatus.Scheduled:
//       return "Scheduled";
//     case AppointmentStatus.Cancelled:
//       return "Cancelled";
//     case AppointmentStatus.Completed:
//       return "Completed";
//   }
// }

// ─── Component ────────────────────────────────────────────────────────────────

const { Title, Text } = Typography;

const SchedulePage: React.FC = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();

  // current displayed month (drives the API call)
  const [current, setCurrent] = useState<Dayjs>(dayjs());

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AppointmentItem | null>(
    null,
  );

  // ── data fetching ────────────────────────────────────────────────────────
  const { data: appointments = [], isLoading } = useDoctorGetAllAppointments(
    current.month() + 1, // API expects 1-based month
    current.year(),
  );

  // group items by date string "YYYY-MM-DD" for fast lookup inside cellRender
  const byDate = useMemo(() => {
    const map: Record<string, AppointmentItem[]> = {};
    for (const item of appointments) {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    }
    return map;
  }, [appointments]);

  // ── event handlers ───────────────────────────────────────────────────────
  const showEventModal = (item: AppointmentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isBooked) {
      message.warning("Slot này chưa được đặt");
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ── custom header (month/year nav only, no view switcher) ────────────────
  const headerRender: CalendarProps<Dayjs>["headerRender"] = ({
    value,
    onChange,
  }) => {
    const month = value.month(); // 0-based
    const year = value.year();

    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: `Tháng ${i + 1}`,
    }));

    const years = Array.from({ length: 10 }, (_, i) => {
      const y = year - 5 + i;
      return { value: y, label: String(y) };
    });

    const prev = () => {
      const next = value.subtract(1, "month").startOf("month");
      onChange(next);
      setCurrent(next);
    };

    const next = () => {
      const nextVal = value.add(1, "month").startOf("month");
      onChange(nextVal);
      setCurrent(nextVal);
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: token.marginSM,
          padding: `${token.paddingSM}px ${token.padding}px`,
        }}
      >
        <Button icon={<LeftOutlined />} onClick={prev} type="text" />

        <Select
          value={month}
          options={months}
          style={{ width: 130 }}
          onChange={(m) => {
            const next = value.month(m).startOf("month");
            onChange(next);
            setCurrent(next);
          }}
        />

        <Select
          value={year}
          options={years}
          style={{ width: 90 }}
          onChange={(y) => {
            const next = value.year(y).startOf("month");
            onChange(next);
            setCurrent(next);
          }}
        />

        <Button icon={<RightOutlined />} onClick={next} type="text" />

        {isLoading && <Spin size="small" />}
      </div>
    );
  };

  // ── cell render ──────────────────────────────────────────────────────────
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (cellDate, info) => {
    if (info.type !== "date") return info.originNode;

    const dateKey = cellDate.format("YYYY-MM-DD");
    const items = byDate[dateKey] ?? [];

    if (items.length === 0) return null;

    return (
      <ul className="events">
        {items.map((item, index) => (
          <li
            key={`${dateKey}-${index}`}
            onClick={(e) => showEventModal(item, e)}
            className="calendar-event-item"
            style={
              {
                "--event-hover-bg": token.controlItemBgHover,
                padding: token.paddingXXS,
                borderRadius: token.borderRadiusSM,
                transition: `background-color ${token.motionDurationMid}`,
              } as React.CSSProperties
            }
          >
            <Badge
              status={getBadgeStatus(item)}
              text={`${item.startTime.slice(0, 5)}–${item.endTime.slice(0, 5)}: ${abbreviateVietnameseName(item.patientName)}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <Flex vertical gap={token.margin}>
      <Flex align="center" justify="space-between">
        <Title level={4} style={{ margin: 0 }}>
          Lịch khám
        </Title>

        <Flex gap={token.marginMD} wrap="wrap">
          <Badge status="success" text="Đã hoàn thành" />
          <Badge status="error" text="Bị huỷ" />
          <Badge status="warning" text="Đã đặt" />
          <Badge status="default" text="Chưa đặt" />
        </Flex>
      </Flex>

      <Calendar
        className="doctor-schedule-calendar"
        cellRender={cellRender}
        headerRender={headerRender}
        value={current}
        onPanelChange={(val) => setCurrent(val)}
      />

      {selectedItem && (
        <AppointmentDetailModal
          appointmentId={selectedItem.appointmentId}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Flex>
  );
};

export default SchedulePage;
