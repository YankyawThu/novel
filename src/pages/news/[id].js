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
import { useSession } from "next-auth/react"
import ImageComponent from '@/components/ImageComponent';

export async function getServerSideProps(context) {
    const newId = context.query.id ? context.query.id : null
    let  newsData = null

    try {
        const result = await Api.puller( null,`/news/${newId}`,{c:9});
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

export default function NewsDetail({newsData}){
    const {data:session} = useSession();
    const { locale } = useRouter()
    const t = useTranslations("Default");

    const [news, setNews] = useState(null)
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        setNews(newsData)
        setComments(newsData?.comment)
    },[news])

    const handleSubmit = async () => {
        if(session?.accessToken){
            try {
                const res = await Api.poster( session?.accessToken,'/comment',{
                            c:9,
                            newsId: news._id,
                            comment: comment
                        });
                let result = JSON.parse(helper.decrypt(res.data.data))
                window.location.reload();
            } catch (e) {
                // console.log(e)
            }
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
                        <Link href='/news' className={ 'ml-2 ' + styles.breadcrumb}>
                            {t('news')}
                        </Link>&ensp; / 
                        <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                            {locale == 'en' ? news?.title : news?.title_mm ? news?.title_mm : '-'}
                        </span>
                    </div>

                    <div className='mt-2 md:mt-4 w-full'>
                        <p className='text-lg md:text-2xl font-bold text-center md:text-left tracking-wider'>
                            {locale == 'en' ? news?.title : news?.title_mm ? news?.title_mm : '-'}
                        </p>
                        <div
                            className='text-[12px] md:text-[16px] mt-2 mb-2 md:mb-4 tracking-wide leading-6' 
                            dangerouslySetInnerHTML={{ __html: locale == 'en' ? news?.body : news?.body_mm }}
                        />
                    </div>

                    <div className='mt-2 md:mt-4 md:mb-4 mb-2 w-full bg-[#E5FAFF] px-3 py-3 md:px-5 md:py-5'>
                        <p className='text-sm md:text-lg font-bold mb-2'>
                            {t('comment-discussion')}
                        </p>

                        {
                            comments?.length > 0 && comments.map((item, index) => (
                                <div 
                                    key={index}
                                    className='w-full flex py-2 md:py-4 border-b'
                                >
                                    <ImageComponent src={item?.reader?.profile} className='w-[50px] h-[50px] md:w-[82px] md:h-[82px] rounded-full' />
                                    <div className='ml-2 md:ml-4 flex-1'>
                                        <p className='text-[#333333] text-[15px] md:text-[18px] font-semibold'>
                                            {item?.reader?.name}
                                        </p>
                                        <p className='mt-1 text-[#005599] text-[10px] md:text-[13px]'>
                                            {item?.date}
                                        </p>
                                        <p className='mt-2 text-[12px] md:text-[14px] w-full text-[#333333]'>
                                            {item?.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                        
                        {
                            session?.user &&
                            <div className='w-full mt-2 md:mt-4 flex '>
                                <div>
                                    {
                                        session?.user?.profile ?
                                        <ImageComponent src={session?.user?.profile} className='w-[50px] h-[50px] md:w-[82px] md:h-[82px] rounded-full' />
                                        :
                                        <div className='p-2 bg-[#005599] rounded-full'>
                                            <img src='/icon/profile.svg' className='w-[52px] h-[52px]' />
                                        </div>
                                    }
                                    
                                </div>
                                
                                
                                <div className='ml-2 md:ml-4 border border-[#005599] rounded-lg px-3 py-2 md:px-5 md:py-3 flex-1 bg-white'>
                                    <textarea 
                                        name="about"
                                        rows="3"
                                        className="w-full text-gray-600 text-sm leading-6 focus:ring-nome"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        minLength='1'
                                        maxLength='255'
                                    />
                                    <div className='border-t border-[#005599]'></div>
                                    <div className='flex w-full mt-2 justify-end'>
                                        <button
                                            className='text-white px-3 py-1.5 md:px-5 rounded-2xl bg-[#005599]'
                                            onClick={() => handleSubmit()}
                                        >
                                            {t('comment')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
				</div>
			</Layout>
        </>
    )
}