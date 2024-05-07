import React, {useRef, useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Head from 'next/head'
import Api from "@/services/api";
import helper from '@/utils/helper'
import Pagination from '@mui/material/Pagination';
import dateformat from 'dateformat'

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

	if(!session){
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		}
	}

	try {
		const result = await Api.puller( session.accessToken,'/user/profile', {c:9});
		const res = JSON.parse(helper.decrypt(result.data.data))
		const user = res

		return {
			props: {
				isAuthenticated: true,
				user,
				messages: {
				...require(`../../lang/${context.locale}.json`)
				},
			},
		};

	}  catch (error) {
		if(error?.response?.data?.status === 40101){

			return {
				props: {
					isAuthenticated: false,
					user: null,
					messages: {
					...require(`../../lang/${context.locale}.json`)
					},
				},
			}
		} else {
            return {
				props: {
					isAuthenticated: true,
					user: null,
					messages: {
					...require(`../../lang/${context.locale}.json`)
					},
				},
			}
        }
    }
}

export default function PointHistory({isAuthenticated, user}) {
    const { locale } = useRouter()
	const router = useRouter()
    const {data:session} = useSession();
    const t = useTranslations("Default");

    const [ histories, setHistory ] = useState([])
    const [ page, setPage ] = useState(1)
    const [ perPage, setPerPage ] = useState(15)
    const [lastPage, setLastPage] = useState(1)
    const [count, setCount] = useState(0)
    const [startIndex, setStartIndex] = useState(1)

    useEffect(() => {
		if(!isAuthenticated){
			signOut({callbackUrl: '/login'})
		}
	}, [isAuthenticated])

    useEffect(() => {
        if(session?.accessToken){
            fetchHistory(page)
        }
    }, [session?.accessToken])

    const fetchHistory = async (page) => {
        try {
            const result = await Api.puller( session.accessToken,'/point-history',{c:9, page: page,type: 'comic', perPage: perPage});
            const res = JSON.parse(helper.decrypt(result.data.data))
            
            if(res){
                setHistory(res.data)
                setPage(res.currentPage)
                setLastPage(res.lastPage)
                setCount(res.total)
                setStartIndex(((res.currentPage * res.perPage) - res.perPage ) + 1)
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
			<Head>
				<title>Point History</title>
			</Head>
			<Layout>
                <div className='w-full pt-5 pb:5 md:pt-10 md:pb-20 container mx-auto px-5 md:px-0 min-h-[550px] md:min-h-[700px] 2xl:min-h-[750px]'>
                    <div className="tracking-wider text-xs">
						<Link href='/' className=''>{t('home')}</Link>
                        <span className='ml-2 text-blue-500 font-semibold'>/ &ensp; {t('point-history')}</span>
					</div>

                    <div className='w-full mt-2 md:mt-4'>
                        <p className='text-sm font-semibold'>
                            {t('point-history')}
                        </p>

                        <div className="w-full mt-4 overflow-auto md:overflow-hidden shadow rounded-lg">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-[#005599]">
                                    <tr>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                           {t('tableindex')}
                                        </th>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                           {t('type')}
                                        </th>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                           {t('comic')}
                                        </th>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                            {t('chapter')}
                                        </th>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                            {t('points')}
                                        </th>
                                        <th 
                                            scope="col"
                                            className="px-3 py-2 lg:px-5 lg:py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                                        >
                                            {t('date')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        histories.length > 0 && histories.map((history, index) => (
                                            <tr 
                                                key={index}
                                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                            >
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    { helper.localeNumbering(startIndex + index, t)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    {history.type}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    {history.comicName}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    {history.chapterName}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    { helper.localeNumbering(history.points, t)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                                    {dateformat(history.date, 'yyyy-mm-dd, h:MM:ss TT')}
                                                </td>
                                            </tr>
                                            
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        
                        {
                            count > 0 && 
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
                </div>
            </Layout>
        </>
    )
}