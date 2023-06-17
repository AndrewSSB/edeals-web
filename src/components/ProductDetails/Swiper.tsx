import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Swiper.css";

import { Autoplay, Pagination, Navigation } from "swiper";
import { SwiperSlider } from "./SwiperSlider";

interface SwiperComponentProps {
  images: string[] | undefined;
}

export const SwiperComponent = (props: SwiperComponentProps) => {
  const [isGrabbed, setIsGrabbed] = useState(false);

  const handleMouseDown = () => {
    setIsGrabbed(true);
  };

  const handleMouseUp = () => {
    setIsGrabbed(false);
  };
  return (
    <div className="swiper-container">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {props.images?.map((image, idx) => (
          <SwiperSlide key={idx}>
            <SwiperSlider imageUrl={image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
