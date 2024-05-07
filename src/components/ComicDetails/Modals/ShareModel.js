
import {FacebookShareButton, ViberShareButton, TelegramShareButton} from "react-share"
import Image from 'next/image';
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Api from "@/services/api";
import helper from '@/utils/helper';
import { useState, useEffect } from "react";

const ShareModal = (props) => {
    const url = window.location.href;
    const [copy, setCopy] = useState(false)
    const t = useTranslations("ShareModal");
    const {data:session} = useSession();


    const shareReward = async () => {
        if(session?.accessToken){
            const res = await Api.poster( session?.accessToken,`/share-reward`, {
                c:9,
                comicId: props.comicDetail?.id
            });
        }  
        
    }

    const shareLink = async () => {
        if(session?.accessToken){
            const res = await Api.poster( session?.accessToken,`/share-reward`, {
                c:9,
                comicId: props.comicDetail?.id
            });
        }

        navigator.clipboard.writeText(url);
        setCopy(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCopy(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [copy]);

    return (
        <div className='fixed bg-black-500 top-0 right-50 z-50 w-full min-h-screen bg-[#0000007e]  grid items-center justify-center'>
            <div className='bg-white max-w-[500px] flex flex-col gap-10 py-5 min-w-[200px] items-center text-center z-6 rounded-xl px-10'>
                <div className="w-full flex justify-end items-center">
                    <button onClick={() => props.handleClick(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className='text-2xl text-[#005599] font-semibold'>{t('share-this-comic')}</p>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-5 bg-[#F1FAFB] p-5'>
                        <p>{t('share-it-with-your-friends-and-get-points')}</p>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 '>
                            <FacebookShareButton url={url} quote={props.comicDetail.description} hashtag="manga">
                                <button 
                                    onClick={() => { shareReward() }}
                                    className='bg-[#337FFF] w-full px-3 py-2 text-white rounded-lg flex items-center gap-5'
                                >
                                    <Image src="/icon/facebook.svg" width={12} height={22} alt="facebook"/>
                                    Facebook
                                </button>
                            </FacebookShareButton>
                            <TelegramShareButton url={url} title={props.comicDetail.title}>
                                <button 
                                    onClick={() => { shareReward() }} className='bg-[#34AADF] w-full px-3 py-2 text-white rounded-lg flex items-center gap-5'>
                                    <Image src="/icon/telegram.svg" width={21} height={18} alt="telegram" />Telegram
                                </button>
                            </TelegramShareButton>
                            <ViberShareButton url={url} title={props.comicDetail.title + ": " + props.comicDetail.chapter}>
                                <button 
                                    onClick={() => { shareReward() }} className='bg-[#754A91] w-full px-3 py-2 text-white rounded-lg flex items-center gap-5'>
                                    <Image src="/icon/viber.svg" width={20} height={21} alt="viber" />Viber
                                </button>
                            </ViberShareButton>
                        </div>
                        <p>(or)</p>
                        <div className='flex border-2 border-[#005599] rounded-lg  items-center w-[350px] md:w-full'>
                            <small className='text-xs px-5 truncate w-[350px]'>{url}</small>
                            <button className='bg-[#005599] h-full p-3 text-white' onClick={() => { shareLink() }}>{t('copy-link')}</button>
                        </div>
                        {copy && t('link-copied-to-clipboard')}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ShareModal