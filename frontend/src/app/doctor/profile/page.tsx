"use client";

import { useRef, useState } from "react";
import { Form, Input, Button, Row, Col, Select, Spin, App, InputNumber } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { AvatarUpload } from "@/src/components/commons/avatar-upload";
import dynamic from "next/dynamic";
import { TextEditorHandle } from "@/src/components/commons/text-editor";
import {
  useGetDoctorProfile,
  useUpdateDoctorProfile,
} from "@/src/queries/doctor.queries";
import { useGetClinicList } from "@/src/queries/clinic.queries";
import { useGetSpecialtyList } from "@/src/queries/specialty.queries";
import { useUploadFile, useUpdateFile } from "@/src/queries/file.queries";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateDoctorProfile } from "@/src/types/doctor";
import { Typography } from "antd";

const TextEditor = dynamic(
  () => import("@/src/components/commons/text-editor"),
  {
    ssr: false,
  },
);

export default function DoctorProfilePage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const editorRef = useRef<TextEditorHandle>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Queries
  const { data: doctorProfile, isLoading: isLoadingProfile } =
    useGetDoctorProfile();
  const { data: clinics, isLoading: isLoadingClinics } = useGetClinicList();
  const { data: specialties, isLoading: isLoadingSpecialties } =
    useGetSpecialtyList();

  // Mutations
  const updateDoctorProfile = useUpdateDoctorProfile();
  const uploadFile = useUploadFile();
  const updateFile = useUpdateFile();

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const onFinish = async (values: any) => {
    try {
      // Get biography from text editor
      const biography = editorRef.current?.getContent() || "";

      let imageUrl = doctorProfile?.user.avatar;

      // Handle image upload
      if (selectedImage) {
        if (imageUrl) {
          // Update existing image
          const updateResult = await updateFile.mutateAsync({
            fileUrl: imageUrl,
            file: selectedImage,
          });
          imageUrl = updateResult.message;
        } else {
          // Upload new image
          const uploadResult = await uploadFile.mutateAsync(selectedImage);
          imageUrl = uploadResult.message;
        }
      }

      // Update doctor profile with all info
      const updateData: UpdateDoctorProfile = {
        biography,
        specialtyId: values.specialtyId,
        clinicId: values.clinicId,
        imageUrl,
        fullName: values.fullName,
        phone: values.phone,
        pricePerHour: values.pricePerHour,
      };

      if (values.password) {
        updateData.password = values.password;
      }

      await updateDoctorProfile.mutateAsync(updateData);

      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });

      // Reset sensitive fields
      form.resetFields(["password", "confirmPassword"]);

      message.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      message.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật hồ sơ!",
      );
      console.error(error);
    }
  };

  const isLoading =
    isLoadingProfile || isLoadingClinics || isLoadingSpecialties;
  const isSaving =
    updateDoctorProfile.isPending ||
    uploadFile.isPending ||
    updateFile.isPending;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Title level={4} style={{ margin: 0 }}>
        Hồ sơ bác sĩ
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          specialtyId: doctorProfile?.specialtyId || undefined,
          clinicId: doctorProfile?.clinicId || undefined,
          fullName: doctorProfile?.user.fullName,
          phone: doctorProfile?.user.phone,
          email: doctorProfile?.user.email,
          pricePerHour: doctorProfile?.pricePerHour,
        }}
      >
        {/* First Row - Image Upload and Form Fields */}
        <Row gutter={16}>
          {/* Left Column - Avatar Upload */}
          <Col sm={24} md={8}>
            <AvatarUpload
              currentAvatar={doctorProfile?.user.avatar}
              onFileChange={handleImageChange}
            />
          </Col>

          {/* Right Column - Form Fields */}
          <Col sm={24} md={16}>
            <Form.Item label="Email (Không thể thay đổi)" name="email">
              <Input disabled />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                    { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="password"
                  rules={[
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value && !getFieldValue("password")) {
                          return Promise.resolve();
                        }
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <div style={{ height: 32 }}></div>

        {/* Second Row - Doctor Info */}
        <Row gutter={16}>
          <Col sm={24} md={8}>
            <Form.Item label="Chuyên khoa" name="specialtyId">
              <Select
                placeholder="Chọn chuyên khoa"
                allowClear
                options={specialties?.map((specialty) => ({
                  value: specialty.id,
                  label: specialty.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={8}>
            <Form.Item label="Phòng khám" name="clinicId">
              <Select
                placeholder="Chọn phòng khám"
                allowClear
                options={clinics?.map((clinic) => ({
                  value: clinic.id,
                  label: clinic.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={8}>
            <Form.Item
              label="Giá mỗi giờ (VNĐ)"
              name="pricePerHour"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                placeholder="Nhập giá mỗi giờ"
              />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ height: 32 }}></div>
        {/* Third Row - Text Editor (Full Width) */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Tiểu sử" name="biography">
              <TextEditor
                ref={editorRef}
                initialValue={doctorProfile?.biography || ""}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
              >
                Lưu hồ sơ
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
