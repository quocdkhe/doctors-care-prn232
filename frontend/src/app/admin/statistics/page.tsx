"use client";

import { useGetStatistics } from "@/src/queries/statistics.queries";
import { useGetTopDoctors } from "@/src/queries/doctor.queries";
import { useTheme } from "@/src/providers/theme-provider";
import { Card, Col, Row, Typography, Spin, Statistic } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

const { Title: AntdTitle } = Typography;

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function StatisticsReportPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetStatistics();
  const {
    data: topDoctors,
    isLoading: doctorsLoading,
    isError: doctorsError,
  } = useGetTopDoctors();
  const { isDarkMode } = useTheme();

  const isLoading = statsLoading || doctorsLoading;
  const isError = statsError || doctorsError;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !stats || !topDoctors) {
    return (
      <div className="flex h-96 items-center justify-center">
        <AntdTitle level={4} type="danger">
          Đã có lỗi xảy ra khi tải thống kê.
        </AntdTitle>
      </div>
    );
  }

  // Only change: explicit background + border so dark mode cards are visible
  const cardStyle = {
    background: isDarkMode ? "#1f1f1f" : "#ffffff",
    border: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
  };

  const pieData = {
    labels: ["Sắp tới", "Đã hoàn thành", "Đã hủy"],
    datasets: [
      {
        label: "Số lượng cuộc hẹn",
        data: [
          stats.appointmentStatusCount.scheduled,
          stats.appointmentStatusCount.completed,
          stats.appointmentStatusCount.cancelled,
        ],
        backgroundColor: isDarkMode
          ? ["#177ddc", "#49aa19", "#a61d24"]
          : ["#1890ff", "#52c41a", "#ff4d4f"],
        borderColor: isDarkMode ? "#141414" : "#fff",
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: topDoctors.map((d) => d.doctorName),
    datasets: [
      {
        label: "Số lượng cuộc hẹn hoàn thành",
        data: topDoctors.map((d) => d.appoinmentCount),
        backgroundColor: isDarkMode ? "#177ddc" : "#1890ff",
        borderRadius: 4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#ffffffd9" : "#000000d9",
        },
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        ticks: { color: isDarkMode ? "#ffffffd9" : "#000000d9" },
        grid: { color: isDarkMode ? "#303030" : "#f0f0f0" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#ffffffd9" : "#000000d9",
          stepSize: 1,
        },
        grid: { color: isDarkMode ? "#303030" : "#f0f0f0" },
      },
    },
  };

  return (
    <>
      <AntdTitle level={4}>Thống kê hệ thống</AntdTitle>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={cardStyle}>
            <Statistic
              title="Tổng số bệnh nhân"
              value={stats.totalUsers}
              valueStyle={{ color: isDarkMode ? "#177ddc" : "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={cardStyle}>
            <Statistic
              title="Tổng số bác sĩ"
              value={stats.totalDoctors}
              valueStyle={{ color: isDarkMode ? "#d89614" : "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={cardStyle}>
            <Statistic
              title="Tổng số cuộc hẹn"
              value={stats.totalAppointments}
              valueStyle={{ color: isDarkMode ? "#49aa19" : "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={10}>
          <Card title="Trạng thái cuộc hẹn" variant="borderless" style={cardStyle}>
            <div style={{ height: "400px" }}>
              <Pie data={pieData} options={commonOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Top 10 bác sĩ (Số cuộc hẹn hoàn thành)" variant="borderless" style={cardStyle}>
            <div style={{ height: "400px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}