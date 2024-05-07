import React from 'react'
import Head from 'next/head'
import Link from 'next/link';
import Layout from '@/layouts/Layout'
import Slider from '@/components/slider'
import PaginationList from '@/components/Comic/pagination'
import Category from '@/components/Comic/category'
import Api from "@/services/api";
import Ranking from "@/components/Comic/ranking";
import styles from "@/styles/Comic.module.css";
import helper from '@/utils/helper'
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import LazyImage from '@/components/LazyImage';
import {useTranslations} from 'next-intl';
import { useRouter } from 'next/router'
import ImageComponent from '@/components/ImageComponent';
import { Rating } from '@mui/lab';

export async function getServerSideProps({req, locale,context}) {

    let sliders = []
    let firstWeeklyComic = null
    let firstMonthlyComic = null
    let weeklyComics = []
    let monthlyComics = []
    let genreFilters = []

    const result = await Api.puller( null,'/comic-widgets', {c:9});
	const res = JSON.parse(helper.decrypt(result.data.data))

    sliders = res?.sliders ?? []
    firstWeeklyComic = res?.weeklyComics?.shift() ?? null
    firstMonthlyComic = res?.monthlyComics?.shift() ?? null

    weeklyComics = res?.weeklyComics ?? []
    monthlyComics = res?.monthlyComics ?? []
    genreFilters = res?.genreFilter ?? []

	return {
        props: {
            sliders,
            weeklyComics,
            monthlyComics,
            firstWeeklyComic,
            firstMonthlyComic,
            genreFilters,
            messages: {
                ...require(`../../lang/${locale}.json`)
		    },
		},
	};
}

