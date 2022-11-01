import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide, SwiperProps, useSwiper } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useSWR, { SWRConfig } from 'swr'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation } from "swiper";
import { getWeekID } from "../pages/index";

let swiper: any
export default function WeekSelectionSwiper(props: any) {
  const weekID = props.weekID
  const setWeek = props.setWeek
  const weeksLabels = []
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  // const [swiper, setSwiper] = useState()
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) {
    return null;
  }
  for (let i = 1; i < 48; i++) {  // Covering every weeks of the year ADE
    weeksLabels.push(WeekLabel(i))
  }
  const onInit = (swiperJS: any) => {
    if (swiperJS != undefined) {
      swiper = swiperJS
    }
  }
  const onTransitionStart = (swiper: any) => {

  }
  const onChange = (swiper: any) => {
    setWeek(swiper.activeIndex)  // Apparently active index is real index + 1 and starts at 1
  }
  return (
    <div className="mb-2 h-8 mx-auto w-36 bg-white relative 
    flex-col align-center justify-center rounded-lg -translate-y-1/2 ">
      <div className="w-[115%] h-full -translate-x-[7.5%]">
        <Swiper key={2} className="" id='WeekSelection'
          modules={[Navigation]}
          enabled={true}
          direction="horizontal"
          initialSlide={ weekID - 1 }
          spaceBetween={100}
          centeredSlides={true}
          cssMode={false}
          
          slidesPerView={1}
          speed={400}
          touchRatio={1.5}
          navigation={false}
          loop={true}
          autoplay={false}
          onSlideChangeTransitionEnd={onChange}
          onTransitionStart={onTransitionStart}
          onInit={onInit}
        >
          <div className=" ">
            {weeksLabels.map(label => label)}
          </div>
          <SwipePrevButton className="ButtonNav NavPrev font-Chango">{'<'}</SwipePrevButton>
          <SwipeNextButton className="ButtonNav NavNext font-Chango">{'>'}</SwipeNextButton>
        </Swiper>
      </div>
    </div>
  );
}

function WeekLabel(weekID: number) {
  return (
    <SwiperSlide key={weekID} className="w-full h-full">
      <div className="WeekSelectionLabel text-[1.2rem] justify-center align-center 
        text-center text-gray-700 font-bold ">
        <h4 className="">Semaine {weekID}</h4>
      </div>
    </SwiperSlide>
  );
}

function SwipeNextButton({ className, children }) {
  const swiper = useSwiper()
  return (
    <button className={className}
      onClick={(event) => {
        console.log(event);
        
        swiper.slideNext()  // not async
      }}>
      {children}
    </button>
  );
}

function SwipePrevButton({ className, children }) {
  const swiper = useSwiper()
  return (
    <button className={className}
      onClick={(event) => {
        swiper.slidePrev()
      }}>
      {children}
    </button>
  );
}
