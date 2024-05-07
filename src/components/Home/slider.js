import React, { useRef, useState, useEffect } from "react";

import helper from '@/utils/helper'
import Testimonial from "@/components/Testimonial.js"
import Slider from '@/components/slider'

export default function HomeSlider(props) {
    const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    return (
        <>
            {
                isMobile ?
                    <div className="pt-2 w-full">
                        <Slider sliderData={props.sliders} navigation={false} pagination={true} />
                    </div>
                : 
                <Testimonial testimonials={props.sliders} />
            }
            
        </>
    );
}
