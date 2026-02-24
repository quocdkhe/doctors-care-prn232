"use client";

import { Modal, Form, Input, App, Button, Divider, Space } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useRegister } from "../../queries/user.queries";
import { useAppDispatch } from "../../store/hooks";
import { fetchCurrentUser } from "../../store/auth.slice";
import { useAuthModal } from "../../providers/auth-modal-provider";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ open, onClose }: RegisterModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const registerMutation = useRegister();
  const dispatch = useAppDispatch();
  const { openLoginModal } = useAuthModal();

  const handleRegister = (values: any) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        message.success("Đăng ký thành công!");
        dispatch(fetchCurrentUser());
        form.resetFields();
        onClose();
      },
      onError: (error) => {
        message.error(error.response?.data?.error || "Đăng ký thất bại!");
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Đăng ký"
      open={open}
      onCancel={handleCancel}
      destroyOnHidden
      footer={null}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegister}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            form.submit();
          }
        }}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập họ và tên" autoComplete="full-name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" autoComplete="email" />
        </Form.Item>

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
          <Input
            placeholder="Nhập số điện thoại (không bắt buộc)"
            autoComplete="phone"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
          style={{ marginBottom: 24 }}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12 }}>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={registerMutation.isPending}
            >
              Đăng ký
            </Button>

            <Divider style={{ margin: "12px 0" }}>Hoặc</Divider>

            <Button icon={<GoogleOutlined />} block>
              Đăng nhập với Google
            </Button>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span>Đã có tài khoản? </span>
              <Button
                type="link"
                onClick={openLoginModal}
                style={{ padding: 0 }}
              >
                Đăng nhập
              </Button>
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
