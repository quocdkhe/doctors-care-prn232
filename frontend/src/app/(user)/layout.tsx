"use client";

import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, theme, Button, Space } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../../providers/theme-provider";
import { useAppSelector } from "../../store/hooks";
import { UserProfileDropdown } from "../../components/commons/user-profile-dropdown";
import { LoginModal } from "../../components/modals/login-modal";
import { RegisterModal } from "../../components/modals/register-modal";
import Hero from "@/src/components/landing/hero";

const { Header, Content, Footer } = Layout;

const items = Array.from({ length: 5 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const UserLayout: React.FC = ({ children }: React.PropsWithChildren) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          zIndex: 1,
          width: "100%",
          background: colorBgContainer,
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="horizontal"
          defaultSelectedKeys={["2"]}
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

      <Hero />

      <Content style={{ padding: "0 48px", flex: 1, overflow: "auto" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
        />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>

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
