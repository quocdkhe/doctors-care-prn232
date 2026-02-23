"use client";

import { Breadcrumb, Layout, theme, type BreadcrumbProps } from "antd";

const { Content } = Layout;

interface MainContentWrapperProps extends React.PropsWithChildren {
  breadcrumbItems?: BreadcrumbProps["items"];
}

export default function MainContentWrapper({
  children,
  breadcrumbItems,
}: MainContentWrapperProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={{ flex: 1 }}>
      <div
        className="w-full lg:max-w-[75%]"
        style={{ margin: "0 auto", padding: "0 24px" }}
      >
        {breadcrumbItems && (
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
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
      </div>
    </Content>
  );
}
