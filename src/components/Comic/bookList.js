import styles from "@/styles/Category.module.css";

export default function BookList({postBook}){
    return (
        <>
            {
                postBook.map((book) => {
                    return (
                        <div className={'col-span-1'} key={book.id}>
                            <div className="w-full">
                                <div className="flex justify-center">
                                    <div className='relative w-[170px] h-[250px]'>
                                        <img src={book.img} alt="book" width={170} height={250} className={styles.bookImage} />
                                        <div className={styles.imageFix +' absolute bottom-0 flex justify-center items-center py-2 w-[170px] h-[250px]'}>
                                            <p className={'flex text-xs items-center'}>
                                                <img src="/img/comics/free.png" alt="book" className={styles.bookImage} />
                                                <span className={styles.bookType + ''}>Free</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-1">
                                    <p className={styles.bookAuthor}>{book.author}</p>
                                    <p className={styles.bookTitle}>{book.title}</p>
                                    <p className="flex">
                                        <img src="/img/comics/full-star.png" alt="book" className={styles.bookImage} />
                                        <img src="/img/comics/full-star.png" alt="book" className={styles.bookImage}/>
                                        <img src="/img/comics/full-star.png" alt="book" className={styles.bookImage} />
                                        <img src="/img/comics/full-star.png" alt="book" className={styles.bookImage}/>
                                        <img src="/img/comics/blur-star.png" alt="book" className={styles.bookImage}/>
                                    </p>
                                </div>
                            </div>
                            <br className={styles.breakLine}/>
                        </div>
                    )
                })
            }
        </>
    )
}