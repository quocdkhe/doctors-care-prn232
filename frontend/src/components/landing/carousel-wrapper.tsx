"use client";
import React from "react";
import { Carousel, theme } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function CarouselWrapper({ children }: React.PropsWithChildren) {
  const { token } = theme.useToken();

  const arrowStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    color: token.colorText,
    boxShadow: token.boxShadowSecondary,
    border: `1px solid ${token.colorBorderSecondary}`,
  };

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;  // ❌ drop className, it carries slick's broken styles
    return (
      <button
        onClick={onClick}
        style={{
          ...arrowStyle,
          position: "absolute",
          left: "-20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "opacity 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <LeftOutlined style={{ fontSize: token.fontSizeLG }} />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        style={{
          ...arrowStyle,
          position: "absolute",
          right: "-20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "opacity 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <RightOutlined style={{ fontSize: token.fontSizeLG }} />
      </button>
    );
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  return (
    <div
      className="py-12 px-4"
      style={{
        backgroundColor: token.colorBgContainer,
      }}
    >
      <div className="px-4">
        <Carousel {...carouselSettings} draggable>
          {children}
        </Carousel>
      </div>
    </div>
  );
}