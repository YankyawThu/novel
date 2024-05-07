import React, {useRef, useState, useEffect} from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Api from "@/services/api";
import helper from '@/utils/helper'
import SweetAlert from 'react-bootstrap-sweetalert';
import Head from 'next/head'
import { useSession } from "next-auth/react"

export async function getServerSideProps(context) {
    const {query} = context;
    return {
        props: {
            mail: query.mail,
            messages: {
                ...require(`../../lang/${context.locale}.json`)
            }
        },
    };
}

export default function NewPassword({mail}) {
    const { locale } = useRouter();
    const t = useTranslations("Default");
    const router = useRouter()
    const {data:session} = useSession();

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [confirmError, setConfrimError] = useState('');
    
    const [title, setTitle] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        if(confirm && password && confirm !== password){
            setConfrimError('password-mismatch')
        } else {
            setConfrimError('')
        }
    }, [confirm, password])

    const resetPassword = async() => {
        try {
            const response = await Api.poster( null,'/auth/reset-password',{
                c: 9,
                email: mail,
                password: password,
                confirmPassword: confirm
            });
            const res = JSON.parse(helper.decrypt(response.data.data))
            
            if(res){
                setTitle('New Password is created Successfully!')
                setShowSuccess(true)
            }
        } catch(error){
            // console.log(error)
            setError(error?.response?.data?.error?.messages)
			setShowError(true)
        }
    }

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        setTitle('')
        if(session?.user){
            router.push({
                pathname: '/profile'
            })
        } else {
            router.push({
                pathname: '/login'
            })
        }
        
	};

    const handleCloseError = () => {
		setShowError(false)
	};

    return (
        <>
            <Head>
				<title>Reset Password</title>
			</Head>
            <Layout>
                <div className='w-full pt-5 container px-5 mx-auto min-h-[500px] 2xl:min-h-[650px]'>
                    <div className='text-[#005599]'>
                        <Link href='/' className='text-gray-500'>{t('home')}</Link> &ensp;
                        / &ensp; {t('reset-password')}
                    </div>

                    <div className='flex flex-col justify-center items-center w-full mt-4 lg:mt-8'>
                        <div className='bg-[#F1FAFB] rounded-lg px-5 py-3 lg:px-10 lg:py-7 md:w-[630px] flex flex-col justify-center items-center'>
                            <h1 className='text-center font-bold text-[#173F5F] text-xl'>
                                {t('create-new-password')}
                            </h1>
                            <p className='text-sm text-[#999999] mt-2 text-center lg:w-[360px]'>
                                {t('password-not-same-old')}
                            </p>

                            <div className='mt-4 lg:mt-8 border rounded-lg px-5 py-3 lg:px-10 lg:py-7 w-full md:w-[510px]'>
                                    <input
                                        type='password'
                                        autoComplete='off'
                                        name='new-password'
                                        placeholder={t('new-password')}
                                        className="mt-4 lg:mt-6 px-3 py-2 lg:px-5 lg:py-3 text-sm rounded-md w-full"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    />
                                    <input
                                        type='password'
                                        autoComplete='off'
                                        name='confirm-password'
                                        placeholder={t('confirm-password')}
                                        className="mt-4 lg:mt-6 px-3 py-2 lg:px-5 lg:py-3 text-sm rounded-md w-full"
                                        onChange={(e) => setConfirm(e.target.value)}
                                        value={confirm}
                                    />
                                    {
                                        confirmError && 
                                        <p className='text-xs text-red-600 mt-2'>
                                            {t(confirmError)}
                                        </p>
                                    }
                                <div className='mt-6 lg:mt-10 w-full flex items-center justify-start'>
                                    <button
                                        className='px-3 py-2 rounded-md text-white text-sm bg-[#005599]'
                                        onClick={() => resetPassword()}
                                    >
                                        {t('create')}
                                    </button>
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
                        title={title}
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
                        title="OTP Verification failed!"
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
                            {t('password-mismatch')}
                        </p>
                    </SweetAlert>
                }
            </Layout>
        </>
    )
}