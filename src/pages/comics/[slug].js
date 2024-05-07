import React,{useEffect} from 'react'
import { NextSeo } from 'next-seo';
import Head from 'next/head'
import Layout from '@/layouts/Layout'
import ComicDetails from '@/components/ComicDetails'
import helper from '@/utils/helper'
import Api from "@/services/api";
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { signOut } from "next-auth/react"

export async function getServerSideProps(context) {
    const {query} = context
    const {slug} = query;

    const session = await getServerSession(context.req, context.res, authOptions)
    const authSession = session?.user ? session?.user : null;

    try {
        const result = await Api.puller( null,`/comic-detail/${slug}`, {c:9, readerId: session?.user?.id});
        const res = result.data.data ? JSON.parse(helper.decrypt(result.data.data)) : null
    
        let comicDetail = res?.comicDetail ?? null
        let popularComics = res?.popularComics ?? []
        let history = res?.history ?? null
    
        if(session && session.accessToken && comicDetail && comicDetail.id ){
            await Api.poster( session.accessToken ,`/comic-view`, {c:9, comicId: comicDetail.id});
        }
    
        return {
            props: {
                authSession,
                isAuthenticated: true,
                comicDetail,
                popularComics,
                history,
                messages: {
                    ...require(`../../lang/${context.locale}.json`)
                },
            },
        };
    } catch (error) {
        // console.log("error:", error);

        const result = await Api.puller( null,`/comic-detail/${slug}`, {c:9});
        const res = result.data.data ? JSON.parse(helper.decrypt(result.data.data)) : null
    
        let comicDetail = res?.comicDetail ?? null
        let popularComics = res?.popularComics ?? []
        let history = res?.history ?? null

        let isAuthenticated = true;

		if(error?.response?.data?.status === 40101){
            isAuthenticated = false;
		}

        return {
            props: {
                authSession,
                isAuthenticated: isAuthenticated,
                comicDetail,
                popularComics,
                history,
                messages: {
                    ...require(`../../lang/${context.locale}.json`)
                },
            },
        }
    }
}

export default function Details({comicDetail,popularComics, history, authSession, isAuthenticated}){
    useEffect(() => {
		if(authSession && !isAuthenticated){
			signOut()
		}
	}, [isAuthenticated, authSession])

	return (
		<>
			<Head>
				<title> {comicDetail?.title ?? 'Comic'} </title>
                <meta name="description" content={comicDetail?.title ?? 'Comic'} key="desc" />
				<meta property="og:title" content={comicDetail?.title ?? 'Comic'} />
				<meta
					property="og:image"
					content={comicDetail?.coverImage}
				/>
                <meta property="og:type" content="website" />
				<meta name="keywords" content="abcbookmm | abc book mm |abc comic myanmar | abc comic | abc book myanmar  | comic myanmar" />
				<meta property="og:url" content={`https://abcbookmm.com/en/comics/${comicDetail?.slug}`} />
			</Head>
			<Layout>
                <ComicDetails comicDetail={comicDetail} popularComics={popularComics} history={history} />
			</Layout>
		</>
	)
}