import Link from 'next/link';
import Image from 'next/image'
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import styles from '@/styles/Header.module.css'
import LocaleSwitcher from '@/components/LocaleSwitcher/index';
import { useSession } from "next-auth/react"
import Api from "@/services/api";
import helper from '@/utils/helper';

export default function Header(){
    const { locale } = useRouter()
    const t = useTranslations("Default");
    const {data:session} = useSession();

    const logoImg = '/logo/logo.svg';
    const searchIcon = '/icon/search.svg';
    const topupIcon = '/icon/bag.svg';
    const loginIcon = '/icon/user.svg';
    const profileIcon = '/icon/profile.svg';

    const [inputValue, setInputValue] = useState('');
    const [searchList, setSearchList] = useState([]);

    const handleChange = async (event) => {
        setInputValue(event.target.value);
        if(event.target.value){
            await searchBook()
        } else {
            setSearchList([])
        }
    };

    async function searchBook(){
        const result = await Api.puller(null, `/search-books`, {
                        c:9,
                        keyword: inputValue
                    })
        const books = JSON.parse(helper.decrypt(result.data.data))
        if(books && books.length > 0){
            setSearchList(books)
        }
    }

    function getUserName(name) {
        if(name.length > 6){
            return name.substring(0, 6) + ' ..';
        } else {
            return name;
        }
    }
    
    return (
        <div className='fixed top-0 w-full z-50'>
            <div 
                className={styles.top_nav}
                style={{backgroundImage: `url(${'/img/header-bg.png'})` }}
            >
                <div className='w-full flex items-center md:py-2 container mx-auto'>
                    <Link href="/" className='flex items-center w-full flex-1'>
                        <Image src={logoImg} alt="logo" width="60" height="60" />
                        <h2 className='xl:text-lg ml-3'>Novel & Comics</h2>
                    </Link>
                    <div className='flex justify-end items-center md:ml-4'>
                        <div className='relative'>
                            <input 
                                type="text"
                                className='w-[230px] lg:w-[330px] xl:w-[450px] bg-[#F1FAFB] px-5 py-3 rounded-3xl text-sm text-gray-500 focus:outline-none'
                                placeholder={t('search-books')}
                                value={inputValue}
                                onChange={handleChange}
                            />
                            <button 
                                className='absolute right-4 top-3'
                                onClick={searchBook}
                            >
                                <Image src={searchIcon} alt="search" width={18} height={18} />
                            </button>
                            {
                                searchList && searchList.length > 0 &&
                                <div className='bg-white rounded-md px-5 py-2 absolute w-[94%] left-[15px] top-[45px] z-50 max-h-[250px] overflow-auto'>
                                    <ul className='w-full'>
                                        { 
                                            searchList && searchList.length > 0 && searchList.map((item, index) => (
                                            <li 
                                                key={item.id}
                                                className={`w-full py-2 ${(index+1) < searchList.length ? 'border-b': ''}`}
                                            >
                                                <Link 
                                                    className='text-sm text-gray-600 hover:text-[#005599] font-bold w-full'
                                                    href={`/comics/${encodeURIComponent(item.slug)}`}
                                                >
                                                    { item.title }
                                                </Link>
                                            </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        <Link href="/topup" locale="en" className='md:ml-4 2xl:ml-14 inline-flex items-center justify-center rounded-3xl px-5 lg:px-8 py-3 bg-[#E5FAFF]'>
                            <Image src={topupIcon} alt="bag" width={12} height={13} />
                            <p className='md:ml-2 text-xs text-gray-500 uppercase tracking-wide'>{t('topup')}</p>
                        </Link>
                        {session?.user ? 
                            <Link 
                                href="/profile" 
                                locale="en" className='md:ml-4 inline-flex items-center justify-center rounded-3xl px-5 lg:px-8 py-2 bg-[#E5FAFF]'
                            >
                                <img src={profileIcon} alt="user" width={24} height={24} />
                                <p className='md:ml-2 text-xs text-gray-500 uppercase tracking-wide'>
                                    { session.user.name ? getUserName(session.user.name) : getUserName(session.user.username) }
                                </p>
                            </Link>
                            :
                            <Link 
                                href="/login" 
                                locale="en" className='md:ml-4 inline-flex items-center justify-center rounded-3xl px-5 lg:px-8 py-3 bg-[#E5FAFF]'
                            >
                                <Image src={loginIcon} alt="user" width={12} height={13} />
                                <p className='md:ml-2 text-xs text-gray-500 uppercase tracking-wide'>{t('login')}</p>
                            </Link>
                        }
                        
                        <Link
                            href={{
                                pathname: '/profile',
                                query: { tab: 'notifications' },
                            }}
                            locale="en" className='md:ml-4'
                        >
                            <Image src='/icon/bell.svg' alt="bell" width={32} height={32} />
                        </Link>

                        <LocaleSwitcher />
                    </div>
                </div>
                <div className='w-full flex items-center justify-center bg-[#005599]'>
                    <div className={styles.linkContainer}>
                        <Link href="/" 
                            className={styles.linkItem}
                        >
                            {t('home')}
                        </Link>
                        <div className={styles.linkHover}></div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link href="/comics" 
                            className={styles.linkItem}
                        >
                            {t('comics')}
                        </Link>
                        <div className={styles.linkHover}></div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link href="/novels" 
                            className={styles.linkItem}
                        >
                            {t('novels')}
                        </Link>
                        <div className={styles.linkHover}></div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link href="/news" 
                            className={styles.linkItem}
                        >
                            {t('news')}
                        </Link>
                        <div className={styles.linkHover}></div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link href="/contact" 
                            className={styles.linkItem}
                        >
                            {t('contact-us')}
                        </Link>
                        <div className={styles.linkHover}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}