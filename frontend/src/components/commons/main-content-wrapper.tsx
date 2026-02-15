"use client"

import { Breadcrumb, Layout, theme, type BreadcrumbProps } from "antd";

const { Content } = Layout;

interface MainContentWrapperProps extends React.PropsWithChildren {
  breadcrumbItems?: BreadcrumbProps['items'];
}

export default function MainContentWrapper({ children, breadcrumbItems }: MainContentWrapperProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={{ padding: "0 48px", flex: 1, overflow: "auto" }}>
      {breadcrumbItems && (
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={breadcrumbItems}
        />
      )}
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