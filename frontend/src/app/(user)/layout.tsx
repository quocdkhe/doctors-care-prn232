"use client";

import React, { useState } from "react";
import { Layout, Menu, theme, Button, Space } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../../providers/theme-provider";
import { useAppSelector } from "../../store/hooks";
import { UserProfileDropdown } from "../../components/commons/user-profile-dropdown";
import { LoginModal } from "../../components/modals/login-modal";
import { RegisterModal } from "../../components/modals/register-modal";

import Link from "next/link";
import { MedicineBoxOutlined } from "@ant-design/icons";

const { Header, Footer } = Layout;

const items = [
  {
    key: "specialty",
    label: <Link href="/kham-chuyen-khoa">Chuyên khoa</Link>,
  },
  {
    key: "facilities",
    label: <Link href="/co-so-y-te">Cơ sở y tế</Link>,
  },
];

import { usePathname } from "next/navigation";

const UserLayout: React.FC = ({ children }: React.PropsWithChildren) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = usePathname();

  const getSelectedKey = () => {
    if (pathname.includes("/kham-chuyen-khoa")) return ["specialty"];
    if (pathname.includes("/co-so-y-te")) return ["facilities"];
    return [];
  };

  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          background: colorBgContainer,
          justifyContent: "space-between",
        }}
      >
        <div
          className="demo-logo"
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: 20,
            cursor: "pointer",
          }}
        >
          <MedicineBoxOutlined
            style={{ fontSize: "24px", color: "#1890ff", marginRight: 8 }}
          />
          <Link
            href="/"
            style={{ fontSize: "20px", fontWeight: "bold", color: "inherit" }}
          >
            Doctors Care
          </Link>
        </div>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="horizontal"
          selectedKeys={getSelectedKey()}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            borderBottom: "none",
            justifyContent: "center",
          }}
        />

        {!isLoading && !user && (
          <Space size="middle">
            <Button type="primary" onClick={() => setIsLoginModalOpen(true)}>
              Đăng nhập
            </Button>
            <Button onClick={() => setIsRegisterModalOpen(true)}>
              Đăng ký
            </Button>
          </Space>
        )}

        {!isLoading && user && <UserProfileDropdown />}

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
          style={{ marginLeft: 16 }}
        />
      </Header>

      {children}

      <Footer style={{ textAlign: "center", marginTop: "auto" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <RegisterModal
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </Layout>
  );
};

export default UserLayout;
