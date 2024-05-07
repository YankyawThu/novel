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
import dateformat from 'dateformat'

export default function Payment(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const router= useRouter();

    const [user, setUser] = useState(props.user)
    const [histories, setHistory] = useState([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if(session?.accessToken){
            fetchHistory(page)
        }
    }, [session?.accessToken])

    const fetchHistory = async (page) => {
        try {
            const result = await Api.puller( session.accessToken,'/payment-history',{c:9, page: page,perPage: 7});
            const res = JSON.parse(helper.decrypt(result.data.data))
            
            if(res){
                setHistory(res.data)
                setPage(res.currentPage)
                setLastPage(res.lastPage)
                setCount(res.total)
            }
        } catch(error){
            // console.log(error)
        }
    }

    const goToPage = (event, value) => {
		setPage(value)
		fetchHistory(value)
	}

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('payment-history')}
                </div>
                <div 
                    className='w-full py-3 px-5 xl:px-10 relative'
                >
                    {
                        histories && histories.length > 0 && histories.map((history, index) => (
                            <div 
                                className={`w-full flex items-center py-3 ${index+1 < histories.length ? 'border-b':''}`}
                                key={index}
                            >
                                <img src={history.image} className='xs:w-[100px] xs:h-[55px] md:w-[100px] md:h-[62px]' />
                                <div className='ml-2 lg:ml-4 flex-1'>
                                    <p className='text-[#23262F] text-[14px] lg:text-[16px] font-bold'>
                                        {t(history?.packageType+"-package")} 
                                    </p>
                                    <span className='text-[11px] lg:text-[13px] text-gray-400'>
                                        {t('time')} : { dateformat(history?.topup?.datetime, 'yyyy-mm-dd, h:MM:ss TT')}
                                    </span>
                                </div>
                                <p className='text-[#005599] ml-2 md:ml-0 text-[14px] lg:text-[20px] font-semibold'>
                                    {helper.localeNumbering(history?.topup?.amount, t)} MMK
                                </p>
                            </div>
                        ))
                    }
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