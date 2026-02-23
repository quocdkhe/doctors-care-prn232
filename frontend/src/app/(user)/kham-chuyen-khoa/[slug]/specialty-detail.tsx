"use client";

import { useState } from "react";
import { SpecialtyInfo } from "@/src/types/specialty";
import { theme } from "antd";
import SpecialtyFilter from "../../../../components/commons/doctor-filter";

export default function SpecialtyDetail({
  specialty,
}: {
  specialty: SpecialtyInfo;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = theme.useToken();
  return (
    <>
      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
        {specialty.specialtyName}
      </h2>

      <div
        style={{
          maxHeight: isExpanded ? "none" : "150px", // Adjust height as needed
          overflow: "hidden",
          position: "relative",
          transition: "max-height 0.3s ease",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: specialty.specialtyDescription }}
        />
        {!isExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50px",
            }}
          />
        )}
      </div>

      <a
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        style={{
          textAlign: "center",
          color: token.colorPrimary,
          display: "block",
          marginBottom: "32px",
          marginTop: "12px",
          cursor: "pointer",
        }}
      >
        {isExpanded ? "Thu gọn" : "Xem thêm"}
      </a>
      <SpecialtyFilter />
    </>
  );
}
