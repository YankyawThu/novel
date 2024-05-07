import styles from '@/styles/Detail.module.css'
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component'
import helper from '@/utils/helper'
import Api from "@/services/api";
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';

export default function Introduction(props){

    const { locale , route } = useRouter()
    const t = useTranslations("Default");

    const [description, setDescription] = useState('')
    const [seeMore, setSeeMore] = useState(false)

    useEffect(() => {
        if(seeMore){
            setDescription(props.description)
        } else {
            if(props.description.length > 300){
                setDescription(props.description.substring(0, 300) + "...")
            } else {
                setDescription(props.description)
            }
        }
    }, [seeMore, props.description])

    const rectangle = '/img/rectangle.png';
    const point = '/img/point.png';
    const free = '/img/comics/free.png';
    const downarrow = '/img/downarrow.png';

    return (
        <>
            <div className=''>
                <p className={styles.header}>{t('introduction')}</p>
                <hr className={styles.breakLine} />
                <div className='w-full'>
                    <div 
                        className={styles.desc}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {
                        !seeMore &&
                        <p className='cursor-pointer text-[#005599] font-semibold' onClick={() => setSeeMore(true)}>
                            {t('see-more')}
                        </p>
                    }
                    {
                        seeMore && 
                        <p className='cursor-pointer text-[#005599] font-semibold' onClick={() => setSeeMore(false)}>
                            {t('see-less')}
                        </p>
                    }
                </div>
                
            </div>

        </>
    )
}