import styles from '@/styles/Home.module.css';
import Books from '@/dummy/books.json';
import {useTranslations} from 'next-intl';

export default function HomeNovel(){
    const t = useTranslations('Default');
    const {books} = Books;

    const arrow = '/img/arrow.png';
    const bookImg = '/img/comics/book.png';
    const freeImg = '/img/comics/free.png';
    const fullStarImg = '/img/comics/full-star.png';
    const blurStarImg = '/img/comics/blur-star.png';

    return (
        <>
            <div className="flex justify-between">
                <h1 className={styles.news}>{t('novels')}</h1>
                <p className={styles.newsSeeAll}>
                    {t('see-all')}
                    <img src={arrow} alt="rank1" className={'w-[100] h-[100] inline-flex pl-2'} />
                </p>
            </div>
            <hr className={styles.recommandBreakLine}/>

            <div className="w-full mt-2 md:mt-5 flex items-center overflow-x-auto">
                <button className={styles.selectedCategory}>All</button>
                <button className={styles.categoryItem}>City</button>
                <button className={styles.categoryItem}>Fantasy</button>
                <button className={styles.categoryItem}>Ghost</button>
                <button className={styles.categoryItem}>Love</button>
                <button className={styles.categoryItem}>Inferance</button>
                <button className={styles.categoryItem}>Comedy</button>
            </div>
            <br className={styles.breakLine}/>
            <br className={styles.breakLine}/>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {
                books.map(book =>{
                    return (
                        <div className={'col-span-1'} key={book.id}>
                        <div className="w-full">
                            <div className="">
                                <div className='relative w-[150px] h-[200px] xl:w-[170px] xl:h-[250px]'>
                                    <img src={book.img} alt="book" className={styles.bookImage + ' w-[150px] h-[200px] xl:w-[170px] xl:h-[250px]'} />
                                    <div className={styles.imageFix +' absolute bottom-0 flex justify-center items-center py-2 w-[150px] h-[200px] xl:w-[170px] xl:h-[250px]'}>
                                        <p className={'flex text-xs items-center'}>
                                            <img src={freeImg} alt="book" className={styles.bookImage} />
                                            <span className={styles.bookType + ''}>Free</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-1">
                                <p className={styles.bookAuthor}>{book.author}</p>
                                <p className={styles.bookTitle}>{book.title}</p>
                                <p className="flex">
                                    <img src={fullStarImg} alt="book" className={styles.bookImage} />
                                    <img src={fullStarImg} alt="book" className={styles.bookImage}/>
                                    <img src={fullStarImg} alt="book" className={styles.bookImage} />
                                    <img src={fullStarImg} alt="book" className={styles.bookImage}/>
                                    <img src={blurStarImg} alt="book" className={styles.bookImage}/>
                                </p>
                            </div>
                        </div>
                        <br className={styles.breakLine}/>
                    </div>
                    )
                })
            }
            </div>
        </>
    )
}