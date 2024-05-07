import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Novel.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Router from "next/router";
import {useTranslations} from 'next-intl';
import Head from 'next/head'
import Api from "@/services/api";
import helper from '@/utils/helper'
import Pagination from '@mui/material/Pagination';

export async function getServerSideProps(context) {
    const page = context.query.page ? context.query.page : 1
    let  newsData = null

    try {
        const result = await Api.puller( null,'/news',{c:9, page: page});
        newsData = JSON.parse(helper.decrypt(result.data.data))
        
    } catch(error){
        // console.log(error)
    }

    return {
        props: {
            newsData,
            messages: {
                ...require(`../../lang/${context.locale}.json`)
            },
        },
    };
}

export default function News({newsData}){

    const { locale } = useRouter()
    const t = useTranslations("Default");

    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [news, setNews] = useState([])
    const [count, setCount] = useState(0)

    useEffect(() => {
        setNews(newsData?.data)
        setPage(newsData?.currentPage)
        setLastPage(newsData?.lastPage)
        setCount(newsData?.total)
    },[newsData])

    const goToPage = (event, value) => {
		setPage(value)
		Router.replace({ 
            pathname : "/news",
            query:{page: value}
        });
	}

    const shortText = (data) => {
        let text = locale == 'en' ? data?.body : data?.body_mm;

        if(text && text.length > 200) {
            return text.slice(0, 200) + '...';
        } else if(text && text.length < 200){
            return text;
        } else {
            return text;
        }
    }

    return (
        <>
            <Head>
				<title>{t('news')}</title>
			</Head>
            <Layout>
                <div className='w-full px-5 md:px-0 pt-5 md:pt-10 container mx-auto min-h-[550px] md:min-h-[700px] 2xl:min-h-[750px]'>
                    <div className="md:block flex justify-center items-center mb-2">
                        <Link href='/' className={styles.breadcrumb}>{t('home')}</Link> &ensp; / 
                        <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                            {t('news')}
                        </span>
                    </div>

                    {
                        news.length > 0 && news.map((data, index) => (
                            <div
                                key={index}
                                className={`w-full px-5 py-3 md:px-10 md:py-5 flex ${index % 2 === 0 ? 'bg-[#E5FAFF]' : 'bg-[#FCFCFC'}`}
                            >
                                <div className='flex-1'>
                                    <p className='text-[14px] md:text-[20px] font-bold'>
                                        { locale == 'en' ? data?.title : data?.title_mm ? data?.title_mm : '-' }
                                    </p>
                                    <div 
                                        className='text-[12px] md:text-[16px] mt-2 mb-2 md:mb-4'
                                        dangerouslySetInnerHTML={{ __html: shortText(data) }}
                                    />
                                    <Link 
                                        href={`/news/${encodeURIComponent(data?.id)}`}
                                        className='bg-[#005599] text-white text-[10px] md:text-[12px] px-3 py-1 md:px-5 md:py-1 rounded-2xl '
                                    >
                                        {t('continue-reading')}
                                    </Link>
                                </div>
                                <div className='ml-2 md:ml-4 flex items-center'>
                                    <img src='/icon/clock.svg' className='w-[15px] h-[15px] md:w-[26px] md:h-[26px]' />
                                    <p className='text-[10px] md:text-sm ml-2 font-[700] text-[#4F4F4F]'>
                                        {data?.date}
                                    </p>
                                </div>
                            </div>
                        ))
                    }

                    { count > 0 && 
                        <div className='py-1 w-full flex justify-center items-center mt-2 md:mt-4'>
                            <Pagination 
                                count={lastPage}
                                color="primary"
                                page={page}
                                onChange={goToPage}
                            />
                        </div>
                    }
				</div>
			</Layout>
        </>
    )
}