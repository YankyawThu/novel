import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Api from "@/services/api";
import helper from '@/utils/helper'
import { useSession } from "next-auth/react"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AvatarEditor from 'react-avatar-editor';
import SweetAlert from 'react-bootstrap-sweetalert';
import ImageComponent from '@/components/ImageComponent';
import dateformat from 'dateformat';

export default function Profile(props) {
    const t = useTranslations("Default");
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        gender: '',
        profile: '',
        imageUrl: ''
    });

    const [isEdit, setEdit] = useState(false);
    const [user, setUser] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [editor, setEditor] = useState(null);
    const [fileData, setFileData] = useState({
        file: '',
        image: ''
    });
    const editorRef = useRef(null);
    const uploadRef = useRef(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [info, setInfo] = useState('')

    useEffect(() => {
        setUser(props.user)
        setFormData(prevFormData => ({
            ...prevFormData,
            username: props.user.username ? props.user.username : '',
            name: props.user.name ? props.user.name : '',
            email: props.user.email ? props.user.email : '',
            gender: props.user.gender ? props.user.gender : 'male',
            profile: props.user.profile ? props.user.profile : '',
            imageUrl: props.user.profile ? props.user.profile : ''
        }));
    }, [props.user]);

    const handleSubmit = async () => {
        try {
            const result = await Api.filePoster(session.accessToken, '/user/profile/update', createPlayload());
            if(result?.data?.error?.messages){
                setInfo(result?.data?.error?.messages)
                setShowInfo(true)
            }

            if (result?.data?.data) {
                const res = JSON.parse(helper.decrypt(result?.data?.data))
                if (res) {
                    props.updateUserData(res)
                    setShowSuccess(true)
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseSuccess = () => {
        setShowSuccess(false)
        setEdit(false)
    };

    const handleCloseInfo = () => {
		setInfo("");
		setShowInfo(false)
	};

    const createPlayload = () => {
        let payload = new FormData();
        payload.append('c', 9)
        payload.append('name', formData.name)
        payload.append('email', formData.email)
        payload.append('gender', formData.gender)
        if (formData.profile && props.user.profile != formData.profile) {
            payload.append('profile', formData.profile)
        }
        return payload
    }

    const showFile = useCallback(() => {
        uploadRef.current?.click();
    }, []);

    const processFile = useCallback(
        (event) => {
            const profileFile = event.target.files[0];
            const imageUrl = URL.createObjectURL(profileFile);

            setFileData(pre => ({
                ...pre,
                file: profileFile,
                image: imageUrl
            }));

            setOpenPopup(true);
        },
        [setFormData, setOpenPopup]
    );

    const removeFile = useCallback(() => {
        setFileData(prevFormData => ({
            ...prevFormData,
            file: '',
            image: ''
        }));
        setFormData(pre => ({
            ...pre,
            profile: '',
            imageUrl: ''
        }));
        uploadRef.current.value = '';
    }, [setFormData]);

    const changeName = (value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            name: value
        }));
    }

    const changeEmail = (value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            email: value
        }));
    }

    const changeGender = (value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            gender: value
        }));
    }

    const handleClose = () => {
        setOpenPopup(false);
        setFileData(prevFormData => ({
            ...prevFormData,
            file: '',
            image: ''
        }));
        uploadRef.current.value = '';
    };

    const saveImage = () => {
        if (editor) {
            let canvas = editorRef.current.getImage();
            let url = canvas.toDataURL();
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrl: url
            }));

            canvas.toBlob(function (blob) {
                let profileFile = new File([blob], 'avater.png', { type: 'image/png' });
                setFormData(prevFormData => ({
                    ...prevFormData,
                    profile: profileFile
                }));
            });

        }
        uploadRef.current.value = '';
        setOpenPopup(false);
    };

    return (
        <>
            <div className='w-full h-full bg-[#F1FAFB] border rounded-3xl'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white text-lg font-bold tracking-wider'>
                    {t('profile')}
                </div>
                <div className='w-full py-3 px-5 xl:px-10'>
                    {
                        isEdit &&
                        <>
                            <div className='mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 w-full'>
                                <div className='col-span-1'>
                                    <p className='font-bold md:text-right md:mt-3'>{t('profile-picture')}</p>
                                </div>
                                <div className='col-span-1 md:col-span-3'>
                                    <div className='w-full flex px-4'>
                                        <div className='w-[110px] h-[110px] relative flex justify-center items-center rounded-full border border-[#005599]'>
                                            {
                                                formData?.imageUrl &&
                                                <>
                                                    <ImageComponent src={formData.imageUrl} className='w-[110px] h-[110px] rounded-full' spinWidth='40' spinHeight='40' />
                                                </>
                                            }
                                            {
                                                !formData?.imageUrl &&
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor" className="w-10 h-10"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            }
                                        </div>
                                        <div className='ml-4'>
                                            <button
                                                className='bg-[#005599] text-[12px] md:text-sm px-4 md:px-5 py-2 rounded-3xl text-white'
                                                onClick={showFile}
                                            >
                                                {t('upload-photo')}
                                            </button>
                                            <input
                                                type='file'
                                                className='hidden'
                                                ref={uploadRef}
                                                onChange={(e) => processFile(e)}
                                            />
                                            <p className='text-[13px] text-[#333333] mt-4'>
                                                Maximum size of 1MB.JPG,GIF, or PNG .
                                            </p>
                                            {
                                                fileData?.image &&
                                                <>
                                                    <button
                                                        className='bg-red-600 text-white mt-3 flex justify-center items-center px-2 text-xs py-1 shadow rounded-lg'
                                                        onClick={(e) => removeFile(e)}
                                                    >
                                                        Remove Photo
                                                    </button>
                                                </>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 w-full'>
                                <div className='col-span-1'>
                                    <p className='font-bold md:text-right md:mt-3'>{t('name')}</p>
                                </div>
                                <div className='col-span-1 md:col-span-3'>
                                    <input
                                        value={formData.name}
                                        className='md:ml-4 bg-white w-full md:w-3/4 text-sm tracking-wider px-3 lg:px-5 py-2 lg:py-3 rounded-lg border'
                                        onChange={(e) => changeName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 w-full'>
                                <div className='col-span-1'>
                                    <p className='font-bold md:text-right md:mt-3'>{t('email')}</p>
                                </div>
                                <div className='col-span-1 md:col-span-3'>
                                    <input
                                        value={formData.email}
                                        onChange={(e) => changeEmail(e.target.value)}
                                        className='md:ml-4 bg-white w-full md:w-3/4 text-sm tracking-wider px-3 lg:px-5 py-2 lg:py-3 rounded-lg border'
                                    />
                                </div>
                            </div>
                            <div className='mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 w-full'>
                                <div className='col-span-1'>
                                    <p className='font-bold md:text-right'>{t('gender')}</p>
                                </div>
                                <div className='col-span-1 md:col-span-3'>
                                    <div className='w-full flex items-center px-4'>
                                        <label htmlFor="male" className='flex items-center'>
                                            <input
                                                type='radio'
                                                name='gender'
                                                id='male'
                                                value="male"
                                                checked={formData.gender === "male"}
                                                onChange={(e) => changeGender(e.target.value)}
                                                className='mr-2 h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                            />
                                            {t('male')}
                                        </label>
                                        <label htmlFor="female" className='flex items-center ml-4'>
                                            <input
                                                type='radio'
                                                name='gender'
                                                id='female'
                                                value="female"
                                                checked={formData.gender === "female"}
                                                onChange={(e) => changeGender(e.target.value)}
                                                className='mr-2 h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                            />
                                            {t('female')}
                                        </label>
                                        <label htmlFor="others" className='flex items-center ml-4'>
                                            <input
                                                type='radio'
                                                name='gender'
                                                id='others'
                                                value='others'
                                                checked={formData.gender === "others"}
                                                onChange={(e) => changeGender(e.target.value)}
                                                className='mr-2 h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                            />
                                            {t('others')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10 flex items-center justify-center w-full'>
                                <button
                                    onClick={() => setEdit(false)}
                                    className='bg-[#999999] px-5 py-2 lg:px-7 md:py-3 rounded-3xl text-white text-sm'
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type='submit'
                                    onClick={handleSubmit}
                                    className='ml-4 bg-[#005599] px-5 py-2 lg:px-7 md:py-3 rounded-3xl text-white text-sm'
                                >
                                    {t('update')}
                                </button>
                            </div>
                        </>

                    }
                    {
                        !isEdit &&
                        <>
                            <div className='relative flex flex-col w-full justify-center items-center py-2'>
                                <div className='w-[104px] h-[104px] p-1 rounded-full border-2 border-[#005599] flex justify-center items-center'>
                                    {
                                        user?.profile &&
                                        <ImageComponent src={user?.profile} className='w-[100px] h-[100px] rounded-full' spinWidth='40' spinHeight='40' />
                                    }
                                    {
                                        !user?.profile &&
                                        <img src='/icon/user.svg' className='w-[60px] h-[60px]' />
                                    }
                                </div>
                                <p className='text-[20px] font-bold text-[#005599] mt-3'>
                                    {user?.name ? user?.name : 'Anonymous'}
                                </p>
                                <p className='mt-1 text-[#333333] text-[18px] tracking-wider'>
                                    {user?.username}
                                </p>
                                <div
                                    className='mt-3 w-full md:w-2/3 flex px-5 md:pl-10 md:pr-7 py-4 items-center'
                                    style={{ background: 'linear-gradient(90.17deg, #2BBDC5 0.12%, #4D6E96 99.86%)', borderRadius: '14px' }}
                                >
                                    <div className='text-white font-bold text-[26px] flex-1'>
                                        <p className='text-[12px] font-normal flex items-center'>
                                            {t('current-point')}
                                            <Link
                                                href='/point-history'
                                                className='ml-2 text-[#FCD434] flex items-center'
                                            >
                                                ( <img src='/icon/record.svg' alt='record' className='ml-2 mr-2' />
                                                {t('history')} )
                                            </Link>
                                        </p>
                                        {helper.localeNumbering(user?.points, t)}
                                    </div>
                                    <Link
                                        className='ml-4 px-10 py-2 text-white font-semibold'
                                        style={{ background: 'linear-gradient(180deg, #FCD434 0%, #FCAC34 100%)', borderRadius: '16px' }}
                                        href='/topup'
                                    >
                                        {t('topup')}
                                    </Link>
                                </div>
                                <button
                                    className='absolute top-4 right-6'
                                    onClick={() => setEdit(true)}
                                >
                                    <img src='/icon/edit.svg' />
                                </button>
                            </div>
                            {
                                props.user?.event &&
                                <div className='w-full flex items-center justify-center'>
                                    <div className='w-full md:w-2/3 flex flex-col px-5 gap-2 md:pl-10 md:pr-7 py-4 relative'
                                        style={{ backgroundImage: `url(${props.user?.event?.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '14px' }}
                                    >
                                        <h3 className='text-white text-xl font-semibold' 
                                            style={{
                                                background: 'linear-gradient(95.16deg, #9FFCDB 7.26%, #FBD85D 42.82%, #DA97F1 77.9%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                textFillColor: 'transparent'
                                            }}
                                        >
                                            {props.user?.event?.name}
                                        </h3>
                                        <p className='text-white font-bold'>
                                            ( { dateformat(props.user?.event?.startDate, "dd-mm-yyyy") } - {dateformat(props.user?.event?.endDate, "dd-mm-yyyy")} )
                                        </p>
                                        <button 
                                            className='bg-[#05E3EE] w-fit rounded-full px-5 py-2 text-white font-semibold' 
                                            onClick={() => props.updateCurrentTab('events')} 
                                        >
                                            Click here
                                        </button>
                                    </div>
                                </div>
                            }
                            
                            <div className='mt-5 w-full border rounded-lg h-full flex flex-col justify-center items-center px-3 lg:px-5 lg:pr-20 py-2 lg:py-8'>
                                <div className='w-full flex items-center'>
                                    <p className='font-bold w-1/6 text-right'>
                                        {t('name')}
                                    </p>
                                    <input
                                        value={user?.name ? user?.name : ''}
                                        className='ml-4 bg-transparent w-5/6 text-sm tracking-wider px-3 lg:px-5 py-2 lg:py-3 rounded-lg border'
                                        disabled
                                    />
                                </div>
                                <div className='w-full flex items-center mt-6'>
                                    <p className='font-bold w-1/6 text-right'>
                                        {t('email')}
                                    </p>
                                    <input
                                        value={user?.email ? user?.email : ''}
                                        className='ml-4 bg-transparent w-5/6 text-sm tracking-wider px-3 lg:px-5 py-2 lg:py-3 rounded-lg border'
                                        disabled
                                    />
                                </div>
                                <div className='w-full flex items-center mt-6'>
                                    <p className='font-bold w-1/6 text-right'>
                                        {t('gender')}
                                    </p>
                                    <input
                                        value={user?.gender ? user?.gender : ''}
                                        className='ml-4 bg-transparent w-5/6 text-sm tracking-wider px-3 lg:px-5 py-2 lg:py-3 rounded-lg border'
                                        disabled
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>

            {
                openPopup && fileData.image &&
                <Dialog
                    open={openPopup}
                    onClose={handleClose}
                    className='w-full'
                >
                    <DialogContent className='md:w-[500px] md:h-[500px]'>
                        <div className='w-full flex justify-center items-center'>
                            <AvatarEditor
                                ref={editorRef}
                                image={fileData.image}
                                width={250}
                                height={250}
                                border={50}
                                color={[102, 102, 102, 0.6]} // RGBA
                                scale={1}
                                borderRadius={125}
                                rotate={0}
                                onLoadSuccess={(editor) => setEditor(editor)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className='w-full flex justify-center'>
                            <button
                                onClick={handleClose}
                                className='bg-gray-400 text-sm px-3 py-2 rounded-md inline-flex justify-center items-center'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveImage}
                                className='bg-green-600 ml-4 text-white px-3 py-2 text-sm rounded-md inline-flex justify-center items-center'
                            >
                                Set Profile Picture
                            </button>
                        </div>
                    </DialogActions>
                </Dialog>
            }

            {
                showSuccess &&
                <SweetAlert
                    custom
                    customIcon="/icon/success.svg"
                    title="Successfully updated!"
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
                    title="Credentials Message"
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