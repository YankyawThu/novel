import styles from "@/styles/Comic.module.css";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Image from 'next/image'
import {useTranslations} from 'next-intl';
import { useRouter } from 'next/router'
import ImageComponent from '@/components/ImageComponent';
import helper from '@/utils/helper'
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function Ranking(props){
    const { locale } = useRouter()
    const t = useTranslations("Default");

    const [value, setValue] = useState('1');
    const [isMobile, setIsMobile] = useState(false);
    const [firstWeeklyComic, setFirstWeeklyComic] = useState(null)
    const [firstMonthlyComic, setFirstMonthlyComic] = useState(null)
    const [weeklyData, setWeeklyData] = useState([])
    const [monthlyData, setMonthlyData] = useState([])

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

    useEffect(() => {
        setFirstWeeklyComic(props.firstWeeklyComic)
        setFirstMonthlyComic(props.firstMonthlyComic)

        if(isMobile){
            if(props.weeklyComics.length > 2){
                setWeeklyData(props.weeklyComics.slice(0, 2))
            } else {
                setWeeklyData(props.weeklyComics)
            }
            if(props.monthlyComics.length > 2){
                setMonthlyData(props.monthlyComics.slice(0, 2))
            } else {
                setMonthlyData(props.monthlyComics)
            }
        } else {
            setWeeklyData(props.weeklyComics)
            setMonthlyData(props.monthlyComics)
        }

    },[isMobile, props.firstWeeklyComic, props.firstMonthlyComic, props.weeklyComics, props.monthlyComics])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getGenreName = (genres) => {
        if(genres && genres.length > 0){
            let name = '';
            genres.map((item, index) => {
                name += index > 0 ? ", " + item[`name_${locale}`] : item[`name_${locale}`]
            })
            return name;
        } else {
            return '';
        }
    }

    const theme = createTheme({
		components: {
			MuiButtonBase: {
				styleOverrides: {
					root: {
						padding: '20px 0px'
					},
				},
			},
		},
	});

    return (
        <div className="">
            <p className={styles.comicHeader+' text-[14px] md:text-[22px]'}>
                {t('comics-ranking')}
            </p>
            <div className='bg-[#F1FAFB] mt-2 md:mt-4'>
                <Box sx={{ width: '100%'}} className="">
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <ThemeProvider theme={theme}>
                                <Tabs value={value} onChange={handleChange} centered variant="fullWidth" aria-label="full width tabs">
                                    <Tab 
                                        label={t('weekly')} 
                                        value='1' id='full-width-tab-1' 
                                        aria-controls='full-width-tabpanel-1'
                                    />
                                    <Tab 
                                        label={t('monthly')} 
                                        value='2' 
                                        id='full-width-tab-2' 
                                        aria-controls='full-width-tabpanel-2'
                                    />
                                </Tabs>
                            </ThemeProvider>
                        </Box>

                        <TabPanel value='1'>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 relative">
                                    <ImageComponent
                                        src={firstWeeklyComic?.coverImage}
                                        alt="rank1"
                                        className='w-[80px] h-[120px] md:w-[100px] md:h-[140px] rounded-md'
                                    />
                                    <div className="absolute w-full top-0 left-0">
                                        <Image src="/img/one.png" alt="rank1" width={24} height={24} className={styles.one} />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <h1 className={styles.bookTitle + ' text-[14px] md:text-[15px]'}>{firstWeeklyComic?.title}</h1>
                                    <h3 className={styles.bookCategory + ' tracking-wider'}>
                                        { getGenreName(firstWeeklyComic?.genres) }
                                    </h3>
                                    <p 
                                        className={styles.bookDescription}
                                    >
                                        {firstWeeklyComic?.description}
                                    </p>
                                    <p className={styles.updateEpisode}>
                                        {t('chapter-update')}: <span className={styles.episodeName}>{firstWeeklyComic?.chapter}</span>
                                    </p>
                                </div>
                            </div>

                            {
                                weeklyData?.map((weekly,index) =>{
                                
                                    return(
                                        <div key={weekly.comicId}>
                                            <hr className={styles.breakLine}/>
                                            <div className="grid grid-cols-12 ">
                                                <div className="col-span-4">
                                                    <h2 className={styles.rankingItemTitle+ ' truncate'}>
                                                        <span className={` ${ ((index+2) == 2 || (index+2) == 3) ? 'text-[#005599] font-bold' : 'text-[#999999] font-bold' } `}> {(index+2)} </span>
                                                    {weekly?.title}</h2>
                                                </div>
                                                <div className="col-span-8 ml-4">
                                                    <p className={styles.updateEpisode}>
                                                    {t('chapter-update')}: <span className={styles.episodeName}>{weekly?.chapter} </span>
                                                    </p>
                                                </div>
                                                
                                            </div>
                                            
                                        </div>
                                        
                                    )
                                })
                            }

                        </TabPanel>
                        <TabPanel value='2'>
                        
                            <div className="grid grid-cols-3 gap-4">
                                
                                <div className="col-span-1 relative">
                                    <ImageComponent
                                        src={firstMonthlyComic?.coverImage}
                                        alt="rank1"
                                        className='w-[80px] h-[120px] md:w-[100px] md:h-[140px] rounded-md'
                                    />
                                    <div className="absolute w-full top-0 left-0">
                                        <Image src="/img/one.png" alt="rank1" width={24} height={24} className={styles.one} />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <h1 className={styles.bookTitle}>{firstMonthlyComic?.title}</h1>
                                    <h3 className={styles.bookCategory+ ' tracking-wider'}>
                                        {getGenreName(firstMonthlyComic?.genres)}
                                    </h3>
                                    <p 
                                        className={styles.bookDescription}
                                    >
                                        {firstMonthlyComic?.description}
                                    </p>
                                    <p className={styles.updateEpisode}>
                                        {t('chapter-update')}: <span className={styles.episodeName}>{firstMonthlyComic?.chapter} </span>
                                    </p>
                                </div>
                            </div>

                            {
                                monthlyData?.map((monthly,index) => {
                                    return(
                                        <div key={monthly.comicId}>
                                            <hr className={styles.breakLine}/>
                                            <div className="grid grid-cols-12 ">
                                                <div className="col-span-4">
                                                    <h2 className={styles.rankingItemTitle+ ' truncate'} > <span className={` ${ ((index+2) == 2 || (index+2) == 3) ? 'text-[#005599] font-bold' : 'text-[#999999] font-bold' } `}> {(index+2)} </span> {monthly?.title}</h2>
                                                </div>
                                                <div className="col-span-8 ml-4">
                                                    <p className={styles.updateEpisode}>
                                                        {t('chapter-update')}: <span className={styles.episodeName}>{monthly?.chapter}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    )
}