"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Button, Layout, Menu, theme } from "antd";
import { useTheme } from "@/src/providers/theme-provider";
import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { UserProfileDropdown } from "@/src/components/commons/user-profile-dropdown";
import { AppointmentItem } from "@/src/types/appointment";
import { useAppSelector } from "@/src/store/hooks";
import { useNotifications } from "@/src/lib/use-notification";
import { useQueryClient } from "@tanstack/react-query";

const { Header, Sider, Content } = Layout;

const DoctorLayoutInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<AppointmentItem[]>([]);
  const { notification } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { isDarkMode, toggleTheme } = useTheme();

  const getSelectedKey = () => {
    if (pathname?.includes("/doctor/profile")) return "profile";
    if (pathname?.includes("/doctor/slots")) return "slots";
    if (pathname?.includes("/doctor/schedules")) return "schedules";
    return "dashboard";
  };

  // useCallback prevents useEffect from re-running on every render
  const handleNotification = useCallback((notification: AppointmentItem) => {
    setNotifications((prev) => [notification, ...prev]);
    queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    queryClient.invalidateQueries({ queryKey: ["current-doctor-slots"] });
    queryClient.invalidateQueries({ queryKey: ["appointment-detail", notification.appointmentId] });
  }, []);

  useNotifications(handleNotification, user?.id);

  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    if (latest.isBooked) {
      notification.success({
        title: "Lịch đã được đặt",
        description: `Bệnh nhân: ${latest.patientName} | Thời gian: ${latest.startTime} - ${latest.endTime}, ${latest.date}`,
        placement: "topRight",
        duration: 5,
      });
    } else {
      notification.warning({
        title: "Lịch đã bị hủy",
        description: `Thời gian: ${latest.startTime} - ${latest.endTime}, ${latest.date}`,
        placement: "topRight",
        duration: 5,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  // Define menu items with proper typing
  const menuItems: MenuProps["items"] = [
    {
      key: "slots",
      icon: <ClockCircleOutlined />, // represents time slots
      label: "Quản lý slot",
    },
    {
      key: "schedules",
      icon: <MedicineBoxOutlined />, // represents medical appointments/schedules
      label: "Lịch khám",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
  ];

  // Better approach: use a routing map
  const routeMap: Record<string, string> = {
    profile: "/doctor/profile",
    slots: "/doctor/slots",
    schedules: "/doctor/schedules",
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

const DoctorLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <App>
    <DoctorLayoutInner>{children}</DoctorLayoutInner>
  </App>
);

export default DoctorLayout;
