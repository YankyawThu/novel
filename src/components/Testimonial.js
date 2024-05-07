import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TailSpin } from  'react-loader-spinner'
import Router from "next/router";
import LazyLoad from 'react-lazy-load';

const Testimonial = ({ testimonials }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [rightShow, setRightShow] = useState(true);
	const [leftShow, setLeftShow] = useState(false);
	const [indicators, setIndicators] = useState([]);
	const [showImage, setShowImage] = useState(false);
	
	useEffect(() => {
		let indicate = (testimonials.length - 3) + 1;
		let arrows = []
		for (let index = 0; index < indicate; index++) {
			arrows.push(index+1);
		}
		if(arrows.length > 3 ){
			setRightShow(true)
		}
		setIndicators([...arrows])
	}, [testimonials])

	useEffect(() => {
		if(indicators.length > 0 ){
			setAutoPlay()
		}
	}, [indicators])

	const goToNext = () => {
		let j = currentIndex
		setCurrentIndex(j+1)
		if((j+1) === 0){
			setLeftShow(false)
		} else {
			setLeftShow(true)
		}
		if(((j+1)+1) === indicators.length){
			setRightShow(false)
		} else {
			setRightShow(true)
		}
		setAutoPlay()
	};

	const goToPrev = () => {
		let j = currentIndex
		setCurrentIndex(j-1)
		if((j-1) === 0){
			setLeftShow(false)
		} else {
			setLeftShow(true)
		}
		if(((j-1)+1) === indicators.length){
			setRightShow(false)
		} else {
			setRightShow(true)
		}
		setAutoPlay()
	};

	const currentChange = (index) => {
		if(index === 0){
			setLeftShow(false)
		} else {
			setLeftShow(true)
		}
		if((index+1) === indicators.length){
			setRightShow(false)
		} else {
			setRightShow(true)
		}
		setCurrentIndex(index)
		setAutoPlay()
	}

	const setAutoPlay = () => {
		let i = currentIndex
		const intervalId = setInterval(() => {
			i++;
			if (i === indicators.length || i > indicators.length) {
				i = 0;
			}
			setCurrentIndex(i);

			if(i === 0){
				setLeftShow(false)
			} else {
				setLeftShow(true)
			}

			if((i+1) === indicators.length){
				setRightShow(false)
			} else {
				setRightShow(true)
			}

		}, 2500);

		return () => clearInterval(intervalId);
	}

	const handleImageLoad = () => {
		setShowImage(true)
	}

	const goToUrl = (item) => {
		if(item.url){
			Router.push(item.url)
		}
	}

	return (
		<div className="relative h-[400px] mt-0 2xl:mt-36">
			<div className="testimonial">
				{leftShow && showImage && <div className="testimonial__nav testimonial__nav--prev">
					<button
						className="testimonial__nav__button"
						onClick={goToPrev}
					>
						{/* <img src="/icon/left.png" alt="left" /> */}
						<Image src="/icon/left.png" alt="left" width='32' height='32' />
					</button>
				</div>}
			
				<ul className="testimonial__list">
					{testimonials
						.slice(currentIndex, currentIndex + 3)
						.map((testimonial, index) => (
							<li
								key={testimonial.id}
								onClick={() => goToUrl(testimonial)}
								className={`testimonial__item cursor-pointer ${
									index === 1 ? "testimonial__item--active" : ""
								} ${index === 0 ? "marginLeft" : ""} ${
									index === 2 ? "marginRight" : ""
								}
								}`}
							>
								{/* {
									!showImage &&
									<div className="w-full h-full flex items-center justify-center">
										<TailSpin
											height="80"
											width="80"
											color="#4fa94d"
											ariaLabel="tail-spin-loading"
											radius="1"
											wrapperStyle={{}}
											wrapperClass=""
											visible={true}
										/>
									</div>
								} */}
								{/* <img
									src={testimonial.image} 
									alt="testimonial"
									onLoad={handleImageLoad}
									className={`${showImage ? 'block' : 'hidden'}`}
								/> */}
								<LazyLoad>
									<img
										src={testimonial.image} 
										alt="testimonial"
									/>
								</LazyLoad>
							</li>
						))}
				</ul>
				{rightShow && showImage && <div className="testimonial__nav testimonial__nav--next">
					<button
						className="testimonial__nav__button"
						onClick={goToNext}
					>
						<Image src="/icon/right.png" alt="right" width={32} height={32} loading="lazy" />
					</button>
				</div>}
			</div>
			<ul className="w-full mt-4 flex items-center justify-center absolute bottom-0">
				{
					indicators && indicators.length > 0 && indicators.map((item, index) => (
						<li
							key={item}
							className={`cursor-pointer rounded-full mx-2 w-3 h-3 ${currentIndex === index ? "bg-[#333333]" : "bg-[#D9D9D9]"}`}
							onClick={() => currentChange(index)}
						>
							
						</li>
					))
				}
			</ul>
		</div>
	);
};

export default Testimonial;
