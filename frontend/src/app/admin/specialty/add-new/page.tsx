"use client";

import { Button, Form, Input, message } from "antd";
import { useCreateSpecialty } from "../../../../queries/specialty.queries";
import { useRouter } from "next/navigation";

export default function AddNewSpecialtyPage() {
  const router = useRouter();
  const createMutation = useCreateSpecialty();

  const onFinish = async (values: { name: string; description: string }) => {
    createMutation.mutate(
      {
        name: values.name,
        description: values.description,
        imageUrl: "",
      },
      {
        onSuccess: () => {
          message.success("Đã thêm chuyên khoa thành công!");
          router.push("/admin/specialty");
        },
        onError: (error) => {
          message.error(error.response?.data?.error || "Đã có lỗi xảy ra");
        },
      }
    );
  };

  return (
    <div>
      <h1>Thêm chuyên khoa mới</h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Tên chuyên khoa"
          rules={[{ required: true, message: "Vui lòng nhập tên chuyên khoa" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}