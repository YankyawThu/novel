import styles from '@/styles/Detail.module.css'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import ImageComponent from '@/components/ImageComponent';

export default function PopularComics(props){
    const router= useRouter();
    const t = useTranslations("Default");

    const recommand = '/img/recommand.png';

    const gotoComic = (comicSlug) => {
        router.push({
            pathname: '/comics/[slug]',
            query: { slug: comicSlug}
        })
    }

    return (
        <div className='bg-[#E5FAFF] py-[2rem] px-[1rem] rounded-sm mb-4 md:mb-0'>
            <div className="">
                <h1 className={styles.header}>
                    {t('popular-comics')}
                </h1>
            </div>

            {
                props.popularComics.map((comic) => {
                    return (
                        <div key={comic.id}>
                            <hr className={styles.breakLine}/>
                            <div className="grid grid-cols-3 gap-4 cursor-pointer" onClick={() => gotoComic(comic?.slug)}>
                                <div className="col-span-1">
                                    <div className='w-full h-full'>
                                        <ImageComponent src={comic?.coverImage} alt="recommand" className='w-[90px] h-[130px] md:w-[100px] md:h-[130px] rounded-md' />
                                    </div>
                                    
                                </div>
                                <div className="col-span-2">
                                    <h1 className={styles.recommandBookHeader}>{comic?.title}</h1>
                                    <p className={styles.recommandDesc}>
                                        {comic?.description}
                                    </p>
                                    <p className={styles.recommandUpdate}>
                                        {t('chapter-update')}: <span className={styles.recommandUpdateEpisode}>{comic?.chapter}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
           
        </div>
    )
}