import React,{ useState, useEffect, useRef, useCallback } from 'react'
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Api from "@/services/api";
import helper from '@/utils/helper'
import { useSession } from "next-auth/react"
import ImageComponent from '@/components/ImageComponent';
import Pagination from '@mui/material/Pagination';
import styles from '@/styles/Profile.module.css'
import { useRouter } from 'next/router'
import SweetAlert from 'react-bootstrap-sweetalert';

export default function ChangePassword(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const router= useRouter();
    const [user, setUser] = useState(props.user)
    const [current, setCurrent] = useState('')
    const [newP, setNewP] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [newError, setNewError] = useState('');
    const [confirmError, setConfrimError] = useState('');

    useEffect(() => {
        if(current && newP && current === newP){
            setNewError('password-not-same-old')
        } else {
            setNewError('')
        }
    }, [current, newP])

    useEffect(() => {
        if(confirm && newP && confirm !== newP){
            setConfrimError('password-mismatch')
        } else {
            setConfrimError('')
        }
    }, [confirm, newP])

    const changePassword = async() => {
        try {
            const response = await Api.poster( session.accessToken,'/auth/change-password',{
                c: 9,
                oldPassword: current,
                password: newP,
                confirmPassword: confirm
            });
            const res = JSON.parse(helper.decrypt(response.data.data))
            
            if(res){
                setShowSuccess(true)
            }
        } catch(error){
            // console.log(error)
            setError(error.response.data.error)
			setShowError(true)
        }
    }

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        setCurrent('')
        setNewP('')
        setConfirm('')
	};

    const handleCloseError = () => {
		setShowError(false)
	};

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('change-password')}
                </div>
                <div className='w-full py-3 px-5 xl:px-10'>
                    <div className='flex flex-col justify-center items-center mt-2 lg:mt-8'>
                        <p className='text-[20px] text-[#173F5F] font-bold'>
                            {t('change-your-password')}
                        </p>
                        <p className='mt-2 text-[16px] text-[#999999]'>
                            {t('change-password-content')}
                        </p>

                        <div className='mt-4 lg:mt-8 border rounded-xl px-5 py-3 lg:px-10 lg:py-8 md:w-[510px]'>
                            <input
                                type='password'
                                autoComplete='off'
                                name='current-password'
                                placeholder={t('current-password')}
                                className="px-3 py-2 lg:px-5 lg:py-3 text-sm rounded-md w-full"
                                onChange={(e) => setCurrent(e.target.value)}
                                value={current}
                            />
                            <input
                                type='password'
                                autoComplete='off'
                                name='new-password'
                                placeholder={t('new-password')}
                                className="mt-4 lg:mt-6 px-3 py-2 lg:px-5 lg:py-3 text-sm rounded-md w-full"
                                onChange={(e) => setNewP(e.target.value)}
                                value={newP}
                            />
                            {
                                newError && 
                                <p className='text-xs text-red-600 mt-2'>
                                    {t(newError)}
                                </p>
                            }
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

                            <div className='mt-4 lg:mt-6 w-full flex items-center justify-between'>
                                <button
                                    className='px-3 py-2 rounded-md text-white text-sm bg-[#005599]'
                                    onClick={() => changePassword()}
                                >
                                    {t('change')}
                                </button>
                                <Link href='/forget-password' className='text-[#005599]'>
                                    {t('forget-password')}
                                </Link>
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
                    title="Successfully password changed!"
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
                    <p className='text-sm text-gray-600 font-medium'>{error}</p>
                </SweetAlert>
            }
        </>
    )
}