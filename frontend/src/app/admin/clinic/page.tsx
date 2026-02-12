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
  useGetClinicList,
  useDeleteClinic,
} from "@/src/queries/clinic.queries";
import { Clinic } from "@/src/types/clinic";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Error } from "@/src/types/common";

const { Title } = Typography;

export default function ClinicPage() {
  const router = useRouter();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { data: clinics, isLoading, error } = useGetClinicList();
  const deleteMutation = useDeleteClinic();

  // Find selected clinic from the clinics array
  const selectedClinic = clinics?.find(
    (clinic: Clinic) => clinic.id === selectedClinicId,
  );

  const handleViewDetail = (id: string) => {
    setSelectedClinicId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success(`Đã xóa phòng khám "${name}" thành công!`);
        queryClient.invalidateQueries({ queryKey: ["clinics"] });
      },
      onError: (error: AxiosError<Error>) => {
        message.error(
          error.response?.data?.error || `Xóa phòng khám "${name}" thất bại!`,
        );
      },
    });
  };

  const columns: ColumnsType<Clinic> = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) => (
        <Image
          src={imageUrl || undefined}
          alt="Clinic"
          height={60}
          style={{ objectFit: "contain", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên phòng khám",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Địa chỉ",
      key: "fullAddress",
      render: (_, record) => `${record.address}, ${record.city}`,
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
              // Edit functionality will be implemented later
              router.push(`/admin/clinic/${record.id}`);
            }}
          />
          <Popconfirm
            title="Xóa phòng khám"
            description={`Bạn có chắc chắn muốn xóa phòng khám "${record.name}"?`}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id, record.name)}
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
      <Alert
        title="Lỗi"
        description={
          error.response?.data?.error || "Không thể tải danh sách phòng khám"
        }
        type="error"
        showIcon
      />
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
        <Title level={4} style={{ margin: 0 }}>
          Quản lý phòng khám
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.push("/admin/clinic/add-new");
          }}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clinics}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number) => `Tổng cộng ${total} phòng khám`,
        }}
        bordered
      />

      <Drawer
        title="Chi tiết phòng khám"
        placement="right"
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
        size={"100vw"}
      >
        {selectedClinic ? (
          <>
            <Descriptions
              column={1}
              bordered
              styles={{ label: { width: "200px" } }}
            >
              <Descriptions.Item label="Hình ảnh">
                <Image
                  src={selectedClinic.imageUrl || undefined}
                  alt={selectedClinic.name}
                  height={100}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Tên phòng khám">
                {selectedClinic.name}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ đầy đủ">
                {`${selectedClinic.address}, ${selectedClinic.city}`}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedClinic.description,
                  }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedClinic.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {dayjs(selectedClinic.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Drawer>
    </>
  );
}
