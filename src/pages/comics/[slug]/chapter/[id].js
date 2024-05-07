import React, { useState,useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/layouts/Layout'
import Api from "@/services/api";
import helper from '@/utils/helper'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import ComicReading from '@/components/Reading/Comic'
import { signOut } from "next-auth/react"

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)
	const comicSlug = context.query.slug;
	const chapterId = context.query.id;
	const page = context.query.page ? context.query.page : 1
	const sorting = context.query.sorting ? context.query.sorting : null
	if(!session){
		try {
			const result = await Api.puller( null,'/chapter-detail', {
				c:9,
				slug: comicSlug,
				chapterId: chapterId,
				page: page
			});
			const res = JSON.parse(helper.decrypt(result.data.data));
			return {
				props: {
					forceLogin: false,
					user: null,
					chapterDetail: res.chapterDetail,
					chapterId,
					chapterImages: res.chapterImages,
					prevChapter: res.prevChapter,
					nextChapter: res.nextChapter,
					sorting,
					messages: {
						...require(`../../../../lang/${context.locale}.json`)
					},
				},
			};
		} catch (error) {
			if(error?.response?.data?.status == 500){
				context.res.writeHead(302, { Location: `/comics/${comicSlug}` });
				context.res.end();
				return { props: {} };
			}
			return {
				props: {
					forceLogin: true,
					user: null,
					chapterDetail: null,
					chapterId,
					chapterImages: null,
					prevChapter: null,
					nextChapter: null,
					sorting,
					messages: {
						...require(`../../../../lang/${context.locale}.json`)
					},
				},
			}
		}
	} else {
		try {
			const result = await Api.puller( session.accessToken,'/comic-chapter-detail', {
				c:9,
				slug: comicSlug,
				chapterId: chapterId,
				page: page
			});
			const res = JSON.parse(helper.decrypt(result.data.data))
			return {
				props: {
					forceLogin: false,
					user: session.user,
					chapterDetail: res.chapterDetail,
					chapterId,
					chapterImages: res.chapterImages,
					prevChapter: res.prevChapter,
					nextChapter: res.nextChapter,
					sorting,
					messages: {
						...require(`../../../../lang/${context.locale}.json`)
					},
				},
			};
		} catch (error) {
			if(error.response.data.status === 40101){
				return {
					props: {
						forceLogin: true,
						user: null,
						chapterDetail: null,
						chapterId,
						chapterImages: null,
						prevChapter: null,
						nextChapter: null,
						sorting,
						messages: {
							...require(`../../../../lang/${context.locale}.json`)
						},
					},
				}
			}
		}
	}	
}

export default function Chapter({forceLogin, user, chapterId, chapterDetail, chapterList, chapterImages, sorting, prevChapter, nextChapter }) {
	// useEffect(() => {
	// 	if(forceLogin){
	// 		signOut({callbackUrl: '/login'})
	// 	}
	// }, [forceLogin])

	return (
		<>
			<Head>
				<title> {chapterDetail?.comicName} - {chapterDetail?.title} </title>
			</Head>
			<Layout>
				<ComicReading 
					user={user}
					chapterId={chapterId}
					chapterDetail={chapterDetail}
					chapterImages={chapterImages}
					sorting={sorting}
					prevChapter={prevChapter}
					nextChapter={nextChapter}
				/>
			</Layout>
		</>
	)
}