import React from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Contact.module.css'
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

export default function Contact() {
	const { locale } = useRouter()
    const t = useTranslations("Contact");

    const viber = '/img/viber.png';
    const viber1 = '/img/viber1.png';

	return (
		<>
			<Head>
				<title>Contact Us</title>
			</Head>
			<Layout>
				<div className='w-full pt-5 px-5 md:pt-10 pb-20 container mx-auto'>
					<div className={"tracking-wider text-xs"}>
						<Link href='/' className={styles.breadcrumb}>{t('home')}</Link> / <span className={styles.breadcrumb}>{t('contact-us')}</span>
					</div>
					<div className='w-full flex flex-col justify-center items-center mt-4 md:mt-10'>
						<div className='bg-[#F1FAFB] text-center px-5 py-3 md:px-14 md:py-10 rounded-lg md:w-[690px] md:h-[509px]'>
							<p className='font-bold text-xl p-0 mb-3 text-[#173F5F]'>{t('contact-us')}</p>
							<p className={'text-[#999999] mt-2 mb-5 text-sm' + styles.description}>
								{t('description')}<br/>{t('description1')}
							</p>
							<div className='md:px-14 md:py-5 px-5 py-3 border rounded-lg'>
                                <p className='text-[#005599] text-xs flex align-middle mb-5'>
                                    {/* <img src={viber} alt="rank1" className={'w-[36px] h-[38px]'} /> */}
                                    <span className="align-middle text-base pt-2">
										{t('Contact-with-viber')}
									</span>
                                </p>
                                <hr/>
								<div className='flex items-center justify-between pt-2 mt-8'>
									<p>ABC Book J/C/K Channel</p>
                                    <img src={viber1} alt="rank1" className={'w-[100px] h-[36px]'} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
		
	)
}