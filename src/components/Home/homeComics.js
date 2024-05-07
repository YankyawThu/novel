import styles from '@/styles/Home.module.css';
import Books from '@/dummy/books.json';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Api from "@/services/api";
import { useTranslations } from 'next-intl';
import helper from '@/utils/helper'
import { useRouter } from 'next/router'
import Image from 'next/image';
import ImageComponent from '@/components/ImageComponent';
import { Rating } from '@mui/lab';

export default function HomeComics(props) {
    const t = useTranslations('Default');
    const { locale } = useRouter()

    const [genreBook, setGenreBook] = useState([]);
    const [genres, setGenres] = useState([]);
    const [currentGenreId, setCurrentGenre] = useState('all');

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(helper.isMobile(window.navigator.userAgent))
    }, [])

    useEffect(() => {
        setGenres(props.genreData)
        getBooks();
    }, [])

    async function handleClick(genre) {
        if (genre.name == 'all' || genre.name == 'All') {
            setCurrentGenre('all')
            await getBooks();
        } else {
            await getBookById(genre._id);
        }
    }

    async function getBooks() {
        const result = await Api.puller(null, `/home-comics`, { c: 9 })
        const searchComics = JSON.parse(helper.decrypt(result.data.data))
        setGenreBook(searchComics);
    }

    async function getBookById(id) {
        setCurrentGenre(id)
        const result = await Api.puller(null, `/home-comics`, { c: 9, genreId: id })
        const searchComics = JSON.parse(helper.decrypt(result.data.data))
        setGenreBook(searchComics);
    }

    const fullStarImg = '/img/comics/full-star.png';
    const blurStarImg = '/img/comics/blur-star.png';

    return (
        <>
            <div className="flex justify-between">
                <h1 className={styles.news}>{t('comics')}</h1>
                <Link href="/comics" className={styles.newsSeeAll + ' flex items-center'}>
                    {t('see-all')}
                    <Image src='/icon/arrow-left.svg' width={30} height={30} alt="rank1" className='pl-2' />
                </Link>
            </div>
            <hr className={styles.recommandBreakLine} />

            <div className="w-full flex items-center overflow-x-auto mt-0 md:mt-5">
                <button
                    className={styles.selectedCategory + `${currentGenreId === 'all' ? ' text-[#005599]' : ' text-[#333333]'}`}
                    onClick={() => handleClick({ _id: 'all', name: 'all' })}
                >
                    {t('all')}
                </button>
                {
                    genres?.map((genre) => {
                        if (genre) {
                            return (
                                <button
                                    className={styles.selectedCategory + `${genre._id === currentGenreId ? ' text-[#005599] ml-2' : ' text-[#333333] ml-2'}`}
                                    key={genre._id}
                                    onClick={() => handleClick(genre)}
                                >
                                    {locale === 'en' ? genre.name : genre.namemm}
                                </button>
                            )
                        }

                    })
                }
            </div>

            <br className={styles.breakLine} />

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {
                    genreBook?.map(book => {
                        return (
                            <div
                                className={'col-span-1'}
                                key={book.id}
                            >
                                <Link
                                    className="w-full"
                                    href={`/comics/${encodeURIComponent(book.slug)}`}
                                >
                                    <div className="">
                                        <div className='relative w-[150px] h-[200px] xl:w-[170px] xl:h-[250px]'>
                                            <ImageComponent
                                                src={book.coverImage}
                                                alt="book"
                                                spinWidth='40'
                                                spinHeight='40'
                                                className={styles.bookImage + ' w-[150px] h-[200px] xl:w-[170px] xl:h-[250px]'}
                                            />
                                            <div className={styles.imageFix + ' absolute bottom-0 flex justify-center items-center py-2 w-[150px] xl:w-[170px]'}>
                                                <p className={'flex text-xs items-center'}>
                                                    {
                                                        book.type == "free" ?
                                                            <>
                                                                <Image src='/img/comics/free.png' width='20' height='20' alt="book" className={styles.bookImage} />
                                                                <span className={styles.bookType + ' ml-2'}>
                                                                    {t('free')}
                                                                </span>
                                                            </>
                                                            :
                                                            <>
                                                                <Image src='/img/comics/point.png' alt="book" width='20' height='20' className={styles.bookImage} />
                                                                <span className={styles.bookType + ' ml-2'}>
                                                                    {t('points')}
                                                                </span>
                                                            </>
                                                    }

                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1">
                                        <p className={styles.bookAuthor}>{book.author}</p>
                                        <p className={styles.bookTitle + 'truncate'}>
                                            {book.title.length > 17 ? book.title.substring(0, 17) + " ..." : book.title}
                                        </p>
                                        <p className="flex">

                                            <Rating name="read-only" value={book.ratingPercent} readOnly precision={0.5} size='small'/>
                                        </p>
                                    </div>
                                </Link>
                                <br className={styles.breakLine} />
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}