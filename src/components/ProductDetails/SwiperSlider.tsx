import { SwiperSlide } from "swiper/react";

interface SwiperSliderProps {
  imageUrl: string;
}

export const SwiperSlider = (props: SwiperSliderProps) => {
  return <img src={props.imageUrl} />;
};
