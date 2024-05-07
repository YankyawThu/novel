import React, {useRef, useState} from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Head from 'next/head'
import { signIn } from "next-auth/react"
import SweetAlert from 'react-bootstrap-sweetalert';
import helper from '@/utils/helper'
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

export async function getServerSideProps({req, locale, res}) {
	let userAgent = req.headers['user-agent']
    
    let isMobile = helper.isMobile(userAgent)
    let deviceOs = helper.extractOS(userAgent)
    let deviceName = isMobile ? helper.extractDeviceName(userAgent) : helper.extractBrowserName(userAgent)
	const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'];
    let deviceId = helper.getCookie('deviceId', req.headers.cookie);
	if (!deviceId) {
		deviceId = uuidv4();
		let cookieDeviceId = `deviceId=${deviceId}`;
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false, // Set to true in production
			maxAge: 60 * 60 * 24 * 7, // 1 week
			domain: process.env.NEXTAUTH_URL,
			path: '/',
			sameSite: 'Lax'
		};
		res.setHeader('Set-Cookie', cookie.serialize(cookieDeviceId, cookieOptions));
	}
	let ga = helper.getCookie('_ga', req.headers.cookie);
	let gaUser = ga ?? deviceId;

	return {
		props: {
			messages: {
				...require(`../../lang/${locale}.json`)
			},
			isMobile,
            deviceName,
            deviceOs,
            deviceId,
			ipAddress: ipAddress ? ipAddress : null,
			gaUser: gaUser
		},
	};
}

export default function Login({isMobile, deviceName, deviceOs, deviceId, ipAddress, gaUser}) {
	const { locale } = useRouter()
	const router = useRouter()
    const t = useTranslations("Login");
	const username = useRef("");
	const password = useRef("");
	const [showError, setShowError] = useState(false);
	const [error, setError] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await signIn('credentials',{
				username: username.current,
				password: password.current,
				isMobile: isMobile,
				deviceName: deviceName,
				deviceOs: deviceOs,
				deviceId: deviceId,
				ipAddress: ipAddress,
				gaUser: gaUser, 
				redirect: false
			})
			if (res?.error) {
				setError(res.error)
				setShowError(true)
			} else {
				router.push('/');
			}

		} catch (error) {
			console.error(error);
		}
	}
	
	const handleCloseError = () => {
		setError("");
		setShowError(false)
	};

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<Layout>
				<div className='w-full pt-5 pb:5 md:pt-10 md:pb-20 container mx-auto px-5 md:px-0'>
					<div className="tracking-wider text-xs">
						<Link href='/' className={styles.breadcrumb}>{t('home')}</Link> / <span className={styles.breadcrumb}>{t('login')}</span>
					</div>
					<div className='w-full flex flex-col justify-center items-center mt-4 md:mt-10'>
						<div className='bg-[#F1FAFB] text-center px-5 py-3 md:px-14 md:py-10 w-full md:w-[630px] rounded-lg'>
							<p className='font-bold text-lg'>{t('login')}</p>
							<p className='text-[#999999] mt-2 mb-3 text-sm'>
								{t('description')}
							</p>
							<form onSubmit={handleSubmit}>
								<div className='md:px-14 md:py-10 px-3 py-2 border rounded-lg'>
									<input 
										type='text' 
										placeholder='Username or Email Address'
										className={styles.authPlaceholder+' rounded-lg focus:outline-none w-full px-5 py-3 my-4'}
										onChange={(e) => (username.current = e.target.value)}
									/>
									<input 
										type='password' 
										placeholder={t('password')}
										className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-full px-5 py-3 my-4'}
										onChange={(e) => (password.current = e.target.value)}
									/>
									<div className='flex items-center justify-between pt-2'>
										<button type="submit" className='bg-[#005599] rounded text-white py-2 px-7'>
											{t('signin')}
										</button>
										<Link href='/forget-password' className='text-[#005599] text-xs'>
											{t('forget-password')}
										</Link>
									</div>
									<div className='text-left text-[#005599] text-sm mt-4'>
										<Link href='/register'>
											{t('create-account')}
										</Link>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				{
					showError && 
					<SweetAlert
						custom
						customIcon="/icon/error.svg"
						title="Authentication failed!"
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
				
			</Layout>
		</>
		
	)
}