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

export default function Notification(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const router = useRouter();
    
    const [readingTab, setReadingTab] = useState('topup')   
    const [notiList, setNotiList] = useState([])
   

    useEffect(() => {
        if(session?.accessToken){
            fetchNoti()
        }
    }, [session?.accessToken, readingTab])

    const fetchNoti = async () => {
        try {
            const result = await Api.puller(session.accessToken, '/noti', { c: 9,detail: readingTab, type: readingTab });          
            const res = JSON.parse(helper.decrypt(result.data.data))
           
            if (res) {
                setNotiList(res)
            }
        } catch(error){
            // console.log(error)
        }
    }
    const changeTab = (data) => {
        setReadingTab(data)
        setNotiList(null)
        
    }

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('notifications')}
                </div>
                <div className='w-full py-3 px-5 xl:px-10'>
                    <div className='w-full flex items-center border-b border-[#999999]'>
                        <div 
                            className='py-3 relative cursor-pointer'
                            onClick={() => changeTab('topup')}
                        >
                            <p className={`text-[14px] md:text-[16px] px-3 md:px-5 uppercase lg:px-8 font-bold ${readingTab === 'topup' ? "text-[#005599]" : "text-[#999999]"}`}>
                                {t('topup')}
                            </p>
                            {
                                readingTab === 'topup' && 
                                <div className='absolute w-full bottom-0 rounded-t-3xl' style={{border: '3px solid #005599'}}></div>
                            }
                        </div>
                        <div 
                            className='py-3 relative cursor-pointer'
                            onClick={() => changeTab('comic')}
                        >
                            <p className={`text-[14px] md:text-[16px] px-3 md:px-5 uppercase lg:px-8 font-bold ${readingTab === 'comic' ? "text-[#005599]" : "text-[#999999]"}`}>
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
                            <p className={`text-[14px] md:text-[16px] px-3 md:px-5 uppercase lg:px-8 font-bold ${readingTab === 'novel' ? "text-[#005599]" : "text-[#999999]"}`}>
                                {t('novels')}
                            </p>
                            {
                                readingTab === 'novel' && 
                                <div className='absolute w-full bottom-0 rounded-t-3xl' style={{border: '3px solid #005599'}}></div>
                            }
                        </div>
                    </div>

                    <div className='overflow-auto h-[500px] md:h-[600px]'>
                        <div className='mt-4 w-full flex items-center'>
                            <p className='flex-1 text-gray-400 font-semibold'>
                                {t('today')}
                            </p>                        
                        </div>
                        {
                            notiList && notiList.today && notiList.today.length > 0 && notiList.today.map((noti, index) => (
                                <div className='mt-4 w-full flex items-center'
                                    key={index}
                                >
                                
                                    <div className='flex mr-8'>
                                        <Image 
                                            src='/img/noti_icon.png' 
                                            width='50' height='50' 
                                            alt="free" 
                                        />
                                    </div>
                                    <div className='flex w-full'>
                                        <p>{noti.noti}
                                        <br/>
                                            <span className='text-gray-400'>{ noti.createdAt}</span>
                                        </p>   
                                    </div>                            
                                
                                </div>
                            ))
                        }
                        
                        
                        <div className='mt-4 w-full flex items-center'>
                            <p className='flex-1 text-gray-400 font-semibold'>
                                {t('last-ago')}
                            </p>
                        </div>
                        {
                            notiList && notiList.lastAgo && notiList.lastAgo.length > 0 && notiList.lastAgo.map((noti, index) => (
                                <div className='mt-4 w-full flex items-center'
                                    key={index}
                                >
                                
                                    <div className='flex mr-8'>
                                        <Image 
                                            src='/img/noti_icon.png' 
                                            width='50' height='50' 
                                            alt="free" 
                                        />
                                    </div>
                                    <div className='flex w-full'>
                                        <p>{noti.noti}
                                        <br/>
                                            <span className='text-gray-400'>{ noti.createdAt}</span>
                                        </p>   
                                    </div>                            
                                
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}