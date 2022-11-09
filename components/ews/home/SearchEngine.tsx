import elasticlunr from 'elasticlunr'
import { useState, useEffect } from 'react';
import { Scrollbar, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { scheduleTree, scheduleList } from '../../../private/classesTree';

const index = elasticlunr(function () {
  this.addField('title');
  this.addField('body');
  this.setRef('id');
  scheduleTree.forEach((value, key) => {
    this.addDoc({
      'title': key,  // Groupe de TP
      'body': value.join(' ') + ' ' + key,  // Groupe de TD, année et groupe de Tp
      'id': key,
    });
  })
});

export default function SearchBar({ schedule, setSchedule, className }) {
  const [displayedAnswers, setDisplayedAnswers] = useState([])
  const focused = displayedAnswers.length != 0
  useEffect(() => {
    if (!schedule) {
      setDisplayedAnswers(performResearch(''))
    }
  }, [])
  return ( 
    <div className={" " + className}>
      <div className="WhiteBorder bg-white w-full h-1"></div>
      <div className="ClassSelection w-full h-full ">
        <div className="SearchBarContainer h-full w-full flex justify-center 
        items-center">
          <TextInput focused={focused} setDisplayedAnswers={setDisplayedAnswers}
            setSchedule={setSchedule} value={schedule} />
        </div>
      </div>
      <div className="WhiteBorder h-1 absolute bottom-0 left-0 bg-white 
      w-full"></div>
      <AnswerList focused={focused} fields={displayedAnswers} setSchedule={setSchedule} setDisplayedAnswers={setDisplayedAnswers} />
      <BlurMask focused={focused}/>
    </div>
  );
}

function AnswerList({ fields, setSchedule, focused, setDisplayedAnswers }) {
  const fieldView = []
  fields.forEach(field => {
    field = field.ref
    fieldView.push(
      <SwiperSlide key={field} className='w-80 mb-3 h-12 z-50 text-gray-700 backdrop-blur-lg rounded-2xl border-4 border-white'
        onClick={event => {
          setSchedule(field)
        }}>
        <div className='bg-white bg-opacity-80 w-full h-full rounded-xl text-gray-700 font-academyLET
        text-center flex justify-center'>
          <h2 className='my-auto'>
            {field}
          </h2>
        </div>
      </SwiperSlide>
    )
  })
  const field = 'test' 
  return (
    <div className={ ('fixed w-full top-0 z-50 transition-transform duration-500  '
    + (focused? 'translate-y-0 h-[89%]' : 'translate-y-[200%] h-0')) }
    onClick={event => {
      setDisplayedAnswers([])  // Unselecting making it unfocused
    }}>
      <Swiper className="h-full mt-24"
        modules={ [ Scrollbar, EffectFade ] }
        enabled={true}
        direction="vertical"
        scrollbar={{ draggable: true }}
        spaceBetween={5}
        centeredSlides={false}
        cssMode={false}
        slidesPerView={10}
        speed={400}
        touchRatio={1.5}
        navigation={false}
        loop={false}
        autoplay={false}
      >
        {fieldView}
      </Swiper>
    </div>
  )
}

const performResearch = (input: string) => {
  const answers = index.search(input, {
    fields: {  // This is useless because of the configuration im using
      title: { boost: 1 },
      body: { boost: 2 }
    },
    bool: "OR",
    expand: true
  })
  if (answers.length == 0)
    scheduleTree.forEach((value, key) => {
      answers.push({ ref: key })
    })
  return answers
}

function TextInput({ focused, setDisplayedAnswers, setSchedule, value }) {
  return (
    <div className={'SearchBar flex flex-col justify-center items-center bg-gradient-to-r from-main-orange to-main-orange-light'
    + (focused ? ' font-semibold -translate-y-[250%] border-[3px] shadow-lg z-40 duration-400 transition-all w-2/3'
    :
    'from-transparent to-transparent translate-y-0 transition-all border-[1.5px] shadow-none duration-[200ms] w-2/3')}>
      <input type="text" className={focused ?
        " w-full translate-y-1/10 rounded-lg text-center   \
        placeholder-white placeholder-opacity-60 transition-all bg-transparent duration-400"
        :
        "placeholder-white w-full translate-y-1/10 rounded-lg bg-transparent text-center \
          duration-[600ms] " }
        onInput={(event) => {
          const target = event.target as HTMLInputElement  // To prevent TS error
          setDisplayedAnswers(performResearch(target.value))
        }}
        onClick={(event) => {
          const target = event.target as HTMLInputElement
          setDisplayedAnswers(performResearch(target.value))
        }}
        onKeyUp={event => {
          const target = event.target as HTMLInputElement
          if (event.key == 'enter') {
            const answers = index.search(target.value, {
              fields: {  // This is useless because of the configuration im using
                title: { boost: 1 },
                body: { boost: 2 }
              },
              bool: "OR",
              expand: true
            })
            if (answers.length != 0) {
              setDisplayedAnswers([])
              setSchedule(answers[0].ref)  // Set the schedule to the most accurate result
            }
          }
        }}
      placeholder={value}>
      </input>
    </div>
  )
}

function BlurMask({ focused }) {
  return (
    <div className={'fixed left-0 top-0 w-screen h-screen  ' + (focused ? 
      'z-30' : '-z-30 delay-500'
    )}>
      <div className={focused ?
        " backdrop-blur-sm opacity-100 transition-all duration-500 z-30 w-full h-full"
        :
        "fixed left-0 top-0 w-screen  h-screen backdrop-blur-sm opacity-0 z-30 transition-all duration-500"}>
        <div className={focused ?
          "w-full h-full bg-white opacity-0 transition-all duration-500"
          :
          "w-full h-full bg-transparent opacity-0 transition-all duration-500"}></div>
      </div>
    </div>
  )
}