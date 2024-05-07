import { useState, useEffect } from "react";
import { TailSpin } from  'react-loader-spinner';
import LazyLoad from 'react-lazy-load';

export default function ImageComponent(props){
    const [showImage, setShowImage] = useState(false);

    const handleImageLoad = () => {
		setShowImage(true)
	}

    return (
        <div className={props.className}>
            {/* {
                !showImage &&
                <div className={ props.imgWH + " flex items-center justify-center"}>
                    <TailSpin
                        height={props.spinHeight ? props.spinHeight : '80'}
                        width={props.spinWidth ? props.spinWidth : '80'}
                        color="#005599"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            }
            <LazyLoad>
                <img
                    src={props.src} 
                    alt={props.alt}
                    onLoad={handleImageLoad}
                    className={`${props.className} ${showImage ? '' : 'hidden'}`}
                />
            </LazyLoad> */}
            <LazyLoad>
                <img
                    src={props.src} 
                    alt={props.alt}
                    className={props.className}
                />
            </LazyLoad>
        </div>
    )
}