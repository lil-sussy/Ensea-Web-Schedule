import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide, SwiperProps, useSwiper } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useSWR, { SWRConfig } from 'swr'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore, { EffectCards, EffectCube, EffectFade, Navigation } from "swiper";
import { getWeekID } from "../lib/schoolYear";

SwiperCore.use([EffectFade])

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
  const onChange = (swiper: any) => {
    setWeek(swiper.activeIndex)  // Apparently active index is real index + 1 and starts at 1
  }
  const textColor = 'rgba(55, 65, 81, 1)'
  return (
    <div className="mb-2 h-8 mx-auto w-36 bg-white relative 
    flex-col align-center justify-center rounded-lg -translate-y-1/2 ">
      <WhiteFadingMask/>
      <div className="w-[115%] h-full -translate-x-[7.5%]">
        <Swiper className="bg-clip-text GrayTextFadeGradient" id='WeekSelection'
          modules={[Navigation, EffectCube]}
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
        >
          <div className="bg-clip-text">
            {weeksLabels.map(label => label)}
          </div>
          <SwipePrevButton className="ButtonNav NavPrev z-20 font-Chango  border-white">{'<'}</SwipePrevButton>
          <SwipeNextButton className="ButtonNav NavNext z-20 font-Chango  border-white">{'>'}</SwipeNextButton>
        </Swiper>
      </div>
    </div>
  );
}

function WeekLabel(weekID: number) {
  return (
    <SwiperSlide key={weekID} className="w-full h-full">
      <div className="WeekSelectionLabel text-[1.2rem] justify-center align-center 
        text-center text-transparent font-kefa font-bold leading-8">
        <h4 className="bg-clip-text text-gray-700 bg-fixed">Semaine {weekID}</h4>
      </div>
    </SwiperSlide>
  );
}

function WhiteFadingMask() {
  return (
    <div className="absolute w-full rounded-2xl h-full "
    style={{
      backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 10%, white 20%, white 80%, rgba(0, 0, 0, 0) 90%)',
    }}>

    </div>
  )
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
