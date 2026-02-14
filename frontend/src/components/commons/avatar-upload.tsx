"use client";

import { useState } from "react";
import { Avatar, Button, Upload, Typography } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Text, Title } = Typography;

interface AvatarUploadProps {
  currentAvatar?: string;
  size?: number;
  onFileChange?: (file: File | null) => void;
}

export const AvatarUpload = ({
  currentAvatar,
  size = 200,
  onFileChange,
}: AvatarUploadProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    currentAvatar,
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    // Preview the image
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Notify parent component
      onFileChange?.(file);
    } else {
      setAvatarPreview(currentAvatar);
      onFileChange?.(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Title level={4}>Ảnh</Title>

      <Avatar
        size={size}
        src={avatarPreview}
        icon={<UserOutlined />}
        style={{ marginBottom: 8 }}
      />

      <Text type="secondary" style={{ textAlign: "center" }}>
        Tải lên ảnh. Kích thước tối đa 5MB
      </Text>


      <Upload
        listType="picture"
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={() => false} // Prevent auto upload
        maxCount={1}
        accept="image/*"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button icon={<UploadOutlined />}>Tải ảnh mới lên</Button>
      </Upload>

    </div>
  );
};
