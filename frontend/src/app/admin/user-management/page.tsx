"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Typography,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGetUserList, useCreateUser } from "@/src/queries/user.queries";
import { UserInfo, UserRoleEnum, AdminCreateUser } from "@/src/types/user";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const UserListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useGetUserList();
  const createUserMutation = useCreateUser();

  const columns: ColumnsType<UserInfo> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string | undefined) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | undefined) => phone || "-",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Quản trị viên", value: UserRoleEnum.Admin },
        { text: "Bác sĩ", value: UserRoleEnum.Doctor },
        { text: "Bệnh nhân", value: UserRoleEnum.Patient },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: UserRoleEnum) => {
        let color = "default";
        if (role === UserRoleEnum.Admin) color = "red";
        else if (role === UserRoleEnum.Doctor) color = "blue";
        else if (role === UserRoleEnum.Patient) color = "green";

        return <Tag color={color}>{role}</Tag>;
      },
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          title="Lỗi"
          description={
            error.response?.data?.message ||
            "Không thể tải danh sách người dùng"
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  const handleCreateUser = async (values: AdminCreateUser) => {
    createUserMutation.mutate(values, {
      onSuccess: () => {
        form.resetFields();
        message.success("Tạo người dùng thành công!");
        setIsModalOpen(false);
        // Refresh the user list
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error) => {
        message.error(
          error.response?.data?.error || "Tạo người dùng thất bại!",
        );
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Quản lý người dùng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Tạo người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} người dùng`,
        }}
        bordered
      />

      <Modal
        title="Tạo người dùng mới"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={createUserMutation.isPending}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          autoComplete="off"
        >
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

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
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
            <Input placeholder="Nhập số điện thoại (không bắt buộc)" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value={UserRoleEnum.Admin}>
                Quản trị viên
              </Select.Option>
              <Select.Option value={UserRoleEnum.Doctor}>Bác sĩ</Select.Option>
              <Select.Option value={UserRoleEnum.Patient}>
                Bệnh nhân
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserListPage;
