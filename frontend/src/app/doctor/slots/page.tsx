"use client";

import { useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { Error } from "@/src/types/common";
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
  TimePicker,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import useDoctorSlotsQuery, {
  useCreateUpdateSlots,
} from "@/src/queries/slot.queries";
import { TimeSlot } from "@/src/types/slot";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { useQueryClient } from "@tanstack/react-query";

dayjs.extend(weekOfYear);

const { Title, Text } = Typography;

export default function SlotManagementPage() {
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs());

  const sundayOfWeek = selectedWeek.startOf("week");
  const sundayStr = sundayOfWeek.format("YYYY-MM-DD");

  const { data: slots, isLoading, error } = useDoctorSlotsQuery(sundayStr);
  const slotIdRef = useRef(0);

  useEffect(() => {
    if (slots && slots.length > 0) {
      slotIdRef.current = Math.max(...slots.map((s) => s.id)) + 1;
    } else {
      slotIdRef.current = 1;
    }
  }, [slots]);

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = sundayOfWeek.add(i, "day");
    const dayStr = day.format("YYYY-MM-DD");
    daysOfWeek.push({ date: dayStr, dayjs: day });
  }

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

  const [prevSlots, setPrevSlots] = useState(slots);
  const [prevSundayStr, setPrevSundayStr] = useState(sundayStr);

  if (prevSlots !== slots || prevSundayStr !== sundayStr) {
    setPrevSlots(slots);
    setPrevSundayStr(sundayStr);
    setSlotsByDay(buildSlotsByDay(slots));
  }

  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [newTimeRange, setNewTimeRange] = useState<[Dayjs, Dayjs] | null>(null);

  const handleWeekChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedWeek(date);
      setAddingDate(null);
      setNewTimeRange(null);
    }
  };

  const handleDeleteSlot = (slotId: number, date: string) => {
    setSlotsByDay((prev) => ({
      ...prev,
      [date]: prev[date].filter((slot) => slot.id !== slotId),
    }));
  };

  const handleAddSlot = (date: string) => {
    setAddingDate(date);
    setNewTimeRange(null);
  };

  const handleConfirmAddSlot = (date: string) => {
    if (!newTimeRange) {
      message.warning("Vui lòng chọn khung giờ");
      return;
    }
    const [start, end] = newTimeRange;
    const newSlot: TimeSlot = {
      id: slotIdRef.current++,
      doctorId: user?.id || "",
      date,
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      isBooked: false,
      appointment: null,
    };
    setSlotsByDay((prev) => ({
      ...prev,
      [date]: [...prev[date], newSlot].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    }));
    setAddingDate(null);
    setNewTimeRange(null);
  };

  const handleCancelAddSlot = () => {
    setAddingDate(null);
    setNewTimeRange(null);
  };

  // --- NEW DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, slotId: number, sourceDate: string) => {
    e.dataTransfer.setData("slotId", slotId.toString());
    e.dataTransfer.setData("sourceDate", sourceDate);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: string) => {
    e.preventDefault();
    const slotIdStr = e.dataTransfer.getData("slotId");
    const sourceDate = e.dataTransfer.getData("sourceDate");

    if (!slotIdStr || !sourceDate) return;

    const slotId = parseInt(slotIdStr, 10);

    setSlotsByDay((prev) => {
      const sourceSlots = prev[sourceDate] || [];
      const originalSlot = sourceSlots.find((s) => s.id === slotId);

      if (!originalSlot) return prev;

      // 1. Check if the target date already has this exact time slot
      const targetSlots = prev[targetDate] || [];
      const isDuplicate = targetSlots.some(
          (s) => s.startTime === originalSlot.startTime && s.endTime === originalSlot.endTime
      );

      if (isDuplicate) {
        message.warning("Khung giờ này đã tồn tại trong ngày được chọn.");
        return prev; // Do nothing if it's a duplicate
      }

      // 2. Create a brand-new slot based on the dragged slot's time
      const newCopiedSlot: TimeSlot = {
        id: slotIdRef.current++, // Generate a new unique ID
        doctorId: user?.id || "",
        date: targetDate, // Assign it to the new drop target date
        startTime: originalSlot.startTime,
        endTime: originalSlot.endTime,
        isBooked: false,
        appointment: null,
      };

      // 3. Add to the target date and re-sort
      const newTargetSlots = [...targetSlots, newCopiedSlot];
      newTargetSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // Notice we are NO LONGER modifying the source array,
      // leaving the original slot exactly where it was.
      return {
        ...prev,
        [targetDate]: newTargetSlots,
      };
    });
  };
  // -----------------------------------

  const createUpdateSlotsMutation = useCreateUpdateSlots(sundayStr);

  const handleSaveChanges = () => {
    const allSlots = Object.values(slotsByDay).flat();
    const payload = allSlots
      .filter((slot) => !slot.isBooked)
      .map((slot) => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

    createUpdateSlotsMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Lưu thay đổi thành công");
        queryClient.invalidateQueries({
          queryKey: ["current-doctor-slots", sundayStr],
        });
        queryClient.invalidateQueries({
          queryKey: ["doctor-appointments"],
        });
      },
      onError: (error: AxiosError<Error>) => {
        message.error(
          `Lỗi khi lưu: ${error.response?.data?.error || error.message}`,
        );
      },
    });
  };

  const saturdayOfWeek = sundayOfWeek.add(6, "day");
  const dateRangeDisplay = `${sundayOfWeek.format("DD")} - ${saturdayOfWeek.format("DD")} ${saturdayOfWeek.format("MMMM YYYY")}`;

  return (
    <>
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
            loading={createUpdateSlotsMutation.isPending}
          >
            Lưu thay đổi
          </Button>
        </Space>
      </div>

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

      {error && (
        <Empty
          description={`Lỗi: ${error.response?.data?.error || "Không thể tải dữ liệu"}`}
        />
      )}

      {!isLoading && !error && (
        <Table
          bordered
          rowHoverable={false}
          dataSource={[{ key: "slots-row" }]}
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
              width: "14.28%",
              render: () => (
                <div
                  // --- NEW DROP ZONE SETTINGS ---
                  onDragOver={(e) => e.preventDefault()} // Required to allow dropping
                  onDrop={(e) => handleDrop(e, day.date)}
                  style={{ minHeight: "150px", height: "100%" }} // Make sure there is room to drop on empty days
                >
                  {!daySlots ||
                    (daySlots.length === 0 && addingDate !== day.date) ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Không có slot"
                      style={{ marginTop: "20px", pointerEvents: "none" }} // Ensure empty text doesn't block drop
                    />
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        // --- NEW DRAG SETTINGS ---
                        draggable={!slot.isBooked} // Prevent dragging booked slots
                        onDragStart={(e) => handleDragStart(e, slot.id, day.date)}
                        style={{ cursor: slot.isBooked ? "not-allowed" : "grab" }}
                      >
                        <Card
                          size="small"
                          style={{
                            marginBottom: "8px",
                            backgroundColor: slot.isBooked
                              ? token.colorInfoBg
                              : token.colorBgContainer,
                            opacity: slot.isBooked ? 0.8 : 1,
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
                      </div>
                    ))
                  )}

                  {addingDate === day.date ? (
                    <Card
                      size="small"
                      style={{
                        marginTop: "8px",
                        borderColor: token.colorPrimary,
                        borderStyle: "dashed",
                      }}
                    >
                      <TimePicker.RangePicker
                        format="HH:mm"
                        minuteStep={15}
                        value={newTimeRange}
                        onChange={(val) =>
                          setNewTimeRange(val as [Dayjs, Dayjs] | null)
                        }
                        style={{ width: "100%", marginBottom: "8px" }}
                        needConfirm={false}
                      />
                      <Space
                        style={{ width: "100%", justifyContent: "flex-end" }}
                      >
                        <Button size="small" onClick={handleCancelAddSlot}>
                          Huỷ
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleConfirmAddSlot(day.date)}
                        >
                          OK
                        </Button>
                      </Space>
                    </Card>
                  ) : (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddSlot(day.date)}
                      block
                      style={{ marginTop: "8px" }}
                    >
                      Thêm slot
                    </Button>
                  )}
                </div>
              ),
            };
          })}
          pagination={false}
          showHeader={true}
        />
      )}
    </>
  );
}