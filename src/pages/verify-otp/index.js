import React, {useRef, useState, useEffect} from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Api from "@/services/api";
import axiosInstance from "@/services/axios";
import helper from '@/utils/helper'
import SweetAlert from 'react-bootstrap-sweetalert';
import Head from 'next/head'

export async function getServerSideProps(context) {
    const {query} = context;
    return {
        props: {
            mail: query.mail,
            register: query.r,
            messages: {
                ...require(`../../lang/${context.locale}.json`)
            }
        },
    };
}

export default function VerifyOtp({mail, register}) {
    const { locale } = useRouter();
    const t = useTranslations("Default");
    const router = useRouter()

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const otpInputRef = useRef([]);
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false);
    const [title, setTitle] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);
    const [showResentSuccess, setShowResentSuccess] = useState(false);

    const handleChange = (index, event) => {
        const value = event.target.value;
        setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            return newOtp;
        });
    
        if (event.target.nextSibling && value) {
            event.target.nextSibling.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData("text/plain");
        const otpArray = pasteData.split("").slice(0, 6);
        setOtp(otpArray);
    };

    const verifyOTP = async() => {
        try {
            const response = await axiosInstance.post('/auth/verify-otp',{
                c: 9,
                email: mail,
                otpCode: otp.join('')
            });
            const res = JSON.parse(helper.decrypt(response.data.data))
            
            if(res){
                if(register && register !== undefined){
                    setTitle('OTP is successfully verified for registration!')
                } else {
                    setTitle('OTP is verified successfully!')
                }
                
                setShowSuccess(true)
            }
        } catch(error){
            console.log(error)
            setError(error?.response?.data?.error)
			setShowError(true)
        }
    }

    const sendCode = async() => {
        try {
            const response = await axiosInstance.post('/auth/resend-otp',{
                c: 9,
                email: mail,
            });
            const res = JSON.parse(helper.decrypt(response.data.data))
            
            if(res){
                setTitle('OTP Code is resent to mail Successfully!')
                setShowResentSuccess(true)
            }
        } catch(error){
            // console.log(error)
			setShowError(true)
        }
    }

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        
        if(title === 'OTP is verified Successfully!'){
            router.push({
                pathname: '/new-password',
                query: { mail: mail }
            })
        }else{
            router.push({
                pathname: '/login'
            })
        }

        setTitle('')
	};

    const handleResentCloseSuccess = () => {
        setShowResentSuccess(false)
        setTitle('')
    };

    const handleCloseError = () => {
		setShowError(false)
	};

    return (
        <>
            <Head>
				<title>Verify OTP</title>
			</Head>
            <Layout>
                <div className='w-full pt-5 mx-3 container md:mx-auto min-h-[500px] 2xl:min-h-[650px]'>
                    <div className='text-[#005599]'>
                        <Link href='/' className='text-gray-500'>{t('home')}</Link> &ensp;
                        / &ensp; {t('verify-otp')}
                    </div>

                    <div className='flex flex-col justify-center items-center w-full mt-4 lg:mt-8'>
                        <div className='bg-[#F1FAFB] rounded-lg px-5 py-3 lg:px-10 lg:py-7 md:w-[630px] flex flex-col justify-center items-center'>
                            <h1 className='text-center font-bold text-[#173F5F] text-xl'>
                                {t('otp-verification')}
                            </h1>
                            <p className='text-sm text-[#999999] mt-2 text-center lg:w-[360px]'>
                                {t('otp-verification-conent')}
                            </p>

                            <div className='mt-4 lg:mt-8 border rounded-lg px-5 py-3 lg:px-20 lg:py-10 md:w-[510px]'>
                                <div className='flex items-center w-full'>
                                    {
                                        otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="number"
                                                maxLength={1}
                                                value={data}
                                                onChange={(event) => handleChange(index, event)}
                                                onPaste={handlePaste}
                                                ref={(el) => (otpInputRef.current[index] = el)}
                                                className='border rounded-md mr-2 w-[48px] h-[48px] text-sm text-center'
                                            />
                                        ))
                                    }
                                </div>
                            
                                <div className='mt-6 lg:mt-10 w-full flex items-center justify-between'>
                                    <button
                                        className='px-3 py-2 rounded-md text-white text-sm bg-[#005599]'
                                        onClick={() => verifyOTP()}
                                    >
                                        {t('verify')}
                                    </button>
                                    <button 
                                        className='text-[#005599]'
                                        onClick={() => sendCode()}
                                    >
                                        {t('resend-code')} ?
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
                    showResentSuccess &&
                    <SweetAlert
                        custom
                        customIcon="/icon/success.svg"
                        title={title}
                        onConfirm={() => handleResentCloseSuccess()}
                        customButtons={
                            <>
                                <button
                                    className='bg-[#4BCF40] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                    onClick={() => handleResentCloseSuccess()}
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
                            {t('email-unlink-account')}
                        </p>
                    </SweetAlert>
                }
            </Layout>
        </>
    )
}