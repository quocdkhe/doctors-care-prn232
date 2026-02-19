"use client";

import { Select, DatePicker } from "antd";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

const CITY_OPTIONS = [
  { label: "Toàn quốc", value: "" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Bình Dương", value: "Bình Dương" },
];

export default function SpecialtyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city") ?? "";
  const currentDate = searchParams.get("date") ?? "";

  const navigate = (city: string, date: string) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (date) params.set("date", date);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleCityChange = (value: string) => {
    navigate(value, currentDate);
  };

  const handleDateChange = (date: Dayjs | null) => {
    navigate(currentCity, date ? date.format("YYYY-MM-DD") : "");
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Select
        options={CITY_OPTIONS}
        value={currentCity}
        onChange={handleCityChange}
        style={{ minWidth: 160 }}
        placeholder="Chọn tỉnh / thành phố"
      />
      <DatePicker
        value={currentDate ? dayjs(currentDate) : null}
        onChange={handleDateChange}
        format="DD/MM/YYYY"
        placeholder="Chọn ngày khám"
        allowClear
      />
    </div>
  );
}
