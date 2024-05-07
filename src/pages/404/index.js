import React from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/NotFound.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Head from 'next/head'

export function getStaticProps({locale}) {
    return {
        props: {
          messages: {
          ...require(`../../lang/${locale}.json`)
          },
        },
    };
}

export default function NotFound() {
	const { locale } = useRouter()
    const t = useTranslations("Default");

    const img = '/img/404.png';
	const bgImg  = '/img/404-bg.png';

	return (
		<>
			<Head>
				<title>404 Not Found!</title>
			</Head>
            <Layout>
				<div className='w-full'>
					<div className = { 'w-full flex flex-col mt-10 relative'}>
						<img src={bgImg} alt="coming-soon" className='md:w-[100%] md:h-[100%]' />
						<div className='text-center pt-[10rem] px-14 ml-[15rem] rounded-lg w-[690px] h-[509px] absolute'>
                            <img src={img} alt="404" className={'w-[500px] h-[206px] mb-[3rem] '} />
                            <p className={styles.header}>Oops, this page is not found</p>
                            <p className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus.</p>
							<Link href="/">
                            	<button className={"rounded-full py-3 px-5 bg-[#005599] text-white"}>Go To Homepage</button>
							</Link>
						</div>
					</div>
				</div>
			</Layout>
		</>
		
	)
}