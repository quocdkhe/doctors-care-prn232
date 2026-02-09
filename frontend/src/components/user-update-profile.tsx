"use client";

import { useState } from "react";
import { Form, Input, Button, Row, Col, Typography, App, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useUpdateProfile } from "../queries/user.queries";
import { useUploadFile, useUpdateFile } from "../queries/file.queries";
import { fetchCurrentUser } from "../store/auth.slice";
import { AvatarUpload } from "./avatar-upload";

const { Title, Text } = Typography;

export const UserUpdateProfile = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const updateProfileMutation = useUpdateProfile();
  const uploadFileMutation = useUploadFile();
  const updateFileMutation = useUpdateFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (values: any) => {
    if (!user) return;

    try {
      let avatarUrl = user.avatar;

      // Handle avatar upload/update if there's a new file
      if (selectedFile) {
        if (user.avatar) {
          // Update existing avatar
          const updateResponse = await updateFileMutation.mutateAsync({
            fileUrl: user.avatar,
            file: selectedFile,
          });
          avatarUrl = updateResponse.message; // Assuming API returns new URL in message
        } else {
          // Upload new avatar
          const uploadResponse =
            await uploadFileMutation.mutateAsync(selectedFile);
          avatarUrl = uploadResponse.message; // Assuming API returns URL in message
        }
      }

      const updateData: any = {
        fullName: values.fullName,
        phone: values.phone,
      };

      // Only include password if it's provided
      if (values.password) {
        updateData.password = values.password;
      }

      // Include avatar URL if changed
      if (avatarUrl !== user.avatar) {
        updateData.avatar = avatarUrl;
      }

      await updateProfileMutation.mutateAsync(updateData);
      message.success("Cập nhật thông tin thành công!");
      dispatch(fetchCurrentUser());
      form.resetFields(["password", "confirmPassword"]);
      setSelectedFile(null);
    } catch (error: any) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Cập nhật thông tin thất bại!",
      );
    }
  };

  if (!user) return null;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      }}
    >
      <Row gutter={48}>
        {/* Left Column - Form Fields */}
        <Col xs={24} md={14}>
          <Title level={4}>
            <UserOutlined /> Thông tin cá nhân
          </Title>

          <Form.Item label="Địa chỉ Email (Không thể thay đổi)" name="email">
            <Input disabled prefix={<UserOutlined />} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                  { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Thay đổi mật khẩu</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Mật khẩu phải có ít nhất 8 ký tự bao gồm cả chữ, số và ký tự đặc
            biệt
          </Text>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && !getFieldValue("password")) {
                        return Promise.resolve();
                      }
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        {/* Right Column - Avatar Upload */}
        <Col xs={24} md={10}>
          <AvatarUpload
            currentAvatar={user.avatar}
            onFileChange={setSelectedFile}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Button
            type="primary"
            htmlType="submit"
            loading={
              updateProfileMutation.isPending ||
              uploadFileMutation.isPending ||
              updateFileMutation.isPending
            }
            size="large"
          >
            Lưu thay đổi
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={() => {
              form.resetFields();
              // setAvatarPreview(user.avatar);
              // setFileList([]);
            }}
            size="large"
          >
            Hủy
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
