import Link from 'next/link';
import Image from 'next/image'
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import styles from '@/styles/MobileFooter.module.css'
import LocaleSwitcher from '@/components/LocaleSwitcher/index';
import { useSession } from "next-auth/react"
import Api from "@/services/api";
import helper from '@/utils/helper';

export default function MobileFooter(){
    const { locale } = useRouter()
    const t = useTranslations("Default");
    const {data:session} = useSession();

    return (
        <>
            <div className='w-full bg-[#173F5F] py-5'>
                <div className='w-full container mx-auto'>
                    <div className='flex items-center py-2 w-full px-5'>
                        <Link href="/" className='flex-1'>
                            <Image src='/logo/logo.svg' alt="logo" width='38' height='41' />
                        </Link>
                        <a 
                            className={styles.footerIconBg}
                            href='https://www.facebook.com/profile.php?id=100090653635146'
                            target='_blank'
                        >
                            <Image src='/icon/fb.svg' alt="logo" width='13' height='16' />
                        </a>
                    </div>
                    <div className='py-2 w-full px-5 text-white text-[10px]'>
                        Welcome to ABC book mm - a site that provides readers with daily comic book, fiction reviews, and other tips. We have thousands of articles and guides to help you get the most out of your books.If there is any violation of copyright related regulations, please contact to delete.
                    </div>

                    <div className={styles.breakLine}></div>
                    <div className='w-full flex justify-between items-center py-2 px-5'>
                        <p className='text-white text-[14px] font-bold'>Company</p>
                        <button className={styles.footerBtn}>Contact Us</button>
                    </div>
                    <div className='w-full px-5 py-2 grid grid-cols-4 gap-3'>
                        <div className='col-span-1'>
                            <Link href='/news' className={styles.footerLink}>{t('news')}</Link>
                        </div>
                        <div className='col-span-1'>
                            <a href='#' className={styles.footerLink}>Events</a>
                        </div>
                        <div className='col-span-1'>
                            <a href='/terms' className={styles.footerLink}>{t('terms-of-use')}</a>
                        </div>
                        <div className='col-span-1'>
                            <a href='/privacy-policy' className={styles.footerLink}>{t('privacy-policy')}</a>
                        </div>
                    </div>
                    <div className='w-full px-5 py-2'>
                        <p className={styles.footerCpr}>
                            Copyright © 2023 ABC Novel - All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
