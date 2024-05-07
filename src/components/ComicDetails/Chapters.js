import styles from '@/styles/Detail.module.css'
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component'
import helper from '@/utils/helper'
import Api from "@/services/api";
import { useSession } from "next-auth/react"
import {useTranslations} from 'next-intl';
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Chapters(props){
    const t = useTranslations("Default");
    const router= useRouter();
    const {data:session} = useSession();

    const rectangle = '/img/rectangle.png';
    const point = '/img/point.png';
    const free = '/img/comics/free.png';
    const downarrow = '/img/downarrow.png';

    const [comic, setComic] = useState(null);

    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [chapters, setChapter] = useState([]);
    const [scrollChapters, setScrollChapters] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        resetChapters()
        setHasMore(true)
        setShowMore(false)
        setComic(props.comic);
    }, [props.comic])

    useEffect(() => {
        if(comic && comic?.slug){
            fetchChapters()
        }
    }, [comic, page])

    useEffect(() => {
        setChapter([]);
        setScrollChapters([]);
        if(comic && comic?.slug){
            fetchChapters()
        }
    }, [showMore])

    const resetChapters = () => {
        setChapter([]);
        setScrollChapters([]);
        setPage(1)
        setLastPage(1)
        setTotal(0)
    }

    const fetchChapters = async () => {
        let token = session?.accessToken ? session?.accessToken : null;
        const res = await Api.puller( token,`/comic-detail-chapters/${comic?.slug}`, {
                        c:9,
                        page: page
                    });
	    const data = JSON.parse(helper.decrypt(res?.data?.data));
        
        setTotal(data.total)
        setLastPage(data.lastPage)
        setHasMore(data.data.length > 0);

        if(showMore){
            setScrollChapters(scrollChapters.concat(data.data));
            setPage(page + 1);
        } else {
            setChapter(data.data);
            setPage(data.currentPage)
        }
    }

    const gotoChapter = async (chapter) => {
        if( chapter?.sorting > 0 && chapter?.sorting < 6){
            router.push({
                pathname: '/comics/[slug]/chapter/[id]',
                query: { slug: comic?.slug, id: chapter.id }
            })
        } else {
            if(!session?.accessToken){
                signOut({callbackUrl: '/login'})
            }

            if(chapter.type === 'paid'){
                const result = await Api.puller( session?.accessToken,`/check-comic-chapter-point`, {
                    c:9,
                    chapterId: chapter.id
                });
                const response = JSON.parse(helper.decrypt(result?.data?.data));
                if(response.canRead) {
                    router.push({
                        pathname: '/comics/[slug]/chapter/[id]',
                        query: { slug: comic?.slug, id: chapter.id }
                    })
                } else {
                    setErrorMsg(chapter.title)
                    setShowError(true)
                }
            } else {
                router.push({
                    pathname: '/comics/[slug]/chapter/[id]',
                    query: { slug: comic?.slug, id: chapter.id }
                })
            }
        }
    }

    const handleCloseError = () => {
		setErrorMsg("");
		setShowError(false)
	};
    
    return (
        <>
            <div className='flex items-center mt-10'>
                <span className="text-[16px] md:text-[22px] font-bold md:mr-[2rem]">Table of contents</span>
                <img src={rectangle} alt="rank1" className='md:w-[16px] w-[12px] md:h-[8px] h-[4px] ml-4' />
                <span className='ml-4'>{t('chapters')} - {total}</span>
            </div>

            <hr className="md:mb-[2rem] md:mt-[1rem] mt-2 mb-2" />

            {
                showMore &&
                <div id="scrollableDiv" className='h-[800px] overflow-auto' >
                    <InfiniteScroll
                        dataLength = {scrollChapters.length}
                        next = {fetchChapters}
                        hasMore = {hasMore}
                        scrollableTarget="scrollableDiv"
                        loader={<p className='text-center text-xs'>Loading ... </p>}
                    >
                    {
                        scrollChapters.map((chapter,index) => {
                            
                            return (
                                <div 
                                    className={(index % 2 == 0) ? 'bg-[#E5FAFF] px-3 py-2 md:px-5 md:py-3 cursor-pointer' : 'bg-[#FCFCFC] md:px-5 md:py-3 px-3 py-2 cursor-pointer'} 
                                    key={index}
                                    onClick={() => gotoChapter(chapter)}
                                >
                                    <div className="flex items-center">
                                        <h1 className='font-bold text-[12px] md:text-[16px] flex-1'>{chapter.title}</h1>
                                        <div className='flex items-center'>
                                            {
                                                chapter.type === 'free' ?
                                                <img src={free} alt="free" className='w-[20px] h-[20px] md:w-[25px] md:h-[25px]' />
                                                :
                                                <img src={point} alt="paid" className='w-[15px] h-[16px] md:w-[19px] md:h-[20px]' />
                                            }
                                            
                                            <span className='font-bold text-[16px] ml-1'>{chapter.amount}</span>
                                        </div>
                                    </div>
                                    <div className="flex mt-2 items-center">
                                        <div className='flex flex-1 items-center'>
                                            <img src={rectangle} alt="rank1" className={'w-[16px] h-[8px] -mt-1'} />
                                            <span className='text-[14px] font-normal ml-4'>
                                                {chapter.description}
                                            </span>
                                        </div>
                                        <span className={styles.date}>
                                            {chapter.date}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </InfiniteScroll>
                </div>
            }

            {
                !showMore && chapters && chapters.length > 0 && chapters.map((chapter,index) => (
                    <div 
                        className={(index % 2 == 0) ? 'bg-[#E5FAFF] px-3 py-2 md:px-5 md:py-3 cursor-pointer' : 'bg-[#FCFCFC] px-3 py-2 md:px-5 md:py-3 cursor-pointer'} 
                        key={index}
                        onClick={() => gotoChapter(chapter)}
                    >
                        <div className="flex items-center">
                            <h1 className='font-bold text-[12px] md:text-[16px] flex-1'>{chapter.title}</h1>
                            <div className='flex items-center'>
                                {
                                    chapter.type === 'free' ?
                                    <img src={free} alt="free" className='w-[20px] h-[20px] md:w-[25px] md:h-[25px]' />
                                    :
                                    <img src={point} alt="paid" className='w-[15px] h-[16px] md:w-[19px] md:h-[20px]' />
                                }
                                
                                <span className='font-bold text-[12px] md:text-[16px] ml-1'>{chapter.amount}</span>
                            </div>
                        </div>
                        <div className="flex mt-2">
                            <div className='flex flex-1'>
                                <img src={rectangle} alt="rank1" className='w-[10px] md:w-[16px] md:h-[8px] h-[4px] mt-2' />
                                <span className='text-[10px] md:text-[14px] font-normal ml-2'>
                                    {chapter.description}
                                </span>
                            </div>
                            <span className={styles.date}>
                                {chapter.date}
                            </span>
                        </div>
                    </div>
                ))
            }

            <div className="flex justify-center w-full mb-[5rem] mt-[2rem]">
                {
                    page != lastPage &&
                    <button 
                        onClick={() => setShowMore(true)}
                        className="rounded-full bg-[#005599] text-[#ffffff] px-4 py-2 inline-flex font-bold cursor-pointer items-center"
                    >
                        Show More
                        <img src={downarrow} alt="down arrow" className={'w-[16px] h-[8px] ml-3 '} />
                    </button>
                }
            </div>

            {
                showError && 
                <SweetAlert
                    custom
                    customIcon="/icon/error.svg"
                    title="Insufficient Points"
                    onConfirm={() => handleCloseError()}
                    customButtons={
                        <>
                            <button
                                className='bg-[#E64747] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                onClick={() => handleCloseError()}
                            >
                                Continue
                            </button>
                        </>
                        }
                >
                    <p className='text-sm text-gray-600 font-medium'>
                        {t('insufficient-points-for-chapter')} - &ensp;
                        <span className='font-bold text-blue-500'>{errorMsg}</span>
                    </p>
                    <p className='text-sm mt-2 text-gray-600 font-medium'>
                        {t('topup-chill')}
                    </p>
                </SweetAlert>
            }
        </>
    )
}