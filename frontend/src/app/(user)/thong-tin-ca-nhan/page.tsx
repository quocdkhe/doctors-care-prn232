"use client";

import { UserUpdateProfile } from "@/src/components/create-update-form/user-update-profile";
import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: "Thông tin cá nhân" },
      ]}
    >
      <UserUpdateProfile />
    </MainContentWrapper>
  );
}
