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
          style={{ objectPosition: "center -100px" }}
          priority
        />
        {/* Dimming overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">NỀN TẢNG Y TẾ</h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
          CHĂM SÓC SỨC KHOẺ TOÀN DIỆN
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <a
            href="#"
            className="hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-16 w-auto"
            />
          </a>

          <a
            href="#"
            className="hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="Download on the App Store"
              className="h-16 w-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
