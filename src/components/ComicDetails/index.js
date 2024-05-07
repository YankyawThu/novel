import Introduction from "./introduction";
import PopularComics from "./popularComics";
import BookDetails from "./bookDetail";
import Chapter from "./Chapters";
import helper from '@/utils/helper'
import React, { useEffect, useState } from 'react'

export default function ComicDetails(props){

    const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    return (
        <>
            <div className="w-full">
                <BookDetails comicDetail={props.comicDetail} history={props.history} />
            </div>
            {
                isMobile &&
                <div className="w-full container mx-auto px-5 mt-4">
                    <Introduction description={props.comicDetail?.description} />

                    <Chapter comic={props.comicDetail} />
                    <PopularComics popularComics={props.popularComics} />
                </div>
            } {
                !isMobile &&
                <div className='w-full container mx-auto mt-10'>
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-4">
                            <Introduction description={props.comicDetail?.description} />

                            <Chapter comic={props.comicDetail} />
                        </div>
                        <div className="col-span-2">
                            <PopularComics popularComics={props.popularComics} />
                        </div>
                    </div>
                </div>
            }
            
        </>
    )
}