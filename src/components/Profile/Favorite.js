import React,{ useState, useEffect, useRef, useCallback } from 'react'
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Api from "@/services/api";
import helper from '@/utils/helper'
import { useSession } from "next-auth/react"
import ImageComponent from '@/components/ImageComponent';
import Pagination from '@mui/material/Pagination';
import styles from '@/styles/Profile.module.css'
import { useRouter } from 'next/router'

export default function Favorite(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const router= useRouter();

    const [readingTab, setReadingTab] = useState('comic')
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [favoriteList, setFavoriteList] = useState([])
    const [count, setCount] = useState(0)

    useEffect(() => {
        if(session?.accessToken){
            fetchFavorite(page)
        }
    }, [session?.accessToken, readingTab])

    const fetchFavorite = async (page) => {
        try {
            const result = await Api.puller( session.accessToken,'/favourites',{c:9, page: page,type: readingTab});
            const res = JSON.parse(helper.decrypt(result.data.data))
            
            if(res){
                setFavoriteList(res.data)
                setPage(res.currentPage)
                setLastPage(res.lastPage)
                setCount(res.total)
            }
        } catch(error){
            // console.log(error)
        }
    }

    const changeTab = (data) => {
        setReadingTab(data)
        setFavoriteList(null)
        setPage(1)
        setLastPage(1)
        setCount(0)
    }

    const getName = (name) => {
        if(name.length > 30){
            return name.substring(0, 30) + "..."
        } else {
            return name
        }
    }

    const goToPage = (event, value) => {
		setPage(value)
		fetchFavorite(value)
	}

    const goToComic = (history) => {
		router.push({
            pathname: '/comics/[slug]',
            query: { slug: history.comicSlug }
        })
	}

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('favorites')}
                </div>
                <div className='w-full py-3 px-5 xl:px-10'>
                    <div className='w-full flex items-center border-b border-[#999999]'>
                        <div 
                            className='py-3 relative cursor-pointer'
                            onClick={() => changeTab('comic')}
                        >
                            <p className={`text-[16px] px-5 lg:px-8 font-bold ${readingTab === 'comic' ? "text-[#005599]" : "text-[#999999]"}`}>
                                {t('comics')}
                            </p>
                            {
                                readingTab === 'comic' && 
                                <div className='absolute w-full bottom-0 rounded-t-3xl' style={{border: '3px solid #005599'}}></div>
                            }
                        </div>
                        <div 
                            className='py-3 relative cursor-pointer ml-4'
                            onClick={() => changeTab('novel')}
                        >
                            <p className={`text-[16px] px-5 lg:px-8 font-bold ${readingTab === 'novel' ? "text-[#005599]" : "text-[#999999]"}`}>
                                {t('novels')}
                            </p>
                            {
                                readingTab === 'novel' && 
                                <div className='absolute w-full bottom-0 rounded-t-3xl' style={{border: '3px solid #005599'}}></div>
                            }
                        </div>
                    </div>

                    <div className='mt-4 w-full flex items-center'>
                        <p className='flex-1 text-gray-400 font-semibold'>
                            {count} {t('series')}
                        </p>
                        <button
                            className='text-gray-700 flex justify-center px-3 py-2'
                        >
                            {t('recently-updated')}
                            <Image src='/icon/swap.svg' alt="swap" width={20} height={20} className='ml-2' />
                        </button>
                    </div>

                    <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {
                            favoriteList && favoriteList.length > 0 && favoriteList.map((favorite, index) => (
                                <div 
                                    className='col-span-1'
                                    key={index}
                                >
                                    <div className='w-full flex items-center'>
                                        <div
                                            className={`relative w-[100px] h-[140px] cursor-pointer`}
                                            onClick={() => goToComic(favorite)}
                                        >
                                            <ImageComponent 
                                                src={favorite.comicCoverImage}
                                                alt="coverimage"
                                                spinWidth='40'
                                                spinHeight='40'
                                                className={styles.thumbnailImage +' rounded-md'}
                                            />
                                            <div 
                                                className='absolute rounded-b-md bottom-0 text-[10px] flex justify-center items-center py-2 w-[100px] h-[22px]'
                                                style={{background: 'rgba(0, 0, 0, 0.5)',backdropFilter: 'blur(1.5px)'}}
                                            >
                                                {
                                                    favorite.comicType == "free" ? 
                                                    <>
                                                        <Image 
                                                            src='/img/comics/free.png' 
                                                            width='20' height='20' 
                                                            alt="free" 
                                                        />
                                                        <span className='text-white font-semibold ml-2'>
                                                            {t('free')}
                                                        </span>
                                                    </>
                                                    :
                                                    <>
                                                        <Image 
                                                            src='/img/comics/point.png' 
                                                            alt="points" width='20' height='20'
                                                        />
                                                            <span className='text-white font-semibold ml-2'>
                                                                {t('points')}
                                                            </span>
                                                    </>
                                                }
                                            </div>
                                        </div>

                                        <div className='ml-4'>
                                            <button 
                                                className={`rounded-2xl px-5 py-1 uppercase text-white text-[12px] cursor-default ${history.comicStatus === 'new' ? 'bg-blue-400' : history.comicStatus === 'ongoing' ? 'bg-yellow-500' : 'bg-[#6EBA0C]'}`}
                                            >
                                                {favorite.comicStatus}
                                            </button>
                                            <p className='mt-2 text-[16px] font-bold text-gray-700'>
                                                { favorite.comicName }
                                            </p>
                                            <p className='mt-2 text-xs text-gray-400'>
                                                {t('unread')} <span className='text-red-500'>+ {favorite.unreadChapter}</span>
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

                { count > 0 && 
                    <div className='py-1 w-full flex justify-center items-center md:absolute bottom-4'>
                        <Pagination 
                            count={lastPage}
                            color="primary"
                            page={page}
                            onChange={goToPage}
                        />
                    </div>
                }
            </div>
        </>
    )
}