export default function Comics({ sliders, weeklyComics, monthlyComics,firstWeeklyComic,firstMonthlyComic,genreFilters}) {
	const t = useTranslations("Default");
	const { locale } = useRouter()

	const [page, setPage] = useState(1)
	const [books, setBook] = useState([])
	const [preBooks, setPreBook] = useState([])
	const [postBooks, setPostBook] = useState([])
	const [paginateOptions, setPagination] = useState(null)

	const [area, setArea] = useState('')
	const [areaList, setAreaList] = useState([])
	const [genre, setGenre] = useState('')
	const [genreList, setGenreList] = useState([])
	const [status, setStatus] = useState('')
	const [statusList, setStatusList] = useState([])
	const [vip, setVip] = useState('')
	const [vipList, setVipList] = useState([])

	const [isMobile, setIsMobile] = useState(false);
	

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

	const updateSelectedFilters = (g, a, s, v) => {
		if(a != 'all'){
			setArea(a)
		} else {
			setArea('')
		}
		if(g != 'all'){
			setGenre(g)
		} else {
			setGenre('')
		}
		if(s != 'all'){
			setStatus(s)
		} else {
			setStatus('')
		}
		if(v != 'all'){
			setVip(v)
		} else {
			setVip('')
		}
		setPage(1)
		fetchComics(1)
	}

	useEffect(() => {
		setGenreFilterList(genreFilters)
		fetchComics(page)
		console.log(books)
	}, [genreFilters, page, genre, area, status, vip, isMobile])

	async function  fetchComics(page){
		const result = await Api.puller(null, `/comics`, {
			c:9,
			page: page,
			perPage: isMobile ? 10 : 20,
			type: genre,
			area: area,
			status: status,
			vip: vip
		})
        const res = JSON.parse(helper.decrypt(result.data.data))
		
		if(isMobile){
			setBook(res.data)
		} else {
			setPreBook([])
			setPostBook([])
			let pre = [];let post = [];
			if(res.data && res.data.length > 0){
				res.data.map((item, index) => {
					if(index < 8){
						pre.push(item)
					} else {
						post.push(item)
					}
				})
				setPreBook(pre)
				setPostBook(post)
			}
		}
		
		setPagination({
			currentPage: res.currentPage,
			lastPage: res.lastPage,
			perPage: res.perPage,
			total: res.lastPage
		})
	}

	const setGenreFilterList = (genreFilters) => {
		genreFilters.map(item => {
			if(item.name === 'Area'){
				setAreaList(item.list)
			} else if(item.name === 'Type'){
				setGenreList(item.list)
			} else if(item.name === 'Status'){
				setStatusList(item.list)
			} else {
				setVipList(item.list)
			}
		})
	}

	const goToPage = (event, value) => {
		setPage(value)
		fetchComics(value)
	}

	return (
		<>
			<Head>
				<title>Comics</title>
			</Head>
			<Layout>
				<div className='w-full container mx-auto '>
					<div className='w-full pt-5'>
						<Slider sliderData={sliders} navigation={true} pagination={true} />
					</div>
					<div className='w-full mt-2 md:mt-8 px-5 md:px-0'>
						<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
							<div className="col-span-1 md:col-span-2">
								{ firstWeeklyComic && firstMonthlyComic && <Ranking
									firstWeeklyComic={firstWeeklyComic} 
									firstMonthlyComic={firstMonthlyComic} 
									weeklyComics={weeklyComics} 
									monthlyComics={monthlyComics}
								/> }
							</div>
						
							<div className="col-span-1 md:col-span-4">
								<Category 
									areaList={areaList}
									genreList={genreList}
									statusList={statusList}
									vipList={vipList}
									updateSelectedFilters={updateSelectedFilters}
								/>
								{
									isMobile &&
									<div className='mt-4 grid gap-4 grid-cols-2'>
										{
											books && books.length > 0 && books.map((book, index) => (
												<div className='col-span-1' key={book.id}>
													<Link 
														className="w-full"
														href={`/comics/${encodeURIComponent(book.slug)}`}
													>
														<div className="flex justify-center w-full">
															<div className='relative w-full h-full md:w-[170px] md:h-[250px]'>
																{ book && book.image && 
																	<ImageComponent 
																		src={book.image} 
																		alt="coverImage"
																		className={styles.bookImage} 
																	/>
																}
																
																<div 
																	className={styles.imageFix +' absolute bottom-0 flex justify-center items-center py-2'}
																>
																	<p className={'flex text-xs items-center'}>
																		{
																			book.type == 'free' ?
																			<img src="/img/comics/free.png" alt="free" />
																			:
																			<img src="/img/point.png" alt="paid" />
																		}
																		
																		<span className={styles.bookType + ' ml-2'}>
																			{ book.type == 'free' ? t('free') : t('points') }
																		</span>
																	</p>
																</div>
															</div>
														</div>
														
														<div className="mt-1">
															<p className={styles.bookTitle}>{book.title}</p>
															<p className="flex">
															<Rating name="read-only" value={book.ratingPercent} readOnly precision={0.5} size='small'/>
															</p>
														</div>
													</Link>
												</div>
											))
										}
									</div>
									
								}
								{
									!isMobile && 
										<div className='mt-4 grid gap-5 grid-cols-1 md:grid-cols-4'>
										{
											preBooks && preBooks.length > 0 && preBooks.map((comic, i) => (
												<div className='col-span-1' key={comic.id}>
													<Link 
														className="w-full"
														href={`/comics/${encodeURIComponent(comic.slug)}`}
													>
														<div className="flex justify-center">
															<div className='relative w-[170px] h-[250px]'>
																{ comic && comic.image && 
																	<ImageComponent 
																		src={comic.image} 
																		alt="coverImage"
																		className={styles.bookImage} 
																	/>
																}
																
																<div 
																	className={styles.imageFix +' absolute bottom-0 flex justify-center items-center py-2 w-[170px] h-[250px]'}
																>
																	<p className={'flex text-xs items-center'}>
																		{
																			comic.type == 'free' ?
																			<img src="/img/comics/free.png" alt="free" />
																			:
																			<img src="/img/point.png" alt="paid" />
																		}
																		<span className={styles.bookType + ' ml-2'}>
																			{ comic.type == 'free' ? t('free') : t('points') }
																		</span>
																	</p>
																</div>
															</div>
														</div>
														
														<div className="mt-1">
															<p className={styles.bookTitle}>{comic.title}</p>
															<p className="flex">
															<Rating name="read-only" value={comic.ratingPercent} readOnly precision={0.5} size='small'/>
															</p>
														</div>
													</Link>

													<br className={styles.breakLine}/>
												</div>
											))
										}
									</div>
								}
							</div>
						</div>

						{
							!isMobile && 
							<div className='mt-4 grid gap-5 grid-cols-6'>
								{
									postBooks && postBooks.length > 0 && postBooks.map((comic, i) => (
										<div className='col-span-1' key={comic.id}>
											<Link 
												className="w-full"
												href={`/comics/${encodeURIComponent(comic.slug)}`}
											>
												<div className="flex justify-center">
													<div className='relative w-[170px] h-[250px]'>
														{ comic && comic.image && 
															<ImageComponent 
																src={comic.image} 
																alt="coverImage"
																className={styles.bookImage} 
															/>
														}
														<div 
															className={styles.imageFix +' absolute bottom-0 flex justify-center items-center py-2 w-[170px] h-[250px]'}
														>
															<p className={'flex text-xs items-center'}>
																<img src="/img/comics/free.png" alt="book" />
																<span className={styles.bookType + ' ml-2'}>
																	{ comic.type == 'free' ? t('free') : t('points') }
																</span>
															</p>
														</div>
													</div>
												</div>
												
												<div className="mt-1">
													{/* <p className={styles.bookAuthor}>{book.author}</p> */}
													<p className={styles.bookTitle}>{comic.title}</p>
													<p className="flex">
															<Rating name="read-only" value={comic.ratingPercent} readOnly precision={0.5} size='small'/>
													</p>
												</div>
											</Link>

											<br className={styles.breakLine}/>
										</div>
									))
								}
							</div>
						}

						<div className='py-4 w-full flex justify-center items-center'>
							{ paginateOptions && paginateOptions.total && 
								<Pagination 
									count={paginateOptions.total}
									color="primary"
									page={paginateOptions.currentPage}
									onChange={goToPage}
								/>
							}
						</div>

					</div>

				</div>

			</Layout>
		</>
	)
}
