"use client";

import React from "react";
import {
  Modal,
  Badge,
  Typography,
  Divider,
  Upload,
  Button,
  Spin,
  Avatar,
  Tag,
  Alert,
  theme,
  App,
  Popconfirm,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  UploadOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import {
  useCancelAppointment,
  useCompleteAppointment,
  useGetAppointmentDetail,
} from "@/src/queries/appointment.queries";
import { AppointmentStatus } from "@/src/types/appointment";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadFile } from "@/src/queries/file.queries";

const { Text } = Typography;

interface AppointmentDetailModalProps {
  appointmentId: string;
  open: boolean;
  onClose: () => void;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status?: AppointmentStatus) {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return <Tag color="warning">Đã đặt</Tag>;
    case AppointmentStatus.Cancelled:
      return <Tag color="error">Đã huỷ</Tag>;
    case AppointmentStatus.Completed:
      return <Tag color="success">Đã hoàn thành</Tag>;
    default:
      return null;
  }
}

function formatDate(dateStr: string) {
  return dayjs(dateStr).format("DD [tháng] MM, YYYY");
}

function formatTime(timeStr: string) {
  return timeStr.slice(0, 5);
}

function calcDuration(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  if (diff >= 60) {
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `${h}h${m}phút` : `${h}h`;
  }
  return `${diff} phút`;
}

function calcAge(dateOfBirth: string) {
  const today = dayjs();
  const dob = dayjs(dateOfBirth);
  return today.diff(dob, "year");
}

// ── component ───────────────────────────────────────────────────────────────

