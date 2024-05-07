import React, {useRef, useState} from 'react'
import Layout from '@/layouts/Layout'
import styles from '@/styles/Auth.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import axiosInstance from "@/services/axios";
import helper from '@/utils/helper';
import Router from 'next/router'
import SweetAlert from 'react-bootstrap-sweetalert';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';
import { useEffect } from "react";
import { parse, serialize, erase } from 'cookie';
import Api from "@/services/api";

export async function getServerSideProps(context) {
    const ipAddress = context.req.headers['cf-connecting-ip'] || context.req.headers['x-forwarded-for'];

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false, // Set to true in production
        maxAge: 60 * 60 * 24 * 7, // 1 week
        domain: process.env.NEXTAUTH_URL,
        path: '/',
        sameSite: 'Lax'
    };

    let deviceId = helper.getCookie('deviceId', context.req.headers.cookie);
    if (!deviceId) {
		deviceId = uuidv4();
		let cookieDeviceId = `deviceId=${deviceId}`;
		context.res.setHeader('Set-Cookie', cookie.serialize(cookieDeviceId, cookieOptions));
	}

    const queryR = context.query.r;

    const cookieR = helper.getCookie('r', context.req.headers.cookie);

    let referCode = queryR ? queryR : cookieR ? cookieR : null;

	let ga = helper.getCookie('_ga', context.req.headers.cookie);
	let gaUser = ga ?? deviceId;

    let result = await Api.puller( null,'/event', { c:9 });
    const event = JSON.parse(helper.decrypt(result.data.data))

  	return {
      	props: {
            ipAddress: ipAddress ? ipAddress : null,
            gaUser,
            referCode,
            event: event ?? null,
			messages: {
			...require(`../../lang/${context.locale}.json`)
			}
      	},
  	};
}

