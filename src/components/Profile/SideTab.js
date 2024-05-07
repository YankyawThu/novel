import React,{ useState, useEffect } from 'react'
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import profileJson from '@/dummy/profile.json'
import { signOut } from "next-auth/react"

export default function SideTab(props) {
    const t = useTranslations("Default");

    const [currentTab, setCurrentTab] = useState(props.currentTab)

    useEffect(() => {
        setCurrentTab(props.currentTab)
    }, [props.currentTab])

    useEffect(() => {
        props.updateCurrentTab(currentTab)
    }, [currentTab])

    return (
        <>
            <div className='w-full px-3 py-3 rounded-xl bg-[#F1FAFB] border grid grid-cols-2 md:grid-cols-1 gap-4'>
                {
                    profileJson.sideTab.map((item, index) => (
                        <div className='col-span-1' key={index}>
                            <div 
                                className={`w-full rounded-lg cursor-pointer flex items-center px-3 py-2 md:px-5 md:py-4 ${currentTab == item.value ? 'text-white bg-[#005599]' : 'bg-white text-gray-600'}`}
                                onClick={() => setCurrentTab(item.value)}
                            >
                                <Image src={item.icon} width='30' height='30' alt={item.name} />
                                <p className='ml-2 lg:ml-4 text-[14px] md:text-sm lg:font-semibold lg:tracking-wider'>{ t(item.name) }</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <button 
                onClick={() => signOut({callbackUrl: '/login'})}
                className='mt-3 md:mt-6 rounded-lg text-white flex justify-center items-center px-3 py-2 lg:px-5 lg:py-4 bg-[#E1524C] w-full font-bold'
            >
                <Image src='/icon/logout.svg' width='30' height='30' alt='logout' />
                <p className='ml-3'>
                    {t('logout')}
                </p>
            </button>
        </>
    )
}