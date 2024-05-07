
import Api from '@/services/api';
import Rating from '@mui/material/Rating';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
const RatingModal = (props) => {
    const t = useTranslations("RatingModal");
    const { data: session } = useSession();

    const addRating = async (comicId, rate) => {
        try {
            console.log(rate)
            const res = await Api.poster(session.accessToken, `/comic-rate`, { c: 9, comicId: comicId, rate: rate });
            console.log(res)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        addRating(props.comicDetail.id, props.rate)
    },[props.rate])

    return (
        <div className='fixed bg-black-500 top-0 right-50 z-50 w-full min-h-screen bg-[#0000007e] grid items-center justify-center'>
            <div className='bg-white max-w-[500px] flex flex-col gap-10 px-5 py-5 min-w-[300px] items-center text-center z-6  rounded-xl'>
                <div className="w-full flex justify-end items-center">
                    <button onClick={() => props.handleClick(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className='text-2xl text-[#005599] font-semibold px-5'>{t('your-opinion-matter-to-us')}</p>
                <div className='flex flex-col gap-5 w-full'>
                    <div className='flex flex-col gap-5 bg-[#F1FAFB] p-5 w-full items-center '>
                        <p>{t('do-you-like-the-comic')}</p>
                        <Rating
                            name="simple-controlled"
                            size='large'
                            value={props.rate}
                            onChange={(event, newValue) => {
                                console.log(newValue)
                                props.setRate(newValue);
                            }}
                        />
                    </div>
                </div>
                <div className='flex gap-5'>
                <button className='text-[#005599]' onClick={() => props.handleClick(false)}>{t('maybe-later')}</button>
                <button className='text-[#005599]' onClick={() => props.handleClick(false)}>{t('submit-review')}</button>
                </div>
            </div>
        </div>
    )
}

export default RatingModal