export default function Register({ipAddress, gaUser, referCode, event}) {

    const { locale } = useRouter();
    const t = useTranslations("Default");
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [showError, setShowError] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
	const [error, setError] = useState('')
    const [info, setInfo] = useState('')

    useEffect(() => {
        if(referCode){
            let r = referCode ? referCode : localStorage.getItem('r') ? localStorage.getItem('r') : null;
            localStorage.setItem('r', r);
        }
    }, []);

    const changeUsername = (e) => {
        let value = e.target.value;
        setUsername(value);
        if(value){
            let isValid = /^[a-z0-9_]{4,15}$/.test(value);
            if (isValid) {
                setUsernameError('');
            } else {
                setUsernameError("Username is invalid!");
            }
        } else {
            setUsernameError('');
        }
    }

    const changeName = (e) => {
        let value = e.target.value;
        setName(value);
        if(value){
            let isValid = /^[a-zA-Z' ]{3,20}$/.test(value);
            if (isValid) {
                setNameError('');
            } else {
                setNameError("Profile Name is invalid!");
            }
        } else {
            setNameError('');
        }
    }

    const changeEmail = (e) => {
        let value = e.target.value;
        setEmail(value);
        if(value){
            let isValid = /^(?=.{1,50}$)\S+@\S+\.\S{2,}$/.test(value);
            if (isValid) {
                setEmailError('');
            } else {
                setEmailError("Email is invalid!");
            }
        } else {
            setEmailError('');
        }
    }

    const changePassword = (e) => {
        let value = e.target.value;
        setPassword(value);
        if(value){
            let isValid = /^.{6,20}$/.test(value);
            if (isValid) {
                setPasswordError('');
            } else {
                setPasswordError("Password is invalid!");
            }
        } else {
            setPasswordError('');
        }
    }

    const changeConfirmPassword = (e) => {
        let value = e.target.value;
        setConfirmPassword(value);
        if(value){
            const regex = new RegExp("^" + password + "$", "i");
            let isValid = regex.test(value);
            if (isValid) {
                setConfirmPasswordError('');
            } else {
                setConfirmPasswordError("Confirmed Password does not same with password!");
            }
        } else {
            setConfirmPasswordError('');
        }
    }

    const handleSubmit = async (e) => {
		e.preventDefault();

        if(username.length > 10 || password.length > 10 || confirmPassword.length > 10) {
            setError('Text limit exceeded!')
            setShowError(true)
        } else {
            try {
                const response = await axiosInstance.post("/auth/register", {
                    username,
                    name,
                    email,
                    password,
                    confirmPassword,
                    ipAddress,
                    gaUser,
                    referCode
                });
                if(response?.data?.data?.results?.code){
                    setShowSuccess(true)
                }
                if(response?.data?.error?.messages){
                    setInfo(response?.data?.error?.messages)
                    setShowInfo(true)
                }
            } catch( error) {
                console.log(error)
                setError(error?.response?.data?.error)
                setShowError(true)
            }
        }
	}

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
        if(referCode){
            if(referCode){
                localStorage.removeItem('r');
            }
        }
        Router.push({
            pathname: '/verify-otp',
            query: { mail: email, r: true }
        })
	};

    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="keywords" content="abcbookmm | abc book mm |abc comic myanmar | abc comic | abc book myanmar  | comic myanmar" />
                <meta property="og:url" content="https://abcbookmm.com/en/register" />
                <meta property="og:type" content="website" />
                {
                    event ? 
                    <>
                        <meta name="description" content={event?.description ?? "description"} />
                        <meta property="og:description" content={event?.description ?? "description"} key="desc" />
                        <meta property="og:title" content={event?.name ?? "Registration"} />
                        <meta
                            property="og:image"
                            content={ event?.image ?? "https://abcbookmm.com/favicon.png"}
                        />
                    </>
                    :
                    <>
                        <meta name="description" content="description" />
                        <meta property="og:description" content="abcbookmm | abc book mm |abc comic myanmar | abc comic | abc book myanmar  | comic myanmar" key="desc" />
                        <meta property="og:title" content="Registration" />
                        <meta
                            property="og:image"
                            content="https://abcbookmm.com/favicon.png"
                        />
                    </>
                }
				
			</Head>
            <Layout>
                <div className='w-full pt-5 md:pt-10 md:pb-20 container mx-auto px-5 md:px-0'>
                    <div><Link href='/'>Home</Link> / Create Account</div>

                    <div className='w-full flex flex-col justify-center items-center mt-4 md:mt-10'>
                        <div className='bg-[#F1FAFB] text-center px-5 py-3 md:px-14 md:py-10 rounded-lg'>
                            <div className='font-bold text-lg'>Create Account</div>
                            <div className='text-[#999999] mb-3'>Please register using account detail bellow.</div>
                            <div className='md:px-14 md:py-10 px-3 py-2 border rounded-lg'>
                                <form onSubmit={handleSubmit}>
                                    <p className='text-xs mt-2 text-gray-400 w-full text-left'>
                                        Username must be lowercase, between 4 and 15 characters.
                                    </p>
                                    <input 
                                        type='text' 
                                        placeholder='Username'
                                        value={username}
                                        className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-80 px-5 py-3 mt-1'}
                                        onChange={(e) => changeUsername(e)}
                                        maxLength='15'
                                        minLength='1'
                                        autoComplete="off"
                                    />
                                    {
                                        usernameError && 
                                        <p className='text-xs mt-1 text-red-400 w-full text-left'>
                                            {usernameError}
                                        </p>
                                    }
                                    <p className='text-xs mt-4 text-gray-400 w-full text-left'>
                                        Profile Name must be between 4 and 20 characters.
                                    </p>
                                    <input 
                                        type='text' 
                                        placeholder='Profile Name'
                                        value={name}
                                        className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-80 px-5 py-3 mt-1'}
                                        onChange={(e) => changeName(e)}
                                        maxLength='20'
                                        minLength='1'
                                        autoComplete="off"
                                    />
                                    {
                                        nameError && 
                                        <p className='text-xs mt-1 text-red-400 w-full text-left'>
                                            {nameError}
                                        </p>
                                    }
                                    <input 
                                        type='email' 
                                        placeholder='Email'
                                        value={email}
                                        className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-80 px-5 py-3 mt-4'}
                                        onChange={(e) => changeEmail(e)}
                                        autoComplete="off"
                                        maxLength='50'
                                    />
                                    {
                                        emailError && 
                                        <p className='text-xs mt-1 text-red-400 w-full text-left'>
                                            {emailError}
                                        </p>
                                    }
                                    <p className='text-xs mt-4 text-gray-400 w-full text-left'>
                                        Password must be between 6 and 20 characters.
                                    </p>
                                    <input 
                                        type='password' 
                                        placeholder='Password'
                                        value={password}
                                        className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-80 px-5 py-3 mt-2'} 
                                        onChange={(e) => changePassword(e)}
                                        maxLength='20'
                                        minLength='6'
                                    />
                                    {
                                        passwordError && 
                                        <p className='text-xs mt-1 text-red-400 w-full text-left'>
                                            {passwordError}
                                        </p>
                                    }
                                    <p className='text-xs mt-4 text-gray-400 w-full text-left'>
                                        Confirmed Password must be same with password.
                                    </p>
                                    <input 
                                        type='password'
                                        value={confirmPassword}
                                        placeholder='Confirm Password' 
                                        className={styles.authPlaceholder+' block rounded-lg focus:outline-none w-80 px-5 py-3 my-4'} 
                                        onChange={(e) => changeConfirmPassword(e)}
                                        maxLength='20'
                                        minLength='6'
                                    />
                                    {
                                        confirmPasswordError && 
                                        <p className='text-xs mt-1 text-red-400 w-full text-left'>
                                            {confirmPasswordError}
                                        </p>
                                    }
                                    <div className='flex items-center justify-between pt-2'>
                                        <button type="submit" className='bg-[#005599] rounded text-white py-2 px-7'>Create</button>
                                    <div className='text-[#005599] text-sm'>
                                        <Link href='/login'>Return to Log In</Link></div>
                                    </div>
                                {/* <div className='text-left text-[#005599] text-sm mt-3'>Return to Log In</div> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    showError && 
                    <SweetAlert
                        custom
                        customIcon="/icon/error.svg"
                        title="Registration failed!"
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
                        title="OTP code is sent to mail Successfully!"
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
                    showInfo && 
                    <SweetAlert
                        custom
                        customIcon="/icon/info.svg"
                        title="Credentials Required"
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
            </Layout>
        </>
    )
}