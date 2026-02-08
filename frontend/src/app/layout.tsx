import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "../providers/query-provider";
import { StoreProvider } from "../providers/store-provider";
import { App } from "antd";
import { AuthInitializer } from "../components/auth-initializer";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html
    lang="en"
    style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}
  >
    <body
      className="m-0 p-0 w-full h-full"
      style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}
    >
      <StoreProvider>
        <AuthInitializer />
        <QueryProvider>
          <ThemeProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </ThemeProvider>
        </QueryProvider>
      </StoreProvider>
    </body>
  </html>
);

export default RootLayout;
