import Link from 'next/link';
import Image from 'next/image'
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import styles from '@/styles/MobileHeader.module.css'
import LocaleSwitcher from '@/components/LocaleSwitcher/mobile';
import { useSession } from "next-auth/react"
import Api from "@/services/api";
import helper from '@/utils/helper';
import Drawer from '@mui/material/Drawer';

export default function MobileHeader(){
    const { locale } = useRouter()
    const t = useTranslations("Default");
    const {data:session} = useSession();

    const [inputValue, setInputValue] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [open, setOpen] = useState(false);

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
        <>
            <div className='fixed top-0 w-full z-50'>
                <div 
                    className={styles.top_nav}
                >
                    <div className='w-full flex items-center px-5 py-2 container mx-auto'>
                        <Link href="/" className='flex items-center w-full flex-1'>
                            <Image src='/logo/logo.svg' alt="logo" width="35" height="35" />
                            <h2 className='text-[11px] ml-1'>Novel & Comics</h2>
                        </Link>

                        <Link 
                            href="/topup"
                            className='ml-2 flex items-center justify-center rounded-3xl px-3 py-2 bg-[#E5FAFF]'
                        >
                            <Image src='/icon/bag.svg' alt="bag" width={11} height={12} />
                            <p className='ml-1 mt-1 text-[10px] text-gray-500 uppercase tracking-wide'>{t('topup')}</p>
                        </Link>
                        {session?.user ? 
                            <Link 
                                href="/profile" 
                                className='ml-2 flex items-center justify-center rounded-3xl px-3 py-2 bg-[#E5FAFF]'
                            >
                                <img src='/icon/profile.svg' alt="user" width={13} height={14} />
                                <p className='ml-1 text-[10px] text-gray-500 uppercase tracking-wide'>
                                    { session.user.name ? getUserName(session.user.name) : getUserName(session.user.username) }
                                </p>
                            </Link>
                            :
                            <Link 
                                href="/login" 
                                className='ml-2 flex items-center justify-center rounded-3xl px-3 py-2 bg-[#E5FAFF]'
                            >
                                <Image src='/icon/user.svg' alt="user" width={12} height={13} />
                                <p className='ml-1 text-[10px] text-gray-500 uppercase tracking-wide'>{t('login')}</p>
                            </Link>
                        }

                        <Link
                            href={{
                                pathname: '/profile',
                                query: { tab: 'notifications' },
                            }}
                            className='ml-2'
                        >
                            <Image src='/icon/bell.svg' alt="bell" width={24} height={24} />
                        </Link>
                    </div>
                </div>
                <div className='w-full bg-[#005599]'>
                    <div className='flex items-center px-5 py-2 container mx-auto'>
                        <div className='flex-1'>
                            <div className='relative w-3/4'>
                                <input 
                                    type="text"
                                    className='w-full bg-[#F1FAFB] px-5 py-2 rounded-3xl text-sm text-gray-500 focus:outline-none'
                                    placeholder={t('search-books')}
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                                <button 
                                    className='absolute right-4 top-3'
                                    onClick={searchBook}
                                >
                                    <Image src='/icon/search.svg' alt="search" width={18} height={18} />
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
                        </div>
                        <button 
                            className=''
                            onClick={() => setOpen(true)}
                            sx={{ ...(open && { display: 'none' }) }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="1.5" stroke="currentColor"
                                className="w-8 h-8 text-white"
                            >
                                <path 
                                    strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                
            </div>
            {
                open &&
                <>
                    <button
                        className='absolute bg-[#E5FAFF] p-1 rounded-full top-10 shadow-sm'
                        style={{right:'244px', zIndex: '1500'}}
                        onClick={() => setOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <Drawer
                        sx={{
                            width: '260px',
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: '260px',
                                backgroundColor: '#005599'
                            },
                        }}
                        anchor="right"
                        open={open}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        
                        <div className='w-full h-full flex flex-col pt-5 items-center relative'>
                            <LocaleSwitcher />
                            <Link href="/" 
                                className={styles.linkItem}
                            >
                                {t('home')}
                            </Link>
                            <Link href="/comics" 
                                className={styles.linkItem}
                            >
                                {t('comics')}
                            </Link>
                            <Link href="/novels" 
                                className={styles.linkItem}
                            >
                                {t('novels')}
                            </Link>
                            <Link href="/news" 
                                className={styles.linkItem}
                            >
                                {t('news')}
                            </Link>
                            <Link href="/contact" 
                                className={styles.linkItem}
                            >
                                {t('contact-us')}
                            </Link>
                        </div>
                    </Drawer>
                </>
            }
        </>
    )
}