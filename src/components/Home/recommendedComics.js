import styles from '@/styles/Home.module.css';
import Router from "next/router";
import {useTranslations} from 'next-intl';
import ImageComponent from '@/components/ImageComponent';

export default function RecommendedComic(props){
    const t = useTranslations("Default");

    return (
        <>
            <div className="">
                <h1 className={styles.header}>
                    { t('recommended-editors') }
                </h1>
            </div>
            <hr className={styles.recommandBreakLine}/>
            {
                props.recommendComics?.map((recommend) => {
                    return (
                        <div 
                            className="flex mt-5 w-full cursor-pointer"
                            key={recommend.id}
                            onClick={() => 
                                Router.push({
                                    pathname: '/comics/[slug]',
                                    query: { slug: recommend?.slug },
                                })
                            }
                        >
                            <div className='w-[100px] h-[130px] md:w-[100px] md:h-[130px]'>
                                <ImageComponent 
                                    src={recommend?.coverImage}
                                    alt="recommand"
                                    spinWidth='40'
                                    spinHeight='40'
                                    className={'rounded-md '+styles.thumbnailImage}
                                />
                            </div>
                            
                            
                            <div className="ml-4">
                                <h1 className={styles.recommandBookHeader}>{recommend?.title}</h1>
                                <p
                                    className={styles.recommandDesc}
                                >
                                    {recommend?.description}
                                </p>
                                <p className={styles.recommandUpdate}>
                                    {t('chapter-update')}: <span className={styles.recommandUpdateEpisode}>{recommend?.chapter}</span>
                                </p>
                            </div>
                        </div>
                    )
                })
            }
            
        </>
    )
}