"use client";

import React, { useEffect } from "react";
import { useRouter } from "@bprogress/next/app";
import { useAppSelector } from "@/src/store/hooks";
import { Button, Result, Spin } from "antd";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/";
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

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
