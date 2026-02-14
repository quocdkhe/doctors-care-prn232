"use client";

import { Modal, Form, Input, App } from "antd";
import { useLogin } from "../../queries/user.queries";
import { Login } from "../../types/user";
import { useAppDispatch } from "../../store/hooks";
import { fetchCurrentUser } from "../../store/auth.slice";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const loginMutation = useLogin();
  const dispatch = useAppDispatch();

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
      onOk={() => form.submit()}
      destroyOnHidden
      confirmLoading={loginMutation.isPending}
      okText="Đăng nhập"
      cancelText="Hủy"
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
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
