"use client";

import { SlotDetail as SlotDetailType } from "@/src/types/slot";
import {
  Alert,
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  theme,
  Typography,
  notification,
  App,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { calculatePrice } from "@/src/utils/helper";
import { useAppSelector } from "@/src/store/hooks";
import { useEffect } from "react";
import { useCreateAppointment } from "@/src/queries/appointment.queries";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface BookingFormValues {
  bookFor: "self" | "relative";
  fullName: string;
  gender: "male" | "female";
  phone: string;
  email?: string;
  dob: dayjs.Dayjs;
  address?: string;
  reason?: string;
  paymentMethod: "at_clinic";
}

function formatSlotDate(slot: SlotDetailType) {
  const date = dayjs(slot.date);
  const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  return `${slot.startTime} - ${slot.endTime} - ${days[date.day()]} - ${date.format("DD/MM/YYYY")}`;
}

function formatPrice(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

export default function SlotDetail({ slot }: { slot: SlotDetailType }) {
  const { token } = theme.useToken();
  const [form] = Form.useForm<BookingFormValues>();
  const user = useAppSelector((state) => state.auth.user);
  // const router = useRouter();
  const { message } = App.useApp();
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  // Pre-fill with user info on first load (default is "self")
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, form]);

  const handleBookForChange = (value: "self" | "relative") => {
    if (value === "self" && user) {
      form.setFieldsValue({
        fullName: user.fullName ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
      });
    } else {
      form.setFieldsValue({ fullName: "", phone: "", email: "" });
    }
  };

  const handleSubmit = (values: BookingFormValues) => {
    if (!user?.id) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng đăng nhập để đặt lịch khám",
      });
      return;
    }

    const payload = {
      bookByUserId: user.id,
      timeSlotId: slot.slotId,
      patientName: values.fullName,
      patientGender: values.gender === "female", // true = female, false = male
      patientPhone: values.phone,
      patientEmail: values.email || "",
      patientDateOfBirth: values.dob ? values.dob.format("YYYY-MM-DD") : "",
      patientAddress: values.address || "",
      reason: values.reason || "",
    };

    createAppointment(payload, {
      onSuccess: () => {
        message.success("Đặt lịch khám thành công!");
      },
      onError: (error) => {
        message.error(
          error.response?.data?.error ||
            "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.",
        );
      },
    });
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
      {/* Doctor Detail Section */}
      <Card
        style={{ marginBottom: 24 }}
        title={
          <Text
            style={{
              color: "#1677ff",
              fontWeight: 600,
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            Đặt lịch khám
          </Text>
        }
      >
        <div style={{ display: "flex", gap: 16 }}>
          <Avatar
            src={slot.imageUrl}
            size={80}
            shape="circle"
            style={{ flexShrink: 0, border: "1px solid #e8e8e8" }}
          />
          <div>
            <Title level={5} style={{ margin: 0, color: "#1677ff" }}>
              {slot.doctorName}
            </Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
              }}
            >
              <CalendarOutlined style={{ color: "#1677ff" }} />
              <Text>{formatSlotDate(slot)}</Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginTop: 4,
              }}
            >
              <EnvironmentOutlined style={{ color: "#1677ff", marginTop: 3 }} />
              <div>
                <Text strong>{slot.clinicName}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {slot.clinicAddress}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking Form Section */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          bookFor: "self",
          gender: "male",
          paymentMethod: "at_clinic",
        }}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Book for */}
        <Form.Item name="bookFor">
          <Radio.Group onChange={(e) => handleBookForChange(e.target.value)}>
            <Radio value="self">Đặt cho mình</Radio>
            <Radio value="relative">Đặt cho người thân</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Full Name */}
        <Form.Item
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên bệnh nhân" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Họ tên bệnh nhân (bắt buộc)"
          />
        </Form.Item>
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            display: "block",
            marginTop: -16,
            marginBottom: 12,
          }}
        >
          Hãy ghi rõ Họ Và tên, viết hoa những chữ cái đầu tiên, ví dụ: Trần Văn
          Phú
        </Text>

        {/* Gender */}
        <Form.Item name="gender">
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại liên hệ" },
            {
              pattern: /^(0|\+84)[0-9]{9}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Số điện thoại liên hệ (bắt buộc)"
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
        </Form.Item>

        {/* Date of Birth */}
        <Form.Item
          name="dob"
          rules={[
            { required: true, message: "Vui lòng nhập ngày/tháng/năm sinh" },
          ]}
        >
          <DatePicker
            prefix={<CalendarOutlined />}
            placeholder="Ngày/tháng/năm sinh (bắt buộc)"
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* Address */}
        <Form.Item name="address">
          <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ" />
        </Form.Item>

        {/* Reason */}
        <Form.Item name="reason">
          <TextArea
            placeholder="Lý do khám"
            rows={3}
            style={{ resize: "vertical" }}
          />
        </Form.Item>

        {/* Payment */}
        <div style={{ marginBottom: 12 }}>
          <Text strong>Hình thức thanh toán</Text>
        </div>
        <Form.Item name="paymentMethod">
          <Radio.Group>
            <Radio value="at_clinic">
              <Text style={{ color: "#1677ff" }}>
                Thanh toán sau tại cơ sở y tế
              </Text>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Price Summary */}
        <div
          style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text>Giá khám</Text>
            <Text>
              {formatPrice(
                calculatePrice(slot.startTime, slot.endTime, slot.pricePerHour),
              )}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text>Phí đặt lịch</Text>
            <Text style={{ color: "#52c41a" }}>Miễn phí</Text>
          </div>
          <Divider style={{ margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text strong>Tổng cộng</Text>
            <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
              {formatPrice(
                calculatePrice(slot.startTime, slot.endTime, slot.pricePerHour),
              )}
            </Text>
          </div>
        </div>

        {/* Note */}
        <Alert
          style={{ marginBottom: 16 }}
          title={
            <Text>
              Quý khách vui lòng điền đầy đủ thông tin để tiết kiệm thời gian
              làm thủ tục khám
            </Text>
          }
          type="info"
          showIcon={false}
        />

        <Alert
          style={{ marginBottom: 20 }}
          title={<Text strong>LƯU Ý</Text>}
          description={
            <ul style={{ paddingLeft: 20, margin: "8px 0 0" }}>
              <li>
                Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh,
                khi điền thông tin anh/chị vui lòng:
              </li>
              <li>
                Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên, ví dụ:{" "}
                <strong>Trần Văn Phú</strong>
              </li>
              <li>
                Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin trước khi
                ấn &quot;Xác nhận&quot;
              </li>
            </ul>
          }
          type="info"
        />

        {/* Submit */}
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: "100%", fontWeight: 600 }}
            loading={isPending}
          >
            Xác nhận đặt khám
          </Button>
        </Form.Item>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", fontSize: 13 }}
        >
          Bằng việc xác nhận đặt khám, bạn đã hoàn toàn đồng ý với{" "}
          <a href="#">Điều khoản sử dụng</a> dịch vụ của chúng tôi.
        </Text>
      </Form>
    </div>
  );
}