export default function AppointmentDetailModal({
  appointmentId,
  open,
  onClose,
}: AppointmentDetailModalProps) {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAppointmentDetail(appointmentId);
  const cancelMutation = useCancelAppointment(appointmentId);
  const completeMutation = useCompleteAppointment(appointmentId);
  const uploadMutation = useUploadFile();

  const isCompleting = completeMutation.isPending || uploadMutation.isPending;

  const handleComplete = () => {
    const file = fileList[0]?.originFileObj;
    if (file) {
      uploadMutation.mutate(file, {
        onSuccess: (res) => {
          completeMutation.mutate(
            { medicalRecordFileUrl: res.message },
            {
              onSuccess: () => {
                message.success("Đánh dấu hoàn thành thành công");
                queryClient.invalidateQueries({
                  queryKey: ["doctor-appointments"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["appointment-detail", appointmentId],
                });
                onClose();
              },
              onError: (error) => {
                message.error(
                  error.response?.data?.error ||
                    "Có lỗi xảy ra khi cập nhật trạng thái",
                );
              },
            },
          );
        },
        onError: (error) => {
          message.error(
            error.response?.data?.message || "Có lỗi xảy ra khi tải file",
          );
        },
      });
    } else {
      completeMutation.mutate(
        { medicalRecordFileUrl: null },
        {
          onSuccess: () => {
            message.success("Đánh dấu hoàn thành thành công");
            queryClient.invalidateQueries({
              queryKey: ["doctor-appointments"],
            });
            queryClient.invalidateQueries({
              queryKey: ["appointment-detail", appointmentId],
            });
            onClose();
          },
          onError: (error) => {
            message.error(
              error.response?.data?.error ||
                "Có lỗi xảy ra khi cập nhật trạng thái",
            );
          },
        },
      );
    }
  };

  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  const isScheduled = data?.status === AppointmentStatus.Scheduled;
  const isCancelled = data?.status === AppointmentStatus.Cancelled;
  const isCompleted = data?.status === AppointmentStatus.Completed;

  // ── footer buttons ──────────────────────────────────────────────────────
  const footerButtons = (() => {
    if (!data || !data.isBooked) {
      return [
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ];
    }

    if (isScheduled) {
      return [
        <Popconfirm
          key="cancel-confirm"
          title="Huỷ lịch hẹn"
          description="Bạn có chắc chắn muốn huỷ lịch hẹn này không?"
          onConfirm={() => {
            cancelMutation.mutate(undefined, {
              onSuccess: () => {
                message.success("Huỷ lịch hẹn thành công");
                queryClient.invalidateQueries({
                  queryKey: ["doctor-appointments"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["appointment-detail", appointmentId],
                });
                onClose();
              },
              onError: (error) => {
                message.error(
                  error.response?.data?.error || "Có lỗi xảy ra khi huỷ lịch",
                );
              },
            });
          }}
          okText="Đồng ý"
          cancelText="Bỏ qua"
          okButtonProps={{ loading: cancelMutation.isPending }}
        >
          <Button
            loading={cancelMutation.isPending}
            key="cancel"
            danger
            type="primary"
          >
            Huỷ lịch hẹn
          </Button>
        </Popconfirm>,
        <Button
          key="save"
          type="primary"
          loading={isCompleting}
          onClick={handleComplete}
        >
          Đánh dấu đã hoàn thành
        </Button>,
      ];
    }

    // Cancelled or Completed
    return [
      <Button key="close" onClick={onClose}>
        Đóng
      </Button>,
    ];
  })();

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MedicineBoxOutlined
            style={{ fontSize: 20, color: token.colorPrimary }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              Chi Tiết Cuộc Hẹn
            </div>
            {data && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Mã số: #{data.appointmentId.slice(0, 8).toUpperCase()}
              </Text>
            )}
          </div>
          {data?.isBooked && statusBadge(data.status)}
        </div>
      }
      open={open}
      onCancel={onClose}
      afterClose={() => setFileList([])}
      footer={footerButtons}
      width={640}
      destroyOnHidden
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : !data ? (
        <Text type="secondary">Không tìm thấy dữ liệu.</Text>
      ) : !data.isBooked ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <CalendarOutlined
            style={{
              fontSize: 48,
              color: token.colorTextDisabled,
              marginBottom: 16,
            }}
          />
          <div>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Lịch chưa đặt
            </Text>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── Date & time card ──────────────────────────────────────── */}
          <Alert
            type="info"
            title={
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                <CalendarOutlined
                  style={{ color: token.colorPrimary, marginRight: 8 }}
                />
                {formatDate(data.date)}
              </div>
            }
            description={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <ClockCircleOutlined style={{ color: token.colorPrimary }} />
                <span style={{ color: token.colorTextSecondary }}>
                  {formatTime(data.startTime)} - {formatTime(data.endTime)}
                </span>
                <Badge
                  count={calcDuration(data.startTime, data.endTime)}
                  style={{
                    backgroundColor: token.colorBgContainer,
                    color: token.colorTextSecondary,
                    boxShadow: `0 0 0 1px ${token.colorBorder} inset`,
                    marginLeft: 4,
                  }}
                />
              </div>
            }
            showIcon={false}
            style={{ borderRadius: token.borderRadiusLG }}
          />

          {/* ── Patient info ─────────────────────────────────────────── */}
          <div>
            <Divider plain style={{ marginTop: 0 }}>
              <UserOutlined style={{ marginRight: 6 }} />
              THÔNG TIN BỆNH NHÂN
            </Divider>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px 24px",
              }}
            >
              {/* Row 1 */}
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Họ và tên
                </Text>
                <div style={{ fontWeight: 500 }}>{data.patientName}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Giới tính
                </Text>
                <div style={{ fontWeight: 500 }}>
                  {data.patientGender ? "Nữ" : "Nam"}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Ngày sinh
                </Text>
                <div style={{ fontWeight: 500 }}>
                  {formatDate(data.patientDateOfBirth)} (
                  {calcAge(data.patientDateOfBirth)} tuổi)
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <PhoneOutlined style={{ marginRight: 4 }} />
                  Số điện thoại
                </Text>
                <div style={{ fontWeight: 500, color: token.colorPrimary }}>
                  {data.patientPhone}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <MailOutlined style={{ marginRight: 4 }} />
                  Địa chỉ email
                </Text>
                <div style={{ fontWeight: 500, color: token.colorPrimary }}>
                  {data.patientEmail}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <HomeOutlined style={{ marginRight: 4 }} />
                  Địa chỉ nhà
                </Text>
                <div style={{ fontWeight: 500 }}>{data.patientAddress}</div>
              </div>
            </div>
          </div>

          {/* ── Reason ───────────────────────────────────────────────── */}
          <div>
            <Divider plain style={{ marginTop: 0 }}>
              <FileTextOutlined style={{ marginRight: 6 }} />
              LÝ DO KHÁM
            </Divider>
            <div
              style={{
                background: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadius,
                padding: "12px 16px",
                color: token.colorTextSecondary,
                lineHeight: 1.6,
              }}
            >
              {data.reason}
            </div>
          </div>

          {/* ── Booked-by user ───────────────────────────────────────── */}
          <div>
            <Divider plain style={{ marginTop: 0 }}>
              <UserOutlined style={{ marginRight: 6 }} />
              NGƯỜI ĐẶT HẸN
            </Divider>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar
                size={48}
                src={data.bookByUser.avatar}
                icon={!data.bookByUser.avatar ? <UserOutlined /> : undefined}
                style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {data.bookByUser.fullName}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MailOutlined
                    style={{ fontSize: 12, color: token.colorPrimary }}
                  />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {data.bookByUser.email}
                  </Text>
                </div>
                {data.bookByUser.phone && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <PhoneOutlined
                      style={{ fontSize: 12, color: token.colorPrimary }}
                    />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {data.bookByUser.phone}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Medical record ───────────────────────────────────────── */}
          {isScheduled && (
            <div>
              <Divider plain style={{ marginTop: 0 }}>
                <MedicineBoxOutlined style={{ marginRight: 6 }} />
                HỒ SƠ Y TẾ
              </Divider>
              <Upload
                fileList={fileList}
                onChange={({ fileList: newFileList }) =>
                  setFileList(newFileList)
                }
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên hồ sơ y tế</Button>
              </Upload>
            </div>
          )}

          {isCompleted && data.medicalRecordFileUrl && (
            <div>
              <Divider plain style={{ marginTop: 0 }}>
                <MedicineBoxOutlined style={{ marginRight: 6 }} />
                HỒ SƠ Y TẾ
              </Divider>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: token.colorFillAlter,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                  padding: "10px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FilePdfOutlined
                    style={{ fontSize: 22, color: token.colorError }}
                  />
                  <div>
                    <Text style={{ fontWeight: 500 }}>
                      {data.medicalRecordFileUrl.split("/").pop() ??
                        "medical_record"}
                    </Text>
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  href={data.medicalRecordFileUrl}
                  target="_blank"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
