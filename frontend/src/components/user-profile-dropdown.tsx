"use client";

import { Avatar, Dropdown, Skeleton, Space, Typography } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth.slice";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export const UserProfileDropdown = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

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
        <div style={{ textAlign: "left" }}>
          <div>
            <Text strong>{user.fullName}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {user.email}
            </Text>
          </div>
        </div>
      </Space>
    </Dropdown>
  );
};
