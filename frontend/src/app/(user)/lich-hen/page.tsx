"use client";

import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import { useGetAllAppointmentsForPatient } from "@/src/queries/appointment.queries";
import { Card, Skeleton, Typography } from "antd";
import Link from "next/link";
import AppointmentCard from "./appointment-card";

export default function PatientAppointmentsPage() {
  const { data: appointments, isLoading } = useGetAllAppointmentsForPatient();

  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        { title: "Lịch hẹn" },
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          margin: "0 25vw",
        }}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Card>
          ))
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} />
          ))
        ) : (
          <Card style={{ textAlign: "center" }}>
            <Typography.Text type="secondary">
              Bạn chưa có lịch hẹn nào.
            </Typography.Text>
          </Card>
        )}
      </div>
    </MainContentWrapper>
  );
}
