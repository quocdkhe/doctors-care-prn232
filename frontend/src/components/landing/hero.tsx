import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Cropped and dimmed background image */}
      <div className="absolute inset-0">
        <Image
          src={"/bookingcare-cover-4.jpg"}
          alt="Hero"
          fill
          className="object-cover"
          style={{ objectPosition: "top" }}
          priority
        />
        {/* Dimming overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-4xl mb-4">NỀN TẢNG Y TẾ</h1>
        <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold">
          CHĂM SÓC SỨC KHOẺ TOÀN DIỆN
        </h2>
      </div>
    </div>
  );
}
