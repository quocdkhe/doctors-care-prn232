"use client";

import { Avatar, Dropdown, App, Skeleton, Space, Typography } from "antd";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth.slice";
import { useLogout } from "../queries/user.queries";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export const UserProfileDropdown = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(logout());
        message.success("Đăng xuất thành công!");
        router.push("/");
      },
      onError: (error) => {
        message.error(error.response?.data?.error || "Đăng xuất thất bại!");
      },
    });
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      onClick: () => router.push("/"),
    },
  ];

  if (user?.role === "Admin") {
    menuItems.unshift({
      key: "admin",
      icon: <UserOutlined />,
      label: "Admin",
      onClick: () => router.push("/admin"),
    });
  }

  if (isLoading) {
    return (
      <Space size="middle" style={{ cursor: "pointer" }}>
        <Skeleton.Avatar active size="default" />
        <div>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 120, marginTop: 4 }}
          />
        </div>
      </Space>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Space size="middle" style={{ cursor: "pointer" }}>
        <Avatar src={user.avatar || undefined} icon={<UserOutlined />} />
        <div
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text strong>{user.fullName}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {user.email}
          </Text>
        </div>
      </Space>
    </Dropdown>
  );
};
