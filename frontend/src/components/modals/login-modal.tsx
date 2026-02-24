"use client";

import { Modal, Form, Input, App, Button, Divider, Space } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useLogin } from "../../queries/user.queries";
import { Login } from "../../types/user";
import { useAppDispatch } from "../../store/hooks";
import { fetchCurrentUser } from "../../store/auth.slice";
import { useAuthModal } from "../../providers/auth-modal-provider";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const loginMutation = useLogin();
  const dispatch = useAppDispatch();
  const { openRegisterModal } = useAuthModal();

  const handleLogin = (values: Login) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        message.success("Đăng nhập thành công!");
        dispatch(fetchCurrentUser());
        form.resetFields();
        onClose();
      },
      onError: (error) => {
        message.error(error.response?.data?.error || "Đăng nhập thất bại!");
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Đăng nhập"
      open={open}
      onCancel={handleCancel}
      destroyOnHidden
      footer={null}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        autoComplete="off"
        preserve={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            form.submit();
          }
        }}
      >
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
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
          style={{ marginBottom: 24 }}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12 }}>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
            >
              Đăng nhập
            </Button>

            <Divider style={{ margin: "12px 0" }}>Hoặc</Divider>

            <Button icon={<GoogleOutlined />} block>
              Đăng nhập với Google
            </Button>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span>Chưa có tài khoản? </span>
              <Button
                type="link"
                onClick={openRegisterModal}
                style={{ padding: 0 }}
              >
                Đăng ký
              </Button>
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
