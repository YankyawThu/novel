import React,{ useState, useEffect } from 'react'
import Link from 'next/link';
import styles from '@/styles/Profile.module.css'
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';

import SideTab from "./SideTab.js"
import Profile from "./Profile.js"
import Reading from "./Reading.js"
import Favorite from "./Favorite.js"
import ChangePassword from "./ChangePassword.js"
import Notification from "./Notification.js"
import Payment from "./Payment.js"
import Events from './Events.js';

export default function ProfileComponent(props) {
    const t = useTranslations("Default");
    const [currentTab, setCurrentTab] = useState('profile')
    const {locale, locales, route, query} = useRouter();
	const router = useRouter();

    useEffect(() => {
        let tab = 'profile'
        if(query && query.tab){
            tab = query?.tab
        }
        setCurrentTab(tab)
    }, [query])

    const updateCurrentTab = (data) => {
        if (data !== currentTab) {
            setCurrentTab(data)
            router.push({
                pathname: router.pathname,
                query: { tab: data }
            })
        }
    }

	return (
		<>
            <div className='w-full pt-5 container px-5 md:px-0 mx-auto min-h-[550px] md:min-h-[700px] 2xl:min-h-[750px]'>
                <div className="md:block flex justify-center items-center">
                    <Link href='/' className={styles.breadcrumb}>{t('home')}</Link> &ensp; / 
                    <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                        {t('account-info')} &ensp; / 
                    </span>
                    <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                        {t(currentTab)}
                    </span>
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-4 md:gap-6 mt-5'>
                    <div className='col-span-1'>
                        <SideTab currentTab={currentTab} updateCurrentTab={updateCurrentTab} />
                    </div>
                    <div className='col-span-3 pb-10'>
                        <div className=' w-full mt-3 md:mt-0'>
                            {
                                currentTab === 'profile' &&
                                <Profile user={props.user} updateUserData={props.updateUserData} currentTab={currentTab} updateCurrentTab={updateCurrentTab} />
                            }
                            {
                                currentTab === 'events' &&
                                <Events user={props.user} />
                            }
                            {
                                currentTab === 'reading-list' &&
                                <Reading user={props.user} />
                            }
                            {
                                currentTab === 'favorites' &&
                                <Favorite user={props.user} />
                            }
                            {
                                currentTab === 'change-password' &&
                                <ChangePassword user={props.user} />
                            }
                            {
                                currentTab === 'notifications' &&
                                <Notification user={props.user} />
                            }
                            {
                                currentTab === 'payment-history' &&
                                <Payment user={props.user} />
                            }
                        </div>
                    </div>
                </div>
            </div>
		</>
	)
}
