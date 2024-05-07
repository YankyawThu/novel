import styles from "@/styles/Comic.module.css";
import React, { useRef, useState, useEffect } from "react";
import Router from "next/router";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination } from "swiper";

export default function Slider(props) {
    const [navigation, setNavigation] = useState(false)
    const [pagination, setPagination] = useState(false)

    useEffect ( () => {
        setNavigation(props.navigation ?? false)
        setPagination(props.pagination ?? false)
    }, [])

    const goToUrl = (item) => {
		if(item.url){
			Router.push(item.url)
		}
	}

    return (
        <div>
            <Swiper
                spaceBetween={30}
                effect={"fade"}
                navigation={navigation}
                pagination={{
                    clickable: true
                }}
                modules={[EffectFade, Navigation, Pagination]}
                className="mySwiper"
            >
                {
                    props.sliderData?.map((data) => {
                        return(
                            <SwiperSlide key={data.id} onClick={() => goToUrl(data)} className='cursor-pointer' >
                                <img src={data.image} className="w-[1200px]" />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}