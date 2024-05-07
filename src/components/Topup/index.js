import React, {useRef, useState, useEffect} from 'react'
import Image from 'next/image'
import styles from '@/styles/Topup.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Api from "@/services/api";
import helper from '@/utils/helper'
import { useSession } from "next-auth/react"
import SweetAlert from 'react-bootstrap-sweetalert';
import ImageComponent from '@/components/ImageComponent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function TopupComponent(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const { locale } = useRouter()
    const router = useRouter()

    const [user, setUser] = useState(props.user)
    const [premiums, setPremium] = useState([])
    const [normals, setNormal] = useState([])
    const [open, setOpen] = useState(false)

    const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    useEffect(() => {
        fetctPackage()
    }, [])

    const fetctPackage = async() => {
        const response = await Api.puller( session?.accessToken,'/packages', {c:9});
		const packages = JSON.parse(helper.decrypt(response.data.data))
        setPremium(packages.premium)
        setNormal(packages.normal)
    }

    const selectPackage = (item) => {
        router.push({
            pathname:'/payment',
            query:{
                point: item.point
            }
        })
    }

    const closeDialog = () => {
        setOpen(false)
    }

    return (
        <>
            <div className='w-full px-5 md:px-0 pt-5 md:pt-7 container mx-auto min-h-[500px] 2xl:min-h-[650px]'>

                <div className="flex justify-center items-center md:block">
                    <Link href='/' className={styles.breadcrumb}>{t('home')}</Link> &ensp; / &ensp; 
                    <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                        {t('topup')}
                    </span>
                </div>

                <div className='mt-2 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6'>
                    <div className='col-span-1'>
                        <div className={styles.topUpCard + ' relative px-3 md:px-5 pt-5 pb-[4rem] xl:px-10 md:pt-8 xl:pt-10 md:pb-[5.4rem] md:pb-[4.4rem] xl:pb-[5.4rem]'}>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className='col-span-1'>
                                    <div className='rounded-full flex justify-center items-center relative'>
                                        {
                                            user?.profile && 
                                            <ImageComponent 
                                                src={user?.profile} 
                                                className='w-[104px] h-[100px] rounded-full' 
                                                spinWidth='40' spinHeight='40' 
                                            />
                                        }
                                        {
                                            !user?.profile &&
                                            <Image src='/icon/user.svg' width={60} height={60} alt="user" />
                                        }
                                        <img src='/icon/star.svg' alt='star' className='w-[30px] h-[30px] absolute bottom-2 right-[36.8%] md:right-5' />
                                    </div>
                                </div>
                                <div className='col-span-2'>
                                    <div className='text-white w-full flex items-center'>
                                        <p className='font-bold md:text-lg text-right w-[77px]'>
                                            {t('userID')} :
                                        </p>
                                        <p className='font-medium ml-4 md:ml-6 tracking-wider'>
                                            {user?.username}
                                        </p>
                                    </div>
                                    <div className='text-white w-full flex items-center mt-2 md:mt-4'>
                                        <p className='font-bold md:text-lg text-right w-[77px]'>
                                            VIP :
                                        </p>
                                        <p className='font-medium ml-4 md:ml-6 tracking-wider'>
                                            {t('premium-package')}
                                        </p>
                                    </div>
                                    <div className='text-white w-full flex items-center mt-2 md:mt-4'>
                                        <p className='font-bold md:text-lg text-right w-[77px]'>
                                            {t('points')} :
                                        </p>
                                        <p className='font-medium ml-4 md:ml-6 tracking-wider'>
                                            { helper.localeNumbering(user?.points, t) } &ensp; {t('points')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.abcpay+' cursor-pointer'}
                                onClick={() => setOpen(true)}
                            >
                                <Image src='/icon/alert.svg' width={20} height={20} alt="alert" className='mr-2' />
                                ABC Pay Center Introduction
                            </div>
                        </div>
                        
                    </div>

                    <div className='col-span-1 md:px-5 xl:pl-24'>
                        <div className='flex items-center text-lg md:text-[22px] font-bold text-[#333333] border-b py-2 md:-mt-[4.5rem]'>
                            <Image src='/icon/star.svg' className='mr-2' width={24} height={24} alt="star" />
                            {t('premium-packages')}
                        </div>
                        {
                            premiums && premiums.length > 0 && 
                            <div className='mt-4 md:mt-6 w-full grid gap-6 grid-cols-2'>
                                {
                                    premiums && premiums.length > 0 && premiums.map((premium, index) => (
                                        <div className='col-span-1' key={index}>
                                            <div
                                                className={styles.premiumPackage}
                                                onClick={() => selectPackage(premium)}
                                            >
                                                <div className={styles.premiumPackageHeader}>
                                                    {t('premium')}
                                                </div>
                                                <div className={styles.premiumCard}>
                                                    <p className='text-[22px] xl:text-[32px] text-white font-bold'>
                                                        {helper.localeNumbering(premium.amount, t)} <span className='text-[16px]'> MMK </span>
                                                    </p>
                                                    <p className='mt-2 text-white text-[14px]'>
                                                        [ {helper.localeNumbering(premium.point, t)} {t('points')}] 
                                                    </p>
                                                    <div className={styles.premiumPackageButton}>
                                                        {t('free')} {helper.localeNumbering(premium.bonus, t)} {t('points')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>

                {/* Start Normal */}
                <div className='w-full mt-4 md:mt-32 mb-6 md:mb-16'>
                    <div className='flex items-center text-lg md:text-[22px] font-bold text-[#333333] border-b py-2 md:-mt-[4.5rem]'>
                        <Image src='/icon/star.svg' className='mr-2' width={24} height={24} alt="star" />
                        {t('normal-packages')}
                    </div>
                    {
                        normals && normals.length > 0 && 
                        <div className='mt-4 md:mt-6 w-full grid gap-4 grid-cols-2 md:grid-cols-5'>
                            {
                                normals && normals.length > 0 && normals.map((normal, index) => (
                                    <div className='col-span-1' key={index}>
                                        <div 
                                            className={styles.normalPackage}
                                            onClick={() => selectPackage(normal)}
                                        >
                                            <div className={styles.normalPackageHeader}>
                                                {t('normal')}
                                            </div>
                                            <div className={styles.premiumCard}>
                                                <p className='text-[22px] xl:text-[32px] text-[#333333] font-bold'>
                                                    {helper.localeNumbering(normal.amount, t)} <span className='text-[16px]'> MMK </span>
                                                </p>
                                                <p className='mt-2 text-[#333333] text-[14px]'>
                                                    [ {helper.localeNumbering(normal.point, t)} {t('points')}] 
                                                </p>
                                                <div className={styles.premiumPackageButton}>
                                                    {t('free')} {helper.localeNumbering(normal.bonus, t)} {t('points')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
                {/* End Normal */}

            </div>
            {
                open && 
                <Dialog 
                    open={open} 
                    onClose={closeDialog}
                    className='w-full'
                >
                    <DialogContent
                        className='md:w-[600px] md:h-[600px]'
                    >
                        <div className='px-3 md:px-5 w-full'>
                            {
                                locale === 'en' &&
                                <>
                                    <h3 className='text-xl font-bold text-[#005599] text-center'>
                                        ABC Pay Center Page Introduction
                                    </h3>
                                    <div className='mt-4 md:mt-6 text-sm font-medium'>
                                        <p className='font-semibold'>
                                            Q. What channels are supported for pay?
                                        </p>
                                        <p className='mt-1'>
                                            A: Pay supports KBZ pay/ CB pay/ wave pay.
                                        </p>
                                        <p className='font-semibold mt-4'>
                                            Q. What is the pay ratio of points and cash?
                                        </p>
                                        <p className='mt-1'>
                                            A: The ratio is 1:1.
                                        </p>
                                        <p className='font-semibold mt-4'>
                                            Q. Where can the points after pay be used?
                                        </p>
                                        <p className='mt-1'>
                                            A: Points can be used to purchase paid chapters.
                                        </p>
                                        <p className='font-semibold mt-4'>
                                            Q. If the points are not used, will the points expire?
                                        </p>
                                        <p className='mt-1'>
                                            A: Points can be used to purchase paid chapters.
                                        </p>
                                        <p className='font-semibold mt-4'>
                                            Q. How are points deducted?
                                        </p>
                                        <p className='mt-1'>
                                            A: When the user opens the paid chapter, the points will be deducted automatically.
                                        </p>
                                        <p className='font-semibold mt-4'>
                                            Q. How many points will be deducted for a chapter?
                                        </p>
                                        <p className='mt-1'>
                                            A: The pricing of each chapter will be different, and different chapters are priced according to popularity, number of pages, etc.
                                        </p>

                                        
                                    </div>
                                    <p className='font-semibold mt-4 '>
                                        Note: The final interpretation right belongs to the ABC operation team.
                                    </p>
                                    
                                </>
                            }
                            {
                                locale === 'mm' &&
                                <>
                                    <h3 className='text-xl font-bold text-[#005599] text-center'>
                                        ABC အခကြေးငွေစင်တာ စာမျက်နှာမိတ်ဆက်ခြင်း။
                                    </h3>
                                    <div className='mt-4 md:mt-6 text-sm font-medium'>
                                        <p className='font-semibold'>
                                            မေး။ ငွေဖြည့်ရန်အတွက် မည်သည့်ချန်နယ်များဖြင့်ပေးချေနိုင်သနည်း။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ KBZ Pay/ CB Pay/ wave pay တို့ဖြင့်ပေးချေနိုင်ပါသည်။
                                        </p>
                                        <p className='font-semibold mt-5'>
                                            မေး။ အမှတ်နှင့် ငွေသား တို့၏အချိုးသည် အဘယ်နည်း။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ အချိုးသည် 1:1 ဖြစ်သည်။
                                        </p>
                                        <p className='font-semibold mt-5'>
                                            မေး။ ငွေပေးချေပြီးနောက် အမှတ်များကို မည်သည့်နေရာတွင် အသုံးပြုနိုင်သနည်း။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ အမှတ်ကောက် ရုပ်ပြ(သို့)ဝတ္ထု အခန်းများကိုဝယ်ယူရာတွင် အမှတ်များကို အသုံးပြုနိုင်သည်။
                                        </p>
                                        <p className='font-semibold mt-5'>
                                            မေး။ အမှတ်တွေကို အသုံးမပြုရင် အမှတ်တွေ သက်တမ်းကုန်ဆုံးနိုင်ပါသလား။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ အမှတ်များသည် သက်တမ်းရက်ဆွဲမရှိပါ။
                                        </p>
                                        <p className='font-semibold mt-5'>
                                            မေး။ အမှတ်တွေကို ဘယ်လိုနုတ်ယူသနည်း။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ အသုံးပြုသူသည် အမှတ်ကောက်အခန်းကို ဖွင့်ကြည့်သောအခါ အမှတ်များကို အလိုအလျောက် နုတ်ယူသွားမည်ဖြစ်သည်။
                                        </p>
                                        <p className='font-semibold mt-5'>
                                            မေး။ အခန်းတစ်ခန်းအတွက် အမှတ်ဘယ်လောက်နုတ်မလဲ။
                                        </p>
                                        <p className='mt-2'>
                                            ဖြေ။ အခန်းတစ်ခုစီ၏စျေးနှုန်းသည် ကွဲပြားမည်ဖြစ်ပြီး၊ အခန်းများကို လူကြိုက်များမှု၊ စာမျက်နှာအရေအတွက်၊ စသည်ဖြင့် ကွဲပြားသည်။
                                        </p>

                                        
                                    </div>
                                    <p className='font-semibold mt-4 '>
                                        Note: The final interpretation right belongs to the ABC operation team.
                                    </p>
                                    
                                </>
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            className='bg-gray-300 rounded-lg px-3 py-2'
                            onClick={() => closeDialog()}
                        >
                            {t('close')}
                        </button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}