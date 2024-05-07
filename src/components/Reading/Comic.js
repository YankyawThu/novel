import React,{ useRef, useState, useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import styles from '@/styles/ComicReading.module.css'
import Api from "@/services/api";
import helper from '@/utils/helper'
import Router from "next/router";
import ImageComponent from '@/components/ImageComponent';
import { useSession } from "next-auth/react"
import SweetAlert from 'react-bootstrap-sweetalert';
import { signOut } from "next-auth/react"

export default function Comic(props) {
    const { locale , route } = useRouter()
    const router = useRouter();
    const t = useTranslations("Default");
    const {data:session} = useSession();

    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [chapterImages, setChapterImages] = useState([]);
    const [page, setPage] = useState(1);
    const [preNavi, setPreNavi] = useState(false);
    const [nextNavi, setNextNavi] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const [sorting, setSorting] = useState(null)
    const scrollToRef = useRef(null);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [startSorting, setStartSorting] = useState(null);
    const [arrow, setArrow] = useState(false);
    const [previousChapter, setPreviousChapter] = useState(null);
    const [nextChapter, setNextChapter] = useState(null);

    const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    useEffect(() => {
        setCurrentChapterId(props.chapterId)
        setChapter(props.chapterDetail)
        setChapterImages(props.chapterImages)
        setPreviousChapter(props.prevChapter)
        setNextChapter(props.nextChapter)
        setPage(props.chapterImages.currentPage)
        if(props.chapterImages && props.chapterImages?.data.length > 0 ){
            setStartSorting(props.chapterImages?.data[0].sorting)
        }
        showPreNavi()
        showNextNavi()
        setSorting(props.sorting)
    }, [
        props.chapterId, 
        props.chapterDetail,
        props.chapterImages,
        props.sorting,
        props.prevChapter,
        props.nextChapter
    ])

    const showPreNavi = () => {
        if(props.chapterDetail && props.chapterImages.currentPage > 1 && props.chapterImages.currentPage <= props.chapterImages.lastPage){
            setPreNavi(true)
        } else if( props.chapterDetail && props.prevChapter ){
            setPreNavi(true)
        } else {
            setPreNavi(false)
        }
    }
    const showNextNavi = () => {
        if(props.chapterDetail && props.chapterImages?.lastPage > 1 && props.chapterImages?.currentPage < props.chapterImages?.lastPage){
            setNextNavi(true)
        } else if(props.chapterDetail && props.nextChapter ){
            setNextNavi(true)
        } else {
            setNextNavi(false)
        }
    }

    const goPrevChapter = async() => {
        if(previousChapter){
            if(previousChapter?.sorting > 0 && previousChapter?.sorting < 6){
                setCurrentChapterId(previousChapter?._id)
                Router.replace({ 
                    pathname : "/comics/[slug]/chapter/[id]",
                    query:{slug: chapter.comicSlug, id: previousChapter?._id, page: 1}
                });
            } else {
                if(session?.accessToken){
                    const result = await Api.puller( session?.accessToken,`/check-comic-chapter-point`, {
                        c:9,
                        chapterId: previousChapter?._id
                    });
                    const response = JSON.parse(helper.decrypt(result.data.data));
                    if(response.canRead) {
                        setCurrentChapterId(previousChapter?._id)
                        Router.replace({ 
                            pathname : "/comics/[slug]/chapter/[id]",
                            query:{slug: chapter.comicSlug, id: previousChapter?._id, page: 1}
                        });
                    } else {
                        let title = previousChapter?.title
                        setErrorMsg(title)
                        setShowError(true)
                    }
                } else {
                    signOut({callbackUrl: '/login'})
                }
            }
        }
    }

    const goNextChapter = async () => {
        if(nextChapter){
            if(nextChapter?.sorting > 0 && nextChapter?.sorting < 6){
                setCurrentChapterId(nextChapter?._id)
                Router.replace({ 
                    pathname : "/comics/[slug]/chapter/[id]",
                    query:{slug: chapter.comicSlug, id: nextChapter?._id, page: 1}
                });
            } else {
                if(session?.accessToken){
                    const result = await Api.puller( session?.accessToken,`/check-comic-chapter-point`, {
                        c:9,
                        chapterId: nextChapter?._id
                    });
                    const response = JSON.parse(helper.decrypt(result.data.data));
                    if(response.canRead) {
                        setCurrentChapterId(nextChapter?._id)
                        Router.replace({ 
                            pathname : "/comics/[slug]/chapter/[id]",
                            query:{slug: chapter.comicSlug, id: nextChapter?._id, page: 1}
                        });
                    } else {
                        let title = nextChapter?.title
                        setErrorMsg(title)
                        setShowError(true)
                    }
                } else {
                    signOut({callbackUrl: '/login'})
                }
            }
        }
        
    }

    const goPrevPage = () => {
        if(props.chapterImages.currentPage <= props.chapterImages.lastPage && props.chapterImages.currentPage > 1 && currentChapterId){
            let pePage = props.chapterImages.currentPage - 1
            setPage(pePage)
            Router.replace({ 
                pathname : "/comics/[slug]/chapter/[id]",
                query:{slug: chapter.comicSlug, id: currentChapterId, page: pePage}
            });
        } else {
            goPrevChapter()
        }
    }

    const goNextPage = () => {
        if(props.chapterImages.currentPage < props.chapterImages.lastPage){
            let nxtPage = props.chapterImages.currentPage + 1
            setPage(nxtPage)
            Router.replace({ 
                pathname : "/comics/[slug]/chapter/[id]",
                query:{slug: chapter.comicSlug, id: currentChapterId, page: nxtPage}
            });
        } else {
            goNextChapter()
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function handleScroll(event) {
        const { scrollTop, clientHeight } = event.target.documentElement;
        const activeIndex = Math.floor(scrollTop / clientHeight);
        if(props.chapterImages && props.chapterImages?.data && props.chapterImages?.data.length > 0){
            let image = props.chapterImages.data[activeIndex];
            if(activeIndex && activeIndex > 2){
                setArrow(true)
            } else {
                setArrow(false)
            }
            setActiveImage(image);
        }
    }

    useEffect(() => {
        (async () => {
            if(session?.accessToken && props.chapterDetail?.comicId && activeImage){
                try {
                    const result = await Api.poster( session.accessToken,'/store-reading-history',{
                        comicId: props.chapterDetail.comicId,
                        chapterId: props.chapterDetail.id,
                        imageId: activeImage.id,
                        readImageNo: activeImage.sorting,
                        novelId: null,
                        type: "comic",
                        c: 9
                    });
                    const res = JSON.parse(helper.decrypt(result.data.data))
                } catch(error){
                    // console.log(error)
                }
            }
        })(); 
    }, [activeImage]);

    useEffect(() => {
        if (sorting && scrollToRef.current) {
            const elementToScrollTo = scrollToRef.current.querySelector(`[data-sorting="${sorting}"]`);
            if (elementToScrollTo) {
                elementToScrollTo.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [sorting]);

    const goTop = () => {
        const elementToScrollTo = scrollToRef.current.querySelector(`[data-sorting="${startSorting}"]`);
        if (elementToScrollTo) {
            elementToScrollTo.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleCloseError = () => {
		setErrorMsg("");
		setShowError(false)
	};

    const [readingDuration, setReadingDuration] = useState(0);
    useEffect(() => {
        const savedReadingDuration = localStorage.getItem('reading_duration') ? 0 : 0;
        localStorage.setItem('reading_duration', readingDuration);
        setReadingDuration(Number(savedReadingDuration));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setReadingDuration((duration) => {
                const savedReadingDuration = localStorage.getItem('reading_duration');
                const savedDuration = savedReadingDuration ? Number(savedReadingDuration) : 0;
                return duration === savedDuration ? duration + 1 : savedDuration;
            });
            localStorage.setItem('reading_duration', readingDuration);
        }, 1000); // Increment the reading duration every second
    
        return () => {
            clearInterval(intervalId);
          };
    }, [readingDuration]);

    useEffect(() => {
        if ((readingDuration % (1 * 60)) === 0) {
            if(session?.accessToken){
                let currentMin = readingDuration / 60
                storeReadingReward(currentMin)
            }
        }
    },[readingDuration, session?.accessToken])
    
    const storeReadingReward = async (currentMin) => {
        try {
            let result = await Api.poster( session?.accessToken,'/reading-reward', {
                c:9,
                time:currentMin,
                comicId: props.chapterDetail?.comicId
            });
        } catch (e) {
            if(e?.response?.data?.status === 40101){
                signOut({callbackUrl: '/login'})
            }
        }
    }

    return (
        <>
            <div className='w-full px-5 pt-5 md:pt-10 pb-20 container mx-auto min-h-[500px] 2xl:min-h-[650px] relative'>
                <div className="md:block flex justify-center items-center">
                    <Link href='/' className={styles.breadcrumb}>{t('home')}</Link> &ensp; / 
                    <Link href='/comics' className={styles.breadcrumb +' ml-1 md:ml-2'}>{t('comics')}</Link>&ensp; / 
                    { chapter && chapter.comicSlug && chapter.comicName && 
                        <Link href={`/comics/${encodeURIComponent(chapter.comicSlug)}`} className={styles.breadcrumb +' ml-1 md:ml-2'}>{chapter.comicName}</Link>
                    }&ensp; /
                    <span className={ 'text-[#173F5F] font-semibold ml-1 md:ml-2 ' + styles.breadcrumb}>{chapter?.title ?? ''}</span>
                </div>

                <div className='mt-4'>
                    <p className='md:text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-800'>
                        { chapter?.title ?? ''}
                    </p>
                </div>
                
                {/* Navigation  */}
                <div className='w-full mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 '>
                    <div className='col-span-1'>
                        <div className='flex w-full justify-between md:justify-start items-center'>
                            {
                                previousChapter && 
                                <button 
                                    className='bg-[#005599] text-xs md:text-sm mr-2 md:mr-4 inline-flex px-4 md:px-7 py-2 justify-center items-center text-white rounded-3xl'
                                    onClick={goPrevChapter}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" viewBox="0 0 24 24" 
                                        strokeWidth="1.5" stroke="currentColor" 
                                        className="w-6 h-6 mr-2"
                                    >
                                        <path 
                                            strokeLinecap="round" strokeLinejoin="round" 
                                            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                                        />
                                    </svg>

                                    {t("prev-chapter")}
                                </button>
                            } 
                            {
                                nextChapter && 
                                <button 
                                    className='bg-[#005599] text-xs md:text-sm inline-flex px-4 md:px-7 py-2 justify-center items-center text-white rounded-3xl'
                                    onClick={goNextChapter}
                                >
                                    {t("next-chapter")}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" fill="none" 
                                        viewBox="0 0 24 24" strokeWidth="1.5" 
                                        stroke="currentColor" className="w-6 h-6 ml-2"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </button>
                            }
                        </div>
                    </div>

                    <div className='col-span-1'>
                        <div className='flex justify-between md:justify-end items-center w-full'>
                            {
                                preNavi && 
                                <button 
                                    className='bg-[#005599] text-xs md:text-sm mr-2 md:mr-4 inline-flex px-4 md:px-7 py-2 justify-center items-center text-white rounded-3xl'
                                    onClick={goPrevPage}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" viewBox="0 0 24 24" 
                                        strokeWidth="1.5" stroke="currentColor" 
                                        className="w-6 h-6 mr-2"
                                    >
                                        <path 
                                            strokeLinecap="round" strokeLinejoin="round" 
                                            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" 
                                        />
                                    </svg>

                                    {t("prev")}
                                </button>
                            } 
                            {
                                nextNavi && 
                                <button 
                                    className='bg-[#005599] text-xs md:text-sm inline-flex px-4 md:px-7 py-2 justify-center items-center text-white rounded-3xl'
                                    onClick={goNextPage}
                                >
                                    {t("next")}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" fill="none" 
                                        viewBox="0 0 24 24" strokeWidth="1.5" 
                                        stroke="currentColor" className="w-6 h-6 ml-2"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </button>
                            }
                        </div>
                    </div>
                </div>
                {/* End Navigation */}
                            
                {/* Image */}
                <div 
                    className='w-full md:w-1/2 mt-5 container mx-auto flex flex-col justify-center items-center'
                    ref={scrollToRef}
                >
                    {
                        chapterImages && chapterImages?.data?.length > 0 && chapterImages?.data.map(item => (
                            <div key={item.sorting} data-sorting={item.sorting}>
                                <ImageComponent
                                    src={item.image}
                                />
                            </div>
                            
                        ))
                    }
                </div>
                {/*End Image */}

                {
                    arrow && 
                    <button 
                        className='absolute p-2 rounded-full bg-[#005599] right-6 bottom-4 md:bottom-40'
                        onClick={() => goTop()}
                    >
                        <img src='/icon/arrow-up.svg' />
                    </button>
                }

                {/* Footer Navigation */}
                <div className='flex justify-end items-center w-full mt-5'>
                    {
                        preNavi &&
                        <div className='flex-1'>
                            <button 
                                className='bg-[#005599] text-sm mr-4 inline-flex px-7 py-2 justify-center items-center text-white rounded-3xl '
                                onClick={goPrevPage}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" viewBox="0 0 24 24" 
                                    strokeWidth="1.5" stroke="currentColor" 
                                    className="w-6 h-6 mr-2"
                                >
                                    <path 
                                        strokeLinecap="round" strokeLinejoin="round" 
                                        d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" 
                                    />
                                </svg>

                                {t("prev")}
                            </button>
                        </div>
                        
                    } 
                    {
                        nextNavi && 
                        <button 
                            className='bg-[#005599] text-sm inline-flex px-7 py-2 justify-center items-center text-white rounded-3xl'
                            onClick={goNextPage}
                        >
                            {t("next")}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" fill="none" 
                                viewBox="0 0 24 24" strokeWidth="1.5" 
                                stroke="currentColor" className="w-6 h-6 ml-2"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                />
                            </svg>
                        </button>
                    }
                </div>
                {/* End Footer Navigation */}
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