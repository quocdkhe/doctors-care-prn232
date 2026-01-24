"use client";

import React from "react";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../providers/ThemeProvider";

const { Header, Content, Footer } = Layout;

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const UserLayout: React.FC = ({ children }: React.PropsWithChildren) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button
          type="text"
          icon={
            isDarkMode ? (
              <SunOutlined style={{ color: "#ffd700", fontSize: "18px" }} />
            ) : (
              <MoonOutlined style={{ color: "#fff", fontSize: "18px" }} />
            )
          }
          onClick={toggleTheme}
          style={{ marginLeft: 16 }}
        />
      </Header>
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
    </Layout>
  );
};

export default UserLayout;
