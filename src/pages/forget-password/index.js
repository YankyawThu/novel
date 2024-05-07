import React, {useRef, useState, useEffect} from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import {useTranslations} from 'next-intl';
import Api from "@/services/api";
import helper from '@/utils/helper'
import SweetAlert from 'react-bootstrap-sweetalert';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"

export async function getServerSideProps(context) {
    return {
        props: {
          messages: {
          ...require(`../../lang/${context.locale}.json`)
          }
        },
    };
}

export default function ForgetPassword() {
    const { locale } = useRouter();
    const t = useTranslations("Default");
    const router = useRouter()
    const {data:session} = useSession();

    const [email, setEmail] = useState('')
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const sendCode = async() => {
        try {
            const response = await Api.poster( null,'/auth/forget-password',{
                c: 9,
                email: email,
            });
            const res = JSON.parse(helper.decrypt(response.data.data))
            
            if(res){
                setShowSuccess(true)
            }
        } catch(error){
            // console.log(error)
			setShowError(true)
        }
    }

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        setEmail('')
        router.push({
            pathname: '/verify-otp',
            query: { mail: email }
        })
	};

    const handleCloseError = () => {
		setShowError(false)
	};

    return (
        <>
            <Head>
				<title>Forget Password</title>
			</Head>
            <Layout>
                <div className='w-full pt-5 container px-5 md:px-0 mx-auto min-h-[500px] 2xl:min-h-[650px]'>
                    <div className='text-[#005599]'>
                        <Link href='/' className='text-gray-500'>{t('home')}</Link> &ensp;
                        / &ensp; {t('forget-password-title')}
                    </div>

                    <div className='flex flex-col justify-center items-center w-full mt-4 lg:mt-8'>
                        <div className='bg-[#F1FAFB] rounded-lg px-5 py-3 lg:px-10 lg:py-7 w-full md:w-[630px] flex flex-col justify-center items-center'>
                            <h1 className='text-center font-bold text-[#173F5F] text-lg'>
                                {t('forget-password-title')}
                            </h1>
                            <p className='text-sm text-[#999999] mt-2 text-center lg:w-[360px]'>
                                {t('forget-password-conent')}
                            </p>

                            <div className='mt-4 lg:mt-8 border rounded-lg px-5 py-3 lg:px-10 lg:py-7 w-full md:w-[510px]'>
                                <input
                                    type='email'
                                    autoComplete='off'
                                    name='email'
                                    placeholder={t('email')}
                                    className="px-3 py-2 lg:px-5 lg:py-3 text-sm rounded-md w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <div className='mt-6 lg:mt-10 w-full flex items-center justify-between'>
                                    <button
                                        className='px-3 py-2 rounded-md text-white text-sm bg-[#005599]'
                                        onClick={() => sendCode()}
                                    >
                                        {t('send-code')}
                                    </button>
                                    {
                                        session?.user && 
                                        <Link href='/profile' className='text-[#005599]'>
                                            {t('remember-password')} ?
                                        </Link>
                                    }
                                    {
                                        !session?.user && 
                                        <Link href='/login' className='text-[#005599]'>
                                            {t('remember-password')} ?
                                        </Link>
                                    }
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                {
                    showSuccess && 
                    <SweetAlert
                        custom
                        customIcon="/icon/success.svg"
                        title="OTP is sent to mail Successfully!"
                        onConfirm={() => handleCloseSuccess()}
                        customButtons={
                            <>
                                <button
                                    className='bg-[#4BCF40] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                    onClick={() => handleCloseSuccess()}
                                >
                                    Continue
                                </button>
                            </>
                            }
                    />
                }
                {
                    showError && 
                    <SweetAlert
                        custom
                        customIcon="/icon/error.svg"
                        title="Change password failed!"
                        onConfirm={() => handleCloseError()}
                        customButtons={
                            <>
                                <button
                                    className='bg-[#E64747] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                    onClick={() => handleCloseError()}
                                >
                                    Continue
                                </button>
                            </>
                            }
                    >
                        <p className='text-sm text-gray-600 font-medium'>
                            {t('email-unlink-account')}
                        </p>
                    </SweetAlert>
                }
            </Layout>
        </>
    )
}