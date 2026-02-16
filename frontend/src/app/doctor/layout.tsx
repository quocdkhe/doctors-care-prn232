"use client";

import React, { useState } from "react";
import {
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useTheme } from "@/src/providers/theme-provider";
import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { UserProfileDropdown } from "@/src/components/commons/user-profile-dropdown";

const { Header, Sider, Content } = Layout;

const DoctorLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { isDarkMode, toggleTheme } = useTheme();

  const getSelectedKey = () => {
    if (pathname?.includes("/doctor/profile")) return "profile";
    if (pathname?.includes("/doctor/slots")) return "slots";
    return "dashboard";
  };

  // Define menu items with proper typing
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "slots",
      icon: <CalendarOutlined />,
      label: "Quản lý slot",
    },
  ];

  // Better approach: use a routing map
  const routeMap: Record<string, string> = {
    profile: "/doctor/profile",
    slots: "/doctor/slots",
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const route = routeMap[key];
    if (route) {
      router.push(route);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={handleMenuClick}
            items={menuItems}
            style={{ flex: 1 }}
          />
          <div
            style={{
              padding: collapsed ? "16px 8px" : "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: !isDarkMode ? "#fff" : "",
            }}
          >
            {!collapsed && <UserProfileDropdown />}
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button
            type="text"
            icon={
              isDarkMode ? (
                <SunOutlined style={{ color: "#ffd700", fontSize: "18px" }} />
              ) : (
                <MoonOutlined style={{ fontSize: "18px" }} />
              )
            }
            onClick={toggleTheme}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;
