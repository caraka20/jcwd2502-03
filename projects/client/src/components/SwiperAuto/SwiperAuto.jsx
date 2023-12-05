import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const SwiperAuto = ({ gambar }) => {
  console.log(gambar);
  return (
    <div className="min-w-[616px] max-w-[616px] max-h-[550px] mt-[32px]">
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="h-full w-full shadow-md rounded-2xl "
      >
        {gambar &&
          gambar[0].products_images.map((item) => {
            return (
              <SwiperSlide className="imag">
                <img
                className=""
                  src={`${process.env.REACT_APP_IMAGE_SERVER_URL_IMAGE}${item.image.substring(6)}`}
                  alt=""
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default SwiperAuto;
