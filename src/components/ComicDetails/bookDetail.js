import Link from 'next/link';
import styles from '@/styles/Detail.module.css'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react'
import ImageComponent from '@/components/ImageComponent';
import { useSession } from "next-auth/react"
import helper from '@/utils/helper'
import Api from "@/services/api";
import SweetAlert from 'react-bootstrap-sweetalert';
import ShareModal from './Modals/ShareModel';
import RatingModal from './Modals/RatingModel';
import Rating from '@mui/material/Rating';

export default function BookDetails(props) {
    const { locale, route } = useRouter()
    const t = useTranslations("Default");
    const { data: session } = useSession();
    const router = useRouter();

    const [genres, setGenre] = useState('')
    const [copy, setCopy] = useState(false)
    const [isFavourite, setIsFavourite] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false);
    const [msg, setMsg] = useState('')
    const [showShareModal, setShowShareModal] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [rate, setRate] = useState(props.comicDetail.readerRate)

    const bgImg = props.comicDetail.coverImage ? props.comicDetail.coverImage : '/img/portrait-bg.png';
    const cover = '/img/cover.png';
    const free = '/img/comics/free.png';

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(helper.isMobile(window.navigator.userAgent))
    }, [])

    useEffect(() => {
        if (props.comicDetail && props.comicDetail.genres && props.comicDetail.genres.length > 0) {
            let genreName = '';
            props.comicDetail.genres.map((item, index) => {
                genreName += index > 0 ? ", " + getLocaleName(item) : getLocaleName(item)
            })
            setGenre(genreName)
        }
        setIsFavourite(props.comicDetail.isFavourite)
    }, [props.comicDetail])

    const getLocaleName = (item) => {
        if (locale === 'en') {
            return item.name
        } else {
            return item.name_mm
        }
    }

    const copyUrlToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setShowShareModal(true);
    }

    //move to another file later
    


    useEffect(() => {
        const timeout = setTimeout(() => {
            setCopy(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [copy]);

    const removeFav = async (comicId) => {
        try {
            const res = await Api.poster(session.accessToken, `/remove-favourite`, { c: 9, comicId: comicId });
            setIsFavourite(false)
            setMsg('Successfully removed!')
            setShowSuccess(true)
        } catch (error) {

        }

    }

    const addFav = async (comicId) => {
        try {
            const res = await Api.poster(session.accessToken, `/add-favourite`, { c: 9, comicId: comicId, type: "comic" });
            setIsFavourite(true)
            setMsg('Successfully add to favourites!')
            setShowSuccess(true)
        } catch (error) {

        }

    }

    const handleCloseSuccess = () => {
        setShowSuccess(false)
        setMsg('')
    };

    const continueReading = () => {
        let total = props.history?.totalImage ?? 1;
        let current = props.history?.readImageNo ?? 1;
        let currentPage = Math.ceil(current / 15)

        router.push({
            pathname: '/comics/[slug]/chapter/[id]',
            query: { slug: props.comicDetail?.slug, id: props.history?.chapterId, page: currentPage, sorting: props.history?.readImageNo }
        })
    }

    return (
        <>
            <div className="relative">
                {showShareModal && <ShareModal comicDetail={props.comicDetail}  handleClick={setShowShareModal} />}
                {showRatingModal && <RatingModal comicDetail={props.comicDetail} handleClick={setShowRatingModal} setRate={setRate} rate={rate}/>}
                <div
                    style={{ backgroundImage: `url(${bgImg})` }} className={styles.bookDetailCover}
                >
                    <div className={styles.bookDetailCoverBlur}></div>
                </div>

                <div className='w-full absolute top-0 left-0 right-0'>
                    <div className="w-full container md:mx-auto lg:h-[400px] pt-5 lg:pt-[2rem]">
                        <div className='text-[#ffffff] mb-2 flex justify-center items-center lg:block'>
                            <Link href='/' className={styles.breadcrumb}>
                                {t('home')}
                            </Link> &ensp; /
                            <Link href='/comics' className={styles.breadcrumb + ' ml-4'}>{t('comics')}</Link> &ensp; /
                            <span className={styles.breadcrumb + " font-semibold ml-4"}>{props.comicDetail.title}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-11 md:gap-6">
                            <div className="col-span-1 md:col-span-2">
                                {
                                    !isMobile &&
                                    <ImageComponent
                                        src={props.comicDetail.coverImage} alt="bg"
                                        className={'w-full h-full xl:w-[200px] xl:h-[294px] inline-flex rounded'}
                                    />
                                }
                                {
                                    isMobile &&
                                    <div className='w-full flex justify-center'>
                                        <ImageComponent
                                            src={props.comicDetail.coverImage} alt="bg"
                                            className='w-[100px] h-[147px] rounded'
                                        />
                                    </div>
                                }
                            </div>
                            <div className="col-span-1 md:col-span-9">
                                <div
                                    style={{ background: 'rgba(255, 255, 255, 0.86)', backdropFilter: 'blur(10px)', borderRadius: '12px' }}
                                    className="mx-5 mt-2 md:mt-0 md:h-[294px]"
                                >
                                    <div className='px-5 py-3 md:px-[2rem] md:py-[1rem] md:h-[294px]'>
                                        <p className='flex mb-2'>
                                            <span className='text-[18px] md:text-[26px] font-bold'>{props.comicDetail.title}</span>
                                            {
                                                !isMobile &&
                                                <button className="flex ml-3 md:mb-2 md:mt-1 py-1 items-center px-3 rounded-full bg-[#005599]">
                                                    <Rating 
                                                        name="read-only" 
                                                        value={props.comicDetail.ratingPercent} 
                                                        readOnly 
                                                        size='small' 
                                                        precision={0.5}
                                                    />
                                                </button>
                                            }
                                        </p>
                                        {
                                            isMobile &&
                                            <button className="flex py-1 items-center px-3 rounded-full bg-[#005599]">
                                            <Rating name="read-only" value={props.comicDetail.ratingPercent} readOnly size='small' precision={0.5}/>
                                            </button>
                                        }
                                        <div className="grid grid-cols-3 md:grid-cols-12 gap-4 mt-4">
                                            <div className="col-span-1 md:col-span-2 text-[12px] md:text-[14px] font-bold">
                                                {t('rating')} :
                                            </div>
                                            <div className="col-span-2 md:col-span-10 text-[12px] md:text-[14px] font-normal">
                                                Average 4
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-12 gap-4 mt-2">
                                            <div className="col-span-1 md:col-span-2 text-[12px] md:text-[14px] font-bold">
                                                {t('genres')} :
                                            </div>
                                            <div className="col-span-2 md:col-span-10 text-[12px] md:text-[14px] font-normal">
                                                {genres}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-12 gap-4 mt-2">
                                            <div className="col-span-1 md:col-span-2 text-[12px] md:text-[14px] font-bold">
                                                {t('author')} :
                                            </div>
                                            <div className="col-span-2 md:col-span-10 text-[12px] md:text-[14px] font-normal">
                                                {props.comicDetail.author}
                                            </div>
                                        </div>
                                        {
                                            isMobile &&
                                            <>
                                                {
                                                    session?.user &&
                                                    <button
                                                        className='rounded-2xl bg-[#005599] text-[#ffffff] px-3 py-1 font-bold text-[11px] mt-2'
                                                        onClick={() => continueReading()}
                                                    >
                                                        {t('continue-reading')}
                                                    </button>
                                                }
                                                <div className='flex items-center mt-2'>
                                                    <span className="text-[12px] font-bold">{t('status')} : </span>
                                                    <div className="rounded-2xl bg-[#6EBA0C] text-[#ffffff] px-3 py-1 ml-2 font-bold text-[11px]">
                                                        {t(props.comicDetail.status.toLowerCase())}
                                                    </div>
                                                </div>
                                                <div className='flex mt-2'>
                                                    <p className='text-[12px] font-bold'>{t('latest-upload')} :
                                                        <span className='font-normal text-[#E1524C] ml-2'>{props.comicDetail.upload}</span>
                                                    </p>
                                                </div>
                                                <div className='w-full flex items-center mt-2 relative'>
                                                    {session?.user && isFavourite &&
                                                        <button
                                                            className={`flex flex-col items-center justify-center text-[12px] text-[#005599]`}
                                                            onClick={() => removeFav(props.comicDetail.id)}
                                                        >
                                                            <img src="/icon/factive.svg" alt="saved" className='w-[20px] h-[20px]' />
                                                            <p>{props.comicDetail?.totalFavouriteCount}</p>
                                                            {t('favorite')}
                                                        </button>
                                                    }
                                                    {session?.user && !isFavourite &&
                                                        <button
                                                            className={`flex flex-col items-center justify-center text-[12px] hover:text-[#005599]`}
                                                            onClick={() => addFav(props.comicDetail.id)}
                                                        >
                                                            <img src="/icon/finactive.svg" alt="saved" className='w-[20px] h-[20px]' />
                                                            <p>{props.comicDetail?.totalFavouriteCount}</p>
                                                            {t('favorite')}
                                                        </button>
                                                    }

                                                    {
                                                        session?.user &&
                                                        <button className='flex flex-col items-center justify-center text-[12px] ml-4 text-[#005599]' onClick={() => setShowRatingModal(true)}>
                                                            <img src="/icon/like.svg" alt="rate" className='w-[20px] h-[20px]' />
                                                            <p>{props.comicDetail?.totalRateCount ?? 0}</p>
                                                            {t('rate')}
                                                        </button>
                                                    }

                                                    <button
                                                        className='flex flex-col items-center justify-center text-[12px] ml-4 hover:text-[#005599] cursor-copy'
                                                        onClick={() => setShowShareModal(true)}
                                                    >
                                                        <img src="/icon/share.svg" alt="share" className='w-[20px] h-[20px]' />
                                                        <p>{props.comicDetail?.shareCount}</p>
                                                        {t('share')}
                                                    </button>

                                                    {copy && <p className={styles.urlShare + ' text-[10px] text-[#005599] italic font-medium absolute w-full -bottom-6 -right-8'}>
                                                        {t('url-copy-success')}
                                                    </p>}
                                                </div>
                                            </>
                                        }
                                        {
                                            !isMobile &&
                                            <>
                                                <div className="grid grid-cols-12 gap-4 mt-5 mb-2">
                                                    <div className="col-span-4"></div>

                                                    <div className="col-span-8">
                                                        <div className='flex justify-end items-center'>
                                                            <span className="text-[14px] font-bold pt-1 mr-3">{t('status')} : </span>
                                                            <button className="rounded-full bg-[#6EBA0C] text-[#ffffff] px-4 py-1 font-bold text-[14px]">
                                                                {t(props.comicDetail.status.toLowerCase())}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5 gap-4 mt-5">
                                                    <div className="col-span-3">
                                                        <div className='w-full flex items-center relative'>
                                                            {session?.user && isFavourite &&
                                                                <button
                                                                    className={`flex flex-col items-center justify-center text-[#005599]`}
                                                                    onClick={() => removeFav(props.comicDetail.id)}
                                                                >
                                                                    <img src="/icon/factive.svg" alt="saved" />
                                                                    <p className='text-[#005599]'>{props.comicDetail.totalFavouriteCount}</p>
                                                                    {t('favorite')}
                                                                </button>
                                                            }
                                                            {session?.user && !isFavourite &&
                                                                <button
                                                                    className={`flex flex-col items-center justify-center hover:text-[#005599]`}
                                                                    onClick={() => addFav(props.comicDetail.id)}
                                                                >
                                                                    <img src="/icon/finactive.svg" alt="saved" />
                                                                    <p className='text-[#005599]'>{props.comicDetail?.totalFavouriteCount}</p>
                                                                    {t('favorite')}
                                                                </button>
                                                            }

                                                            {
                                                                session?.user &&
                                                                <button className='flex flex-col items-center justify-center ml-4 hover:text-[#005599]' onClick={() => setShowRatingModal(true)}>
                                                                    <img src="/icon/like.svg" alt="rate" />
                                                                    <p>{props.comicDetail?.totalRateCount ?? 0}</p>
                                                                    {t('rate')}
                                                                </button>
                                                            }

                                                            <button
                                                                className='flex flex-col items-center justify-center ml-4 hover:text-[#005599] cursor-copy'
                                                                onClick={() => copyUrlToClipboard()}
                                                            >
                                                                <img src="/icon/share.svg" alt="share" />
                                                                <p>{props.comicDetail?.shareCount}</p>
                                                                {t('share')}
                                                            </button>

                                                            {
                                                                session?.user &&
                                                                <button
                                                                    className={`rounded-full bg-[#005599] text-[#ffffff] px-5 py-3 font-bold text-[14px] ${session?.user ? 'ml-4' : ''}`}
                                                                    onClick={() => continueReading()}
                                                                >
                                                                    {t('continue-reading')}
                                                                </button>
                                                            }

                                                            {copy && <p className={styles.urlShare + ' text-sm text-[#005599] italic font-medium absolute w-full -bottom-6 right-0'}>
                                                                {t('url-copy-success')}
                                                            </p>}
                                                        </div>

                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className='flex justify-end'>
                                                            <p className='text-[14px] font-bold'>{t('latest-upload')} :
                                                                <span className='font-normal text-[#E1524C] ml-2'>{props.comicDetail.upload}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {
                showSuccess &&
                <SweetAlert
                    custom
                    customIcon="/icon/success.svg"
                    title={msg}
                    onConfirm={() => handleCloseSuccess()}
                    customButtons={
                        <>
                            <button
                                className='bg-[#4BCF40] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                onClick={() => handleCloseSuccess()}
                            >
                                Continue
                            </button>
                        </>
                    }
                />
            }
        </>
    )
}