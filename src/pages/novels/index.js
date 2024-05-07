import React from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Novel.module.css'
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

export default function Novel(){

    const { locale } = useRouter()
    const t = useTranslations("Novel");

    const img = '/img/coming-soon.png';
    const bgImg  = '/img/comingsoon-bg.png';

    return (
        <>
        <Head>
				<title>{t('novels')}</title>
			</Head>
            <Layout>
				<div className='w-full'>
					<div className='relative w-full flex flex-col mt-10'>
                        <img src={bgImg} alt="coming-soon" className='md:w-[100%] md:h-[100%]' />
						<div className='absolute px-14 rounded-lg md:w-[690px] md:h-[400px] sm:w-[300px] sm:h-[50px] xs:w-[300px] xs:h-[50px] md:mt-[3rem] md:ml-[8rem] sm:ml-[2rem] xs:ml-[2rem]'>
                            <img src={img} alt="coming-soon" className='md:w-[670px] md:h-[111px] md:mt-[3rem]' />
                            <p className={styles.header + ' md:text-[50px] sm:text-[20px] md:mt-[3rem] sm:mt-[1rem]'}>{t('stay-connected')}</p>
                            <p className={styles.paragraph + ' md:text-[30px] sm:text-[15px] md:mt-[3rem] sm:mt-[1rem]'}>{t('great-things-take-time')}</p>
						</div>
					</div>
				</div>
			</Layout>
        </>
    )
}