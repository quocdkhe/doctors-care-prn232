"use client";

import { Typography, Spin, App } from "antd";
import React, { use } from "react";
import { SpecialtyForm, SpecialtyFormData } from "@/src/components/specialty-form";
import { useGetSpecialtyById, useUpdateSpecialty } from "@/src/queries/specialty.queries";
import { useUpdateFile } from "@/src/queries/file.queries";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const EditSpecialtyPage = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = use(params);
  const { data: specialty, isLoading } = useGetSpecialtyById(id);
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const updateFileMutation = useUpdateFile();
  const updateSpecialtyMutation = useUpdateSpecialty(id);

  const handleSubmit = async (data: SpecialtyFormData) => {
    try {
      let imageUrl = data.imageUrl || "";

      // Handle image upload if there's a new file
      if (data.imageFile) {
        const uploadResponse = await updateFileMutation.mutateAsync(
          {
            fileUrl: data.imageUrl || "",
            file: data.imageFile,
          });
        imageUrl = uploadResponse.message; // API returns URL in message
      }

      await updateSpecialtyMutation.mutateAsync(
        {
          name: data.name,
          description: data.description,
          imageUrl: imageUrl,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật chuyên khoa thành công!");
            queryClient.invalidateQueries({ queryKey: ["specialties"] });
            router.push("/admin/specialty");
          },
          onError: (error: any) => {
            message.error(
              error.response?.data?.error || "Cập nhật chuyên khoa thất bại!",
            );
          },
        },
      );
    } catch (error: any) {
      console.error("Error updating specialty:", error);
      message.error("Có lỗi xảy ra khi cập nhật chuyên khoa!");
    }
  };
  return (
    <>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Title level={4} style={{ margin: 0 }}>
            Chỉnh sửa chuyên khoa
          </Title>
          <SpecialtyForm
            onSubmit={handleSubmit}
            imageUrl={specialty?.imageUrl || ""}
            description={specialty?.description || ""}
            name={specialty?.name || ""}
            isLoading={updateSpecialtyMutation.isPending || updateFileMutation.isPending}
          />
        </>
      )}
    </>
  );
};

export default EditSpecialtyPage;