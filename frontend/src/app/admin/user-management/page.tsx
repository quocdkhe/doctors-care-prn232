"use client";

import { Table, Tag, Avatar, Typography, Alert, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGetUserList } from "@/src/queries/user.queries";
import { UserInfo, UserRoleEnum } from "@/src/types/user";

const { Title } = Typography;

const UserListPage = () => {
  const { data: users, isLoading, error } = useGetUserList();

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

  return (
    <>
      <Title level={3}>Quản lý người dùng</Title>
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
    </>
  );
};

export default UserListPage;
