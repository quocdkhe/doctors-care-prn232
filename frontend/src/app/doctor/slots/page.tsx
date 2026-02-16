"use client";

import { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Badge,
  Button,
  Table,
  Typography,
  theme,
  Spin,
  Empty,
  Space,
  App,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import useDoctorSlotsQuery from "@/src/queries/slot.queries";
import { TimeSlot } from "@/src/types/slot";

dayjs.extend(weekOfYear);

const { Title, Text } = Typography;

export default function SlotManagementPage() {
  const { token } = theme.useToken();
  const { message } = App.useApp();

  // State for selected week (default to current week)
  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs());

  // Calculate Sunday of the selected week
  const sundayOfWeek = selectedWeek.startOf("week");
  const sundayStr = sundayOfWeek.format("YYYY-MM-DD");

  // Fetch slots for the week
  const { data: slots, isLoading, error } = useDoctorSlotsQuery(sundayStr);

  // Build daysOfWeek array
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = sundayOfWeek.add(i, "day");
    const dayStr = day.format("YYYY-MM-DD");
    daysOfWeek.push({ date: dayStr, dayjs: day });
  }

  // Helper to group and sort slots by day
  const buildSlotsByDay = (rawSlots: TimeSlot[] | undefined) => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    for (let i = 0; i < 7; i++) {
      const dayStr = sundayOfWeek.add(i, "day").format("YYYY-MM-DD");
      grouped[dayStr] = [];
    }
    rawSlots?.forEach((slot) => {
      if (grouped[slot.date]) {
        grouped[slot.date].push(slot);
      }
    });
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  };

  const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: TimeSlot[] }>(
    () => buildSlotsByDay(slots)
  );

  // Sync slotsByDay when fetched data or selected week changes
  useEffect(() => {
    setSlotsByDay(buildSlotsByDay(slots));
  }, [slots, sundayStr]);

  const handleWeekChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedWeek(date);
    }
  };

  const handleDeleteSlot = (slotId: number, date: string) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [date]: prev[date].filter((slot) => slot.id !== slotId),
    }));
    message.success(`Đã xóa slot ${slotId}`);
  };

  const handleAddSlot = (date: string) => {
    message.info(`Thêm slot cho ngày ${date} (chưa triển khai)`);
    // TODO: Implement add slot modal/form
  };

  const handleSaveChanges = () => {
    message.info("Lưu thay đổi (chưa triển khai)");
    // TODO: Implement save changes
  };

  // Date range display
  const saturdayOfWeek = sundayOfWeek.add(6, "day");
  const dateRangeDisplay = `${sundayOfWeek.format("DD")} - ${saturdayOfWeek.format("DD")} ${saturdayOfWeek.format("MMMM YYYY")}`;

  console.log(slotsByDay);

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý lịch khám
          </Title>
          <Text type="secondary">{dateRangeDisplay}</Text>
        </div>
        <Space>
          <DatePicker
            picker="week"
            value={selectedWeek}
            onChange={handleWeekChange}
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveChanges}
          >
            Lưu thay đổi
          </Button>
        </Space>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "100px 0",
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Empty
          description={`Lỗi: ${error.response?.data?.error || "Không thể tải dữ liệu"}`}
        />
      )}

      {/* Weekly Calendar View */}
      {!isLoading && !error && (
        <Table
          bordered
          rowHoverable={false}
          dataSource={[{ key: "slots-row" }]} // Single row to hold all days
          columns={daysOfWeek.map((day) => {
            const daySlots = slotsByDay[day.date];

            return {
              title: (
                <div style={{ textAlign: "center" }}>
                  <Text strong>{day.dayjs.format("ddd")}</Text>
                  <br />
                  <Text type="secondary">{day.dayjs.format("DD")}</Text>
                </div>
              ),
              dataIndex: day.date,
              key: day.date,
              width: "14.28%", // 100% / 7 days
              render: () => (
                <div>
                  {/* Slots for this day */}
                  {!daySlots || daySlots.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Không có slot"
                      style={{ marginTop: "20px" }}
                    />
                  ) : (
                    daySlots.map((slot) => (
                      <Card
                        key={slot.id}
                        size="small"
                        style={{
                          marginBottom: "8px",
                          backgroundColor: slot.isBooked
                            ? token.colorInfoBg
                            : token.colorBgContainer,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Text strong>
                              {slot.startTime} - {slot.endTime}
                            </Text>
                            <br />
                            <Badge
                              status={slot.isBooked ? "processing" : "success"}
                              text={slot.isBooked ? "Đã đặt" : "Trống"}
                            />
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={slot.isBooked}
                            onClick={() => handleDeleteSlot(slot.id, day.date)}
                            size="small"
                          />
                        </div>
                      </Card>
                    ))
                  )}

                  {/* Add Slot Button */}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddSlot(day.date)}
                    block
                    style={{ marginTop: "8px" }}
                  >
                    Thêm slot
                  </Button>
                </div>
              ),
            };
          })}
          pagination={false}
          showHeader={true}
        />
      )}
    </div>
  );
}