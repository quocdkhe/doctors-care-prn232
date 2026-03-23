"use client";

import React from "react";
import { useRouter } from "@bprogress/next/app";
import { useAppSelector } from "@/src/store/hooks";
import { Button, Result } from "antd";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const roleLabel = user?.role ?? "Unknown";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="403"
        title="401 – Unauthorized"
        subTitle={
          <>
            <p>Bạn không có quyền truy cập trang này.</p>
            {user && (
              <p style={{ marginTop: 4 }}>
                Vai trò hiện tại của bạn: <strong>{roleLabel}</strong>
              </p>
            )}
          </>
        }
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
