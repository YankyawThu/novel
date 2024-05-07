import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import ImageComponent from '@/components/ImageComponent';
import React, { useState,useEffect } from 'react'
import helper from '@/utils/helper';

export default function Hot(props){
    const t = useTranslations('Default');

    const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    return (
        <div className='w-full p-0'>
            <div>
                <h1 className={styles.hotHeader}>{t('24hours-hot')}</h1>
            </div>
            {
                isMobile ?
                    <div className='w-full flex items-center overflow-x-auto'>
                    {
                        props.books?.map((item, index) => (
                            <div className={"col-span-1"} key={item.id}>
                                <Link
                                    href={`/comics/${encodeURIComponent(item.slug)}`}
                                >
                                    <div 
                                        className={`relative w-[90px] md:w-[120px] h-[105px] md:h-[160px] rounded-md ${index > 0 ? 'ml-2' : ''}`}
                                    >
                                        <ImageComponent src={item.coverImage} spinWidth='40' spinHeight='40' alt="rank1" className='w-[90px] md:w-[120px] h-[105px] md:h-[160px] rounded-md' />
                                        <div className={ styles.hotImgFix + ' absolute rounded-b-md bottom-0 flex justify-center items-center w-[90px] md:w-[120px] h-[28px]'}>
                                            <p className='text-white text-[11px] font-normal'>
                                                { item.title.length > 20 ?item.title.substring(0, 20)+" ..." : item.title }
                                            </p>
                                        </div>
                                    </div>
                                    
                                </Link>
                            </div>
                        ))
                    }
                    </div>
                :
                    <div className="grid md:grid-cols-6 mt-3 gap-2">
                    {
                        props.books?.map(item => (
                            <div className={"col-span-1"} key={item.id}>
                                <Link
                                    href={`/comics/${encodeURIComponent(item.slug)}`}
                                >
                                    <div className="relative w-[90px] lg:w-full xl:w-[120px] h-[105px] lg:h-[120px] xl:h-[160px] rounded-md">
                                        <ImageComponent src={item.coverImage} spinWidth='40' spinHeight='40' alt="rank1" className='w-[90px] lg:w-full xl:w-[120px] h-[105px] lg:h-[120px] xl:h-[160px] rounded-md' />
                                        <div className={ styles.hotImgFix + ' absolute rounded-b-md bottom-0 flex justify-center items-center w-[90px] lg:w-full xl:w-[120px] h-[28px]'}>
                                            <p className='text-white text-[11px] font-normal'>
                                                { item.title.length > 20 ?item.title.substring(0, 20)+" ..." : item.title }
                                            </p>
                                        </div>
                                    </div>
                                    
                                </Link>
                            </div>
                        ))
                    }
                </div>
            }
            
            
        </div>

    )
}