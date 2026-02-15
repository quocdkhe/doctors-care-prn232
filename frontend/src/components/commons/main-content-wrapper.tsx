"use client"

import { Layout, theme } from "antd";

const { Content } = Layout;

export default function MainContentWrapper({ children }: React.PropsWithChildren) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={{ padding: "0 48px", flex: 1, overflow: "auto" }}>
      <div style={{ margin: "16px 0" }}>

      </div>
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