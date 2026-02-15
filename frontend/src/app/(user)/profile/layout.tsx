"use client"

import { Breadcrumb, Layout, theme } from "antd";

const { Content } = Layout;

export default function ProfileLayout({ children }: React.PropsWithChildren) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (<Content style={{ padding: "0 48px", flex: 1, overflow: "auto" }}>
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={[{ title: "Trang chủ" }, { title: "Thông tin cá nhân" }]}
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
  </Content>)
}