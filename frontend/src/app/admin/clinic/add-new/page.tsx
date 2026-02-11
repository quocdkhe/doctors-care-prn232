"use client";

import React from "react";
import {
  ClinicForm,
  ClinicFormData,
} from "@/src/components/clinic-form";
import { useRouter } from "next/navigation";
import { Typography, App } from "antd";
import { useCreateClinic } from "@/src/queries/clinic.queries";
import { useUploadFile } from "@/src/queries/file.queries";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const AddNewClinicPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const createMutation = useCreateClinic();
  const uploadFileMutation = useUploadFile();

  const handleSubmit = async (data: ClinicFormData) => {
    try {
      let imageUrl = data.imageUrl;

      // Handle image upload if there's a new file
      if (data.imageFile) {
        const uploadResponse = await uploadFileMutation.mutateAsync(
          data.imageFile,
        );
        imageUrl = uploadResponse.message; // API returns URL in message
      } else {
        message.error("Vui lòng tải lên ảnh!");
        return;
      }

      await createMutation.mutateAsync(
        {
          name: data.name,
          description: data.description,
          imageUrl: imageUrl,
          city: data.city,
          address: data.address,
        },
        {
          onSuccess: () => {
            message.success("Tạo phòng khám mới thành công!");
            queryClient.invalidateQueries({ queryKey: ["clinics"] });
            router.push("/admin/clinic");
          },
          onError: (error: any) => {
            message.error(
              error.response?.data?.error || "Tạo phòng khám thất bại!",
            );
          },
        },
      );
    } catch (error: any) {
      console.error("Error creating clinic:", error);
      message.error("Có lỗi xảy ra khi tạo phòng khám!");
    }
  };

  return (
    <>
      <Title level={4} style={{ margin: 0 }}>
        Thêm mới phòng khám
      </Title>
      <ClinicForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || uploadFileMutation.isPending}
      />
    </>
  );
};

export default AddNewClinicPage;