import React, { useState,useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/layouts/Layout'
import News from '@/components/Home/news';
import Hot from '@/components/Home/hot';
import RecommendedComic from '@/components/Home/recommendedComics';
import HomeComics from '@/components/Home/homeComics';
import RecommendedNovel from '@/components/Home/recommendedNovel';
import HomeNovel from '@/components/Home/homeNovel';
import HomeSlider from '@/components/Home/slider';
import helper from '@/utils/helper';
import Api from "@/services/api";
import { useSession } from "next-auth/react"
import { NextSeo } from 'next-seo';
import { getHomeWidget } from "./api/home";
import Router from "next/router";
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

export async function getServerSideProps({req, locale, res}) {
	let ga = helper.getCookie('_ga', req.headers.cookie);
	let deviceId = helper.getCookie('deviceId', req.headers.cookie);
	if (!deviceId) {
		deviceId = uuidv4();
		let cookieDeviceId = `deviceId=${deviceId}`;
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false, // Set to true in production
			maxAge: 60 * 60 * 24 * 7, // 1 week
			domain: process.env.NEXTAUTH_URL,
			path: '/',
			sameSite: 'Lax'
		};

		res.setHeader('Set-Cookie', cookie.serialize(cookieDeviceId, cookieOptions));
	}

	let gaUser = null;
	if(ga){
		gaUser = ga;
	} else {
		gaUser = deviceId;
	}
	if(gaUser){
		const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'];
		if(ipAddress){
			try {
				const result = await Api.poster( null,'/visit-ip', {
					c: 9,
					ipAddress: ipAddress,
					gaUser: gaUser
				});
			} catch(error){
				console.log(error)
			}
		}
	}

	const response = await getHomeWidget();
	let news = response?.news ?? []
	let sliders = response?.sliders ?? []
	let hots = response?.hots ?? []
	let ads = response?.ads ?? []
	let comicGenres = response?.comicGenres ?? []
	let recommendComics = response?.recommendComics ?? []
	let novelGenres = response?.novelGenres ?? []
	
  	return {
      	props: {
			news,
			sliders,
			hots,
			ads,
			comicGenres,
			novelGenres,
			recommendComics,
			messages: {
			...require(`../lang/${locale}.json`)
			},
      	},
  	};
}

export default function Index({sliders, news, hots, ads, comicGenres,recommendComics}) {

	const promotion = ads.length > 0 ? ads[0].image : '/img/promotion.png';

	const [isMobile, setIsMobile] = useState(false);
	const [adsUrl, setAdsUrl] = useState('');

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
		if(ads.length > 0 && ads[0]?.url){
			setAdsUrl(ads[0]?.url)
		}
	}, [ads])

	return (
		<>
			<Head>
				<title>ABC Comics & Novels</title>
				<meta property="og:type" content="website" />
				<meta name="keywords" content="abcbookmm | abc book mm |abc comic myanmar | abc comic | abc book myanmar  | comic myanmar" />
				<meta property="og:url" content="https://abcbookmm.com/en" />
				<meta name="description" content="abcbookmm | abc book mm |abc comic myanmar | abc comic | abc book myanmar  | comic myanmar" key="desc" />
				<meta property="og:title" content="ABC Comics & Novels" />
				<meta
					property="og:image"
					content="https://abcbookmm.com/favicon.png"
				/>
			</Head>
			<Layout>
				<div className="w-full">
					<HomeSlider sliders={sliders} />
				</div>
				<div className='w-full mt-4 md:mt-[100px] container mx-auto px-5'>
					{
						isMobile ?
						<div>
							<Hot books={hots} />
							<div className='mt-2'>
								<News news={news} />
							</div>
							
						</div>
						:
						<div className="grid grid-cols-6 gap-5">
							<div className="col-span-2">
								<News news={news}/>
							</div>
							<div className="col-span-4">
								<Hot books={hots} />
							</div>
						</div>
					}

					{
						isMobile ?
							<>
								<div className='w-full mt-4'>
									<HomeComics genreData={comicGenres} />
								</div>
								<div className='w-full mt-4'>
									<RecommendedComic recommendComics={recommendComics}/>
								</div>
							</>
						:
						<div className="grid grid-cols-6 gap-5 mt-[4rem]">
							<div className="col-span-2">
								<RecommendedComic recommendComics={recommendComics}/>
							</div>
							<div className="col-span-4">
								<HomeComics genreData={comicGenres} />
							</div>
						</div>
					}
				</div>
				<div className='w-full h-full mt-8 mb-2 cursor-pointer'>
					<a href={adsUrl} target='_blank'>
						<img 
							src={promotion} 
							alt="ads" 
							className='w-full h-full'
						/>
					</a>
					
				</div>
				{/* <div className='w-full container mx-auto px-5'>
					{
						isMobile ?
							<>
								<div className='w-full mt-5'>
									<RecommendedNovel recommendComics={recommendComics}/>
								</div>
								<div className='w-full mt-4'>
									<HomeNovel genreData={comicGenres} />
								</div>
								
							</>
						:
						<div className="grid grid-cols-6 gap-5 mt-[4rem]">
							<div className="col-span-2">
								<RecommendedNovel recommendComics={recommendComics}/>
							</div>
							<div className="col-span-4">
								<HomeNovel genreData={comicGenres} />
							</div>
						</div>
					}
				</div> */}
			</Layout>
		</>
	)
}
