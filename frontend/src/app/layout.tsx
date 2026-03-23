import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "../providers/query-provider";
import { StoreProvider } from "../providers/store-provider";
import { AuthInitializer } from "../components/commons/auth-initializer";
import { AuthModalProvider } from "../providers/auth-modal-provider";
import "./global.css";
import ProgressBarProvider from "../providers/progress-bar-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctors Care",
  verification: {
    google: "VbUSl2Gqzhib8gMMvFgM8v572c85dggHuvq3eR1Ufd0",
  },
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html
    lang="vi"
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
            <AntdRegistry>
              <AuthModalProvider>
                <ProgressBarProvider>{children}</ProgressBarProvider>
              </AuthModalProvider>
            </AntdRegistry>
          </ThemeProvider>
        </QueryProvider>
      </StoreProvider>
    </body>
  </html>
);

export default RootLayout;
