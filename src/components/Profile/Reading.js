import React,{ useState, useEffect, useRef, useCallback } from 'react'
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Api from "@/services/api";
import helper from '@/utils/helper'
import { useSession } from "next-auth/react"
import ImageComponent from '@/components/ImageComponent';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import styles from '@/styles/Profile.module.css'
import { useRouter } from 'next/router'
import CircleCheckbox from '@/components/CircleCheckbox';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Reading(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const router= useRouter();

    const [readingTab, setReadingTab] = useState('comic')
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [historyList, setHistoryList] = useState([])
    const [count, setCount] = useState(0)

    const [isEdit, setIsEdit] = useState(false)
    const [selected, addToSelect] = useState([])
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if(session?.accessToken){
            fetchHistory(page)
        }
    }, [session?.accessToken, readingTab])

    const fetchHistory = async (page) => {
        try {
            const result = await Api.puller( session.accessToken,'/reading-histories',{c:9, page: page,type: readingTab});
            const res = JSON.parse(helper.decrypt(result.data.data))
            
            if(res){
                setHistoryList(res.data)
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
        setHistoryList(null)
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

    const getChapterName = (name) => {
        if(name.length > 10){
            return name.substring(0, 10) + "..."
        } else {
            return name
        }
    }

    const goToPage = (event, value) => {
		setPage(value)
		fetchHistory(value)
	}

    const getProgress = (data, total) => {
        let progress = (100/total) * data;
        return progress
    }

    const goToComic = (history) => {
		router.push({
            pathname: '/comics/[slug]',
            query: { slug: history.comicSlug }
        })
	}

    const goToContinue = (history) => {
        let total = history.totalImage;
        let current = history.readImageNo;
        let currentPage = Math.ceil(history.readImageNo / 15)

        router.push({
            pathname: '/comics/[slug]/chapter/[id]',
            query: { slug: history.comicSlug, id: history.chapterId,page: currentPage, sorting: history.readImageNo }
        })
    }

    const changeEdit = data => {
        if(data === false){
            addToSelect([])
        }
        setIsEdit(data);
    }

    const handleCheckboxChange = (event) => {
        const { name } = event.target;
    
        addToSelect((pre) => {
            if (pre.includes(name)) {
                return pre.filter((item) => item !== name);
            } else {
                return [...pre, name];
            }
        });
    };

    const removeReading = async() => {
        if(selected && selected.length > 0){
            try {
                const result = await Api.poster( session.accessToken,'/delete-reading-histories',{c:9, historyIds: selected});
                fetchHistory(1)
                setShowSuccess(true)
            } catch(error){
                // console.log(error)
            }
        }
    }

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        setIsEdit(false)
	};

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('reading-list')}
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
                        {
                            !isEdit &&
                            <button
                                className='border border-gray-300 rounded-md shadow-sm text-gray-700 flex justify-center px-3 py-2'
                                onClick={() => changeEdit(true)}
                            >
                                {t('edit')}
                            </button>
                        }
                        
                    </div>

                    <div className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {
                            historyList && historyList.length > 0 && historyList.map((history, index) => (
                                <div 
                                    className='col-span-1'
                                    key={index}
                                >
                                    <div className='w-full flex items-center'>
                                        {
                                            isEdit &&
                                            <CircleCheckbox
                                                name={history.id}
                                                isChecked={selected.includes(history.id)}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        <div
                                            className={`relative w-[100px] h-[140px] cursor-pointer ${isEdit ? 'ml-4' : ''}`}
                                            onClick={() => goToComic(history)}
                                        >
                                            <ImageComponent 
                                                src={history.comicCoverImage}
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
                                                    history.comicType == "free" ? 
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

                                        <div className='ml-4 md:w-[150px]'>
                                            <button 
                                                className={`rounded-2xl px-5 py-1 uppercase text-white text-[12px] cursor-default ${history.comicStatus === 'new' ? 'bg-blue-400' : history.comicStatus === 'ongoing' ? 'bg-yellow-500' : 'bg-[#6EBA0C]'}`}
                                            >
                                                {history.comicStatus}
                                            </button>
                                            <p className='mt-2 text-[16px] font-bold text-gray-700'>
                                                { getName(history.comicName) }
                                            </p>
                                            <p className='mt-2 text-xs text-gray-400'>
                                                {history.date}
                                            </p>
                                        </div>
                                        {
                                            !isEdit && 
                                            <div
                                                className='ml-2 w-full md:w-[100px] cursor-pointer'
                                                onClick={() => goToContinue(history)}
                                            >
                                                <div className='flex items-center text-[12px] font-semibold py-1 text-[#999999]'>
                                                    { getChapterName(history.chapter) }
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        fill="none" viewBox="0 0 24 24" 
                                                        strokeWidth="1.5" stroke="currentColor" 
                                                        className="w-4 h-4 ml-2"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" strokeLinejoin="round" 
                                                            d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={ getProgress(history.readImageNo, history.totalImage) }
                                                />
                                            </div>
                                        }
                                        
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {
                    isEdit &&
                    <div className='absolute bottom-4 w-full justify-center flex items-center'>
                        <button 
                            className='rounded-2xl inline-flex items-center justify-center px-5 py-2 text-white bg-[#999999]'
                            onClick={() => changeEdit(false)}
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            className='ml-4 rounded-2xl inline-flex items-center justify-center px-5 py-2 text-white bg-[#005599]'
                            onClick={() => removeReading()}
                        >
                            {t('remove')}
                        </button>
                    </div>
                }

                { !isEdit && count > 0 && 
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
            {
                showSuccess && 
                <SweetAlert
                    custom
                    customIcon="/icon/success.svg"
                    title="Successfully removed!"
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