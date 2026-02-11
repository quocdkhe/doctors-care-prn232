"use client";

import React from "react";
import {
  SpecialtyForm,
  SpecialtyFormData,
} from "@/src/components/specialty-form";
import { useRouter } from "next/navigation";
import { Typography, App } from "antd";
import { useCreateSpecialty } from "@/src/queries/specialty.queries";
import { useUploadFile } from "@/src/queries/file.queries";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const AddNewSpecialtyPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const createMutation = useCreateSpecialty();
  const uploadFileMutation = useUploadFile();

  const handleSubmit = async (data: SpecialtyFormData) => {
    try {
      let imageUrl = data.imageUrl;

      // Handle image upload if there's a new file
      if (data.imageFile) {
        const uploadResponse = await uploadFileMutation.mutateAsync(
          data.imageFile,
        );
        imageUrl = uploadResponse.message; // API returns URL in message
      }

      await createMutation.mutateAsync(
        {
          name: data.name,
          description: data.description,
          imageUrl: imageUrl,
        },
        {
          onSuccess: () => {
            message.success("Tạo chuyên khoa mới thành công!");
            queryClient.invalidateQueries({ queryKey: ["specialties"] });
            router.push("/admin/specialty");
          },
          onError: (error) => {
            message.error(
              error.response?.data?.error || "Tạo chuyên khoa thất bại!",
            );
          },
        },
      );
    } catch (error) {
      console.error("Error creating specialty:", error);
      message.error("Có lỗi xảy ra khi tạo chuyên khoa!");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Thêm mới chuyên khoa
      </Title>
      <SpecialtyForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || uploadFileMutation.isPending}
      />
    </div>
  );
};

export default AddNewSpecialtyPage;
