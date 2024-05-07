import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router'

export default function News(props){
    const { locale } = useRouter()

    const t = useTranslations('Default');
    const arrow = '/img/arrow.png';
    const rectangle = '/img/rectangle.png';

    // const [news, setNews] = useState(props.news);

    return (
        <div className='w-full p-0'>
            <div className="flex justify-between">
                <h1 className={styles.news}>{t('news')}</h1>
                <Link className={styles.newsSeeAll} href='/news'>
                    {t('see-all')}
                    <img src={arrow} alt="rank1" className={'w-[100] h-[100] inline-flex pl-2'} />
                </Link>
            </div>
            <div className='border-2 border-sky-600 rounded-md mt-3 p-3' >
                {
                    props?.news?.map((news, item) => {
                        return (
                            <div
                                className="w-full flex"
                                key={news._id}
                            >
                                <div className="">
                                    <img 
                                        src={rectangle} 
                                        alt="rank1" 
                                        className='w-[16px] h-[8px] mt-1'
                                    />
                                </div>

                                <div className="ml-4 flex-1">
                                    <p className={styles.newsParagraph}>
                                        {locale == 'en' ? news?.title : news?.title_mm ? news?.title_mm : '-' }
                                    </p>
                                    { (item+1) < props?.news.length &&  <hr className={styles.breakLine}/> }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}