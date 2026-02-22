"use client";

import { useState, useEffect } from "react";
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
  //select global state user from redux
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs());

  const sundayOfWeek = selectedWeek.startOf("week");
  const sundayStr = sundayOfWeek.format("YYYY-MM-DD");

  const { data: slots, isLoading, error } = useDoctorSlotsQuery(sundayStr);

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
    () => buildSlotsByDay(slots),
  );

  useEffect(() => {
    setSlotsByDay(buildSlotsByDay(slots));
  }, [slots, sundayStr]);

  // Track which date is currently showing the add form, and its time range value
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
      id: Date.now(),
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
    message.success("Đã thêm slot mới");
  };

  const handleCancelAddSlot = () => {
    setAddingDate(null);
    setNewTimeRange(null);
  };

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
                <div>
                  {!daySlots ||
                  (daySlots.length === 0 && addingDate !== day.date) ? (
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

                  {/* Add slot form or button */}
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
