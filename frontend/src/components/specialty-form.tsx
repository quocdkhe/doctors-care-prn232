"use client";

import { useRef, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { AvatarUpload } from "./avatar-upload";
import dynamic from "next/dynamic";
import { TextEditorHandle } from "./text-editor";

const TextEditor = dynamic(() => import("./text-editor"), {
  ssr: false,
});

export interface SpecialtyFormData {
  name: string;
  description: string;
  imageUrl: string | null;
  imageFile: File | null;
}

interface SpecialtyFormProps {
  imageUrl?: string;
  description?: string;
  name?: string;
  onSubmit: (data: SpecialtyFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const SpecialtyForm = ({
  imageUrl,
  description,
  name,
  onSubmit,
  isLoading = false,
  submitButtonText = "Lưu chuyên khoa",
}: SpecialtyFormProps) => {
  const [form] = Form.useForm();
  const editorRef = useRef<TextEditorHandle>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const onFinish = (values: { name: string }) => {
    // Get description from text editor
    const editorDescription = editorRef.current?.getContent() || "";

    // Pass data to parent
    onSubmit({
      name: values.name,
      description: editorDescription,
      imageUrl: imageUrl || null,
      imageFile: selectedImage,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ name }}
    >
      <Row gutter={16}>
        {/* Left Column - Avatar Upload */}
        <Col sm={24} md={8}>
          <AvatarUpload
            currentAvatar={imageUrl}
            size={200}
            onFileChange={handleImageChange}
          />
        </Col>

        {/* Right Column - Form Fields */}
        <Col sm={24} md={16}>
          <Form.Item
            label="Tên chuyên khoa"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên chuyên khoa!" },
            ]}
          >
            <Input placeholder="Nhập tên chuyên khoa" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả chuyên khoa"
            name="description"
            rules={[
              {
                validator: async () => {
                  const content = editorRef.current?.getContent() || "";
                  if (!content || content === "<p></p>") {
                    throw new Error("Vui lòng nhập mô tả chuyên khoa!");
                  }
                },
              },
            ]}
          >
            <TextEditor ref={editorRef} initialValue={description} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={isLoading}
              block
            >
              {submitButtonText}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
