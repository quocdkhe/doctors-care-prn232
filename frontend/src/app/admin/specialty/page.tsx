"use client";

import React, { useState } from "react";
import {
  Table,
  Typography,
  Alert,
  Space,
  Button,
  Drawer,
  Descriptions,
  Image,
  App,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useGetSpecialtyList,
  useDeleteSpecialty,
} from "@/src/queries/specialty.queries";
import { Specialty } from "@/src/types/specialty";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function SpecialtyPage() {
  const router = useRouter();
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { data: specialties, isLoading, error } = useGetSpecialtyList();
  const deleteMutation = useDeleteSpecialty();

  // Find selected specialty from the specialties array
  const selectedSpecialty = specialties?.find(
    (specialty) => specialty.id === selectedSpecialtyId,
  );

  const handleViewDetail = (id: number) => {
    setSelectedSpecialtyId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success(`Đã xóa chuyên khoa "${name}" thành công!`);
        queryClient.invalidateQueries({ queryKey: ["specialties"] });
      },
      onError: (error) => {
        message.error(
          error.response?.data?.error || `Xóa chuyên khoa "${name}" thất bại!`,
        );
      },
    });
  };

  const columns: ColumnsType<Specialty> = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) => (
        <Image
          src={imageUrl || undefined}
          alt="Specialty"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên chuyên khoa",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // Edit functionality - ignore for now
            }}
          />
          <Popconfirm
            title="Xóa chuyên khoa"
            description={`Bạn có chắc chắn muốn xóa chuyên khoa "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          title="Lỗi"
          description={
            error.response?.data?.error || "Không thể tải danh sách chuyên khoa"
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Quản lý chuyên khoa
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.push("/admin/specialty/add-new");
          }}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={specialties}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} chuyên khoa`,
        }}
        bordered
      />

      <Drawer
        title="Chi tiết chuyên khoa"
        placement="right"
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
        size={"large"}
      >
        {selectedSpecialty ? (
          <>
            <Image
              src={selectedSpecialty.imageUrl || undefined}
              alt={selectedSpecialty.name}
              style={{
                width: "100%",
                marginBottom: 24,
                borderRadius: 8,
              }}
            />
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên chuyên khoa">
                {selectedSpecialty.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedSpecialty.description,
                  }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedSpecialty.createdAt).format(
                  "DD/MM/YYYY HH:mm:ss",
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {dayjs(selectedSpecialty.updatedAt).format(
                  "DD/MM/YYYY HH:mm:ss",
                )}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Drawer>
    </>
  );
}
