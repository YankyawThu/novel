import Link from 'next/link';
import Image from 'next/image'
import React from 'react';
import styles from '@/styles/Footer.module.css'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';

export default function Footer (){
    const t = useTranslations("Default");
    const logoImg = '/logo/logo.svg';
    const igIcon = '/icon/ig.svg';
    const fbIcon = '/icon/fb.svg';
    const twIcon = '/icon/tw.svg';

    return (
        <div className={styles.footer}>
            <div className='w-full md:py-3 xl:py-5 container mx-auto'>

                <div className='flex items-center w-full px-0 py-3'>
                    <Link href="/">
                        <Image src={logoImg} alt="logo" width='55' height='55' />
                    </Link>
                    <div className='ml-4 xl:ml-10 w-full md:w-[560px] lg:w-[560px] xl:w-[560px]'>
                        <p className={styles.footerText}>
                            Welcome to ABC book mm - a site that provides readers with daily comic book, fiction reviews, and other tips. We have thousands of articles and guides to help you get the most out of your books.If there is any violation of copyright related regulations, please contact to delete.
                        </p>
                    </div>
                    <div className='flex flex-1 flex-col justify-center md:flex-row items-center md:justify-end pr-1'>
                        <a 
                            className={styles.footerIconBg}
                            href='https://www.facebook.com/profile.php?id=100090653635146'
                            target='_blank'
                        >
                            <Image src={fbIcon} alt="logo" width='20' height='20' />
                        </a>
                    </div>
                </div>

                <div className={styles.breakLine}></div>

                <div className='py-10'>
                    <p className='text-white text-[18px] font-bold'>Company</p>
                    <div className='grid grid-cols-5 md:grid-cols-4 gap-4 py-2'>
                        <div className='col-span-3'>
                            <div className='flex flex-col md:flex-row justify-between items-center w-full py-2'>
                                <Link href='/news' className={styles.footerLink}>{t('news')}</Link>
                                <a href='#' className={styles.footerLink}>Events</a>
                                <a href='/terms' className={styles.footerLink}>{t('terms-of-use')}</a>
                                <a href='/privacy-policy' className={styles.footerLink}>{t('privacy-policy')}</a>
                            </div>
                        </div>
                        <div className='col-span-2 md:col-span-1'>
                            <div className='flex justify-end items-center'>
                                <button className={styles.footerBtn}>Contact Us</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footerCpr}>
                    Copyright © 2023 ABC Novel - All Rights Reserved
                </div>
            </div>
        </div>
    );
}
