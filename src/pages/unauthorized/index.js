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

export default function Unauthorized() {
	const { locale } = useRouter()
    const t = useTranslations("Default");

    const img = '/img/unauthorized.png';

	return (
		<>
			<Head>
				<title>Unauthorized!</title>
			</Head>
            <Layout>
				<div className='w-full pt-10 pb-20 container mx-auto'>
					<div className='w-full flex flex-col justify-center items-center mt-10'>
						<div className='text-center px-14 rounded-lg w-[690px] h-[509px]'>
                            <img src={img} alt="unauthorized" className={'w-[200px] h-[200px] mb-[1rem] inline'} />
                            <p className={styles.header}>Oops, Unauthorized this page!</p>
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