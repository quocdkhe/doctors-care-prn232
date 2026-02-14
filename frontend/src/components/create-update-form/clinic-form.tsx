"use client";

import { useRef, useState } from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { AvatarUpload } from "../commons/avatar-upload";
import dynamic from "next/dynamic";
import { TextEditorHandle } from "../commons/text-editor";

const TextEditor = dynamic(() => import("../commons/text-editor"), {
  ssr: false,
});

export interface ClinicFormData {
  name: string;
  description: string;
  city: string;
  address: string;
  imageUrl: string | null;
  imageFile: File | null;
}

interface ClinicFormProps {
  imageUrl?: string;
  description?: string;
  name?: string;
  city?: string;
  address?: string;
  onSubmit: (data: ClinicFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const CITIES = [
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
  { value: "Bình Dương", label: "Bình Dương" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
];

export const ClinicForm = ({
  imageUrl,
  description,
  name,
  city,
  address,
  onSubmit,
  isLoading = false,
  submitButtonText = "Lưu phòng khám",
}: ClinicFormProps) => {
  const [form] = Form.useForm();
  const editorRef = useRef<TextEditorHandle>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const onFinish = (values: {
    name: string;
    city: string;
    address: string;
  }) => {
    // Get description from text editor
    const editorDescription = editorRef.current?.getContent() || "";

    // Pass data to parent
    onSubmit({
      name: values.name,
      description: editorDescription,
      city: values.city,
      address: values.address,
      imageUrl: imageUrl || null,
      imageFile: selectedImage,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ name, city, address }}
    >
      {/* First Row - Image Upload and Form Fields */}
      <Row gutter={16}>
        {/* Left Column - Avatar Upload */}
        <Col sm={24} md={8}>
          <AvatarUpload
            currentAvatar={imageUrl}
            onFileChange={handleImageChange}
          />
        </Col>
        {/* add a little bit space here */}

        {/* Right Column - Form Fields */}
        <Col sm={24} md={16}>
          <Form.Item
            label="Tên phòng khám"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên phòng khám!" },
            ]}
          >
            <Input placeholder="Nhập tên phòng khám" />
          </Form.Item>

          <Form.Item
            label="Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng chọn thành phố!" }]}
          >
            <Select placeholder="Chọn thành phố" options={CITIES} />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ height: 32 }}></div>
      {/* Second Row - Text Editor (Full Width) */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Mô tả phòng khám" name="description">
            <TextEditor ref={editorRef} initialValue={description} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
            >
              {submitButtonText}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
