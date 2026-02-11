"use client";

import { Typography, Spin } from "antd";
import React, { use } from "react";
import { SpecialtyForm, SpecialtyFormData } from "@/src/components/specialty-form";
import { useGetSpecialtyById } from "@/src/queries/specialty.queries";

const { Title } = Typography;

const EditSpecialtyPage = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = use(params);
  const { data: specialty, isLoading } = useGetSpecialtyById(id);
  const handleSubmit = (data: SpecialtyFormData) => {
    console.log(data);
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
          />
        </>
      )}
    </>
  );
};

export default EditSpecialtyPage;