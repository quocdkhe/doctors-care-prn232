"use client";

import { Typography, Spin, App } from "antd";
import React, { use } from "react";
import { ClinicForm, ClinicFormData } from "@/src/components/clinic-form";
import { useGetClinic, useUpdateClinic } from "@/src/queries/clinic.queries";
import { useUpdateFile } from "@/src/queries/file.queries";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const EditClinicPage = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = use(params);
  const { data: clinic, isLoading } = useGetClinic(id);
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const updateFileMutation = useUpdateFile();
  const updateClinicMutation = useUpdateClinic(id);

  const handleSubmit = async (data: ClinicFormData) => {
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

      await updateClinicMutation.mutateAsync(
        {
          name: data.name,
          description: data.description,
          imageUrl: imageUrl,
          city: data.city,
          address: data.address,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật phòng khám thành công!");
            queryClient.invalidateQueries({ queryKey: ["clinics"] });
            router.push("/admin/clinic");
          },
          onError: (error: any) => {
            message.error(
              error.response?.data?.error || "Cập nhật phòng khám thất bại!",
            );
          },
        },
      );
    } catch (error: any) {
      console.error("Error updating clinic:", error);
      message.error("Có lỗi xảy ra khi cập nhật phòng khám!");
    }
  };
  return (
    <>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Title level={4} style={{ margin: 0 }}>
            Chỉnh sửa phòng khám
          </Title>
          <ClinicForm
            onSubmit={handleSubmit}
            imageUrl={clinic?.imageUrl || ""}
            description={clinic?.description || ""}
            name={clinic?.name || ""}
            city={clinic?.city || ""}
            address={clinic?.address || ""}
            isLoading={updateClinicMutation.isPending || updateFileMutation.isPending}
            submitButtonText="Cập nhật phòng khám"
          />
        </>
      )}
    </>
  );
};

export default EditClinicPage;
