import React, {useRef, useState, useEffect, useCallback} from 'react'
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

export default function PaymentComponent(props) {
    const t = useTranslations("Default");
    const {data:session} = useSession();
    const { locale } = useRouter()
    const router = useRouter()

    const [user, setUser] = useState(props.user)
    const [point, setPoint] = useState(props.point)
    const [packages, setPackage] = useState(props.packages)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [payments, setPayment] = useState([])
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [account, setAccount] = useState(null)

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [transaction, setTransaction] = useState('')
    const [voucher, setVoucher] = useState('')
    const [voucherName, setVoucherName] = useState('')
    const uploadRef = useRef(null);

    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    
    useEffect(() => {
        let pack = helper.findByKeyword(props.packages, "point", props.point)
        if(pack){
            setSelectedPackage(pack)
        }
        fetchPayment()
    }, [props.point, props.packages, props.user])

    const fetchPayment = async() => {
        try {
            const response = await Api.puller( session?.accessToken,'/payments', {c:9});
            const result = JSON.parse(helper.decrypt(response.data.data))
            setPayment(result)
            setSelectedPayment(result[0])
        } catch(error){
            // console.log(error)
        }
    }

    useEffect(() => {
        refreshAccount()
    }, [selectedPayment])

    const refreshAccount = () => {
        if(selectedPayment && selectedPayment?.id){
            setAccount(null)
            fetchAccount()
        }
    }

    const makeTopup = async() => {
        try {
            const resTopup = await Api.filePoster( session?.accessToken,`/topup`, {
                c:9,
                packageId: selectedPackage?._id,
                paymentAccountId: account?.id,
                paymentPhone: account?.phone,
                point: selectedPackage?.point,
                readerAccountName: name,
                readerAccountNo: number,
                transactionNumber: transaction,
                voucher: voucher
            });
            if(resTopup?.data?.data){
                setShowSuccess(true)
            }
            if(resTopup?.data?.error?.messages){
                setInfo(response?.data?.error?.messages)
			    setShowInfo(true)
            }
        } catch(error){
            setError(error?.response?.data?.error)
			setShowError(true)
        }
    }

    const fetchAccount = async() => {
        try {
            const res = await Api.puller( session?.accessToken,`/payments/${selectedPayment?.id}/payment-acc`, {c:9});
            const data = JSON.parse(helper.decrypt(res.data.data))
            setAccount(data)
        } catch(error){
            console.log(error)
        }
    }

    const showFile = useCallback(() => {
        uploadRef.current?.click();
    }, []);

    const processFile = (event) => {
        const file = event.target.files[0];
        if(file){
            setVoucher(file)
            setVoucherName(file.name)
        }
        
    };

    const handleCloseError = () => {
		setError("");
		setShowError(false)
	};

    const handleCloseInfo = () => {
		setInfo("");
		setShowInfo(false)
	};

    const handleCloseSuccess = () => {
		setShowSuccess(false)
        router.push({
            pathname: '/profile',
            query:{
                tab: 'payment-history'
            }
        })
	};

    return (
        <>
            <div className='w-full px-5 md:px-0 pt-5 md:pt-7 mx-auto container min-h-[500px] 2xl:min-h-[650px]'>
                <div className="md:block flex justify-center items-center">
                    <Link href='/' className={styles.breadcrumb}>{t('home')}</Link> &ensp; / &ensp;
                    <Link href='/topup' className={styles.breadcrumb}>{t('topup')}</Link> &ensp; / 
                    <span className={ 'text-[#173F5F] font-semibold ml-2 ' + styles.breadcrumb}>
                        {t('buy-package')}
                    </span>
                </div>

                <div className='w-full md:flex items-center mt-4 md:mt-6 '>
                    <div className='flex items-center'>
                        <img src='/icon/star.svg' className='w-[18px] h-[18px] md:w-[30px] md:h-[30px]' alt="star" />
                        <p className='ml-1 md:ml-4 text-[14px] md:text-[20px]'>
                            {t('points')} :
                        </p>
                        <p className='ml-1 md:ml-2 font-bold text-[14px] md:text-[20px]'>{helper.localeNumbering(selectedPackage?.point, t)}</p>
                        <span className='ml-1 text-[12px] md:text-[15px] lowercase'>{t('points')}</span>
                    </div>

                    <div className='ml-1 md:ml-4 border-r-2 border-gray-500 h-[40px] hidden md:block' />

                    <div className='flex items-center mt-2 md:mt-0'>
                        <p className='ml-1 md:ml-4 text-[14px] md:text-[20px]'>
                            {t('amount')} :
                        </p>
                        <p className='ml-1 font-bold text-[14px] md:text-[20px] text-[#E1524C]'>{helper.localeNumbering(selectedPackage?.point, t)}</p>
                        <span className='ml-1 text-[12px] md:text-[15px] text-[#E1524C]'>MMK</span>
                    </div>
                    
                    <div className='ml-1 md:ml-4 border-r-2 border-gray-500 h-[40px] hidden md:block' />

                    <div className='flex items-center mt-2 md:mt-0'>
                        <p className='ml-1 md:ml-4 text-[14px] md:text-[20px]'>
                            {t('free')} :
                        </p>
                        <p className='ml-1 md:ml-2 font-bold text-[14px] md:text-[20px]'>{helper.localeNumbering(selectedPackage?.bonus, t)}</p>
                        <span className='ml-1 text-[12px] md:text-[15px] lowercase'>{t('points')}</span>
                    </div>
                </div>

                <p className='mt-2 md:mt-4 text-[12px] md:text-[16px]'>
                    <span className='text-red-500 font-semibold'>
                        Notice
                    </span>
                    : Please topup from Mon to Fri, between 8 AM to 5:30 PM. Otherwise, you will received  your points on the next day.
                </p>

                <div className='mt-4 md:mt-6 pb-3 border-b w-full md:text-[22px] font-bold'>
                    {t('payment-method')}
                </div>

                <div className='w-full grid grid-cols-3 md:grid-cols-6 gap-4 mt-4'>
                    {
                        payments.length > 0 && payments.map((payment, index) => (
                            <div key={index} className='col-span-1'>
                                <div 
                                    className='flex flex-col justify-center items-center cursor-pointer'
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    {
                                        payment?.isRecommended &&
                                        <div className='px-3 py-1 bg-[#005599] text-[10px] md:text-[12px] text-white rounded-xl'>
                                            {t('recommended')}
                                        </div>
                                    }
                                    <div
                                        className={`border-yellow-500 border-2 rounded-2xl ${payment?.isRecommended ? 'mt-1' : 'mt-[1.85rem]'} ${selectedPayment?.id == payment?.id ? '': 'opacity-40'}`} 
                                    >
                                        <ImageComponent
                                            src={payment.logo} 
                                            className={`md:w-[160px] md:h-[98px] rounded-2xl'}`}
                                        />
                                    </div>
                                    <div 
                                        className={`w-[22px] mt-2 h-[22px] flex justify-center items-center p-1 border rounded-full ${selectedPayment?.id == payment?.id ? ' border-[#FCD434] bg-[#333333]': 'border-[#999999]'}`}
                                    >
                                        {
                                            selectedPayment?.id == payment?.id && 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                                className="w-[20px] h-[20px] text-white"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <button 
                    className='mt-2 md:mt-4 bg-[#005599] rounded-lg md:rounded-2xl text-xs md:text-sm text-white px-3 md:px-8 py-2'
                    onClick={() => refreshAccount()}
                >
                    {t('refresh-account')}
                </button>

                <div className='mt-2 md:mt-6 w-full bg-[#F1FAFB] rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-4 px-5 py-2 md:py-5'>
                    <div className='col-span-1 md:col-span-3'>
                        <div className='w-full flex justify-center items-center h-full'>
                            <div className='text-left md:w-1/2'>
                                <p className='md:text-[20px]'>
                                    Acc Name : <b>{account?.name}</b>
                                </p>
                                <p className='md:text-[20px] mt-2'>
                                    Acc Number : <b>{account?.phone}</b>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <ImageComponent
                                src={account?.qrPath} 
                                className=''
                            />
                            <p className='mt-4 md:text-lg'>
                                Scan QR Code
                            </p>
                        </div>
                        
                    </div>
                </div>

                {
                    selectedPayment && account &&
                    <>
                        <div className='w-full mt-2 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 py-2'>
                            <div className='col-span-1'>
                                <p className='text-sm font-semibold'>
                                    {selectedPayment?.name} Account Name
                                </p>
                                <input
                                    className='w-full rounded-lg text-sm border py-4 px-3 mt-1'
                                    placeholder='Enter your account name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength='30'
                                    minLength='1'
                                />
                            </div>
                            <div className='col-span-1'>
                                <p className='text-sm font-semibold'>
                                    {selectedPayment?.name} Account Number
                                </p>
                                <input
                                    className='w-full rounded-lg text-sm border py-4 px-3 mt-1'
                                    placeholder='Enter your account number'
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    maxLength='15'
                                    minLength='1'
                                />
                            </div>
                            <div className='col-span-1'>
                                <p className='text-sm font-semibold'>
                                    {selectedPayment?.name} Transaction Last 4 Number
                                </p>
                                <input
                                    className='w-full rounded-lg text-sm border py-4 px-3 mt-1'
                                    placeholder='Enter your transaction number'
                                    value={transaction}
                                    onChange={(e) => setTransaction(e.target.value)}
                                    maxLength='4'
                                    minLength='1'
                                />
                            </div>

                            <div className='col-span-1'>
                                <p className='text-sm font-semibold'>
                                    Funding Confirmation (Screenshot)
                                </p>
                                <div 
                                    className={`w-full rounded-lg text-sm border px-3 mt-1 items-center relative flex ${voucherName ? 'py-4':'py-2' }`}
                                >
                                    <input
                                        className='hidden'
                                        type='file'
                                        ref={uploadRef}
                                        onChange={(e) => processFile(e)}
                                    />
                                    {
                                        !voucherName && 
                                        <img src='/icon/imageadd.svg' className='w-[36px] h-[36px]' />
                                    }
                                    
                                    {
                                        voucherName &&
                                        <p className='ml-4 text-sm text-gray-600'>
                                            {voucherName}
                                        </p>
                                    }
                                    {
                                        !voucherName && 
                                        <p className='ml-4 text-sm text-gray-400'>PDF or JPG or PNG </p>
                                    }
                                    <button
                                        className='px-5 py-4 rounded-md bg-[#005599] text-white absolute right-0'
                                        onClick={() => showFile()}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 md:mt-6 w-full flex justify-center mb-4 md:mb-6'>
                            <button 
                                className='inline-flex justify-center items-center bg-[#005599] text-white text-sm py-3 px-5 md:px-8 rounded-2xl'
                                onClick={() => makeTopup()}
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </>
                }

            </div>
            {
                showError && 
                <SweetAlert
                    custom
                    customIcon="/icon/error.svg"
                    title="Topup failed!"
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

            {
                showSuccess && 
                <SweetAlert
                    custom
                    customIcon="/icon/success.svg"
                    title="Topup Successfull!"
                    onConfirm={() => handleCloseSuccess()}
                    customButtons={
                        <>
                            <button
                                className='bg-[#4BCF40] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                onClick={() => handleCloseSuccess()}
                            >
                                Back To Payment History
                            </button>
                        </>
                        }
                />
            }

            {
                showInfo && 
                <SweetAlert
                    custom
                    customIcon="/icon/info.svg"
                    title="Information Required"
                    onConfirm={() => handleCloseInfo()}
                    customButtons={
                        <>
                            <button
                                className='bg-[#4891E1] text-white font-semibold flex justify-center w-5/6 py-3 rounded-2xl'
                                onClick={() => handleCloseInfo()}
                            >
                                Continue
                            </button>
                        </>
                        }
                >
                    <p className='text-sm text-gray-600 font-medium'>{info}</p>
                </SweetAlert>
            }
        </>
    )
}