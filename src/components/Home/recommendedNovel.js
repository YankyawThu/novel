import styles from '@/styles/Home.module.css';
import {useTranslations} from 'next-intl';

export default function RecommendedNovel(){
    const t = useTranslations("Default");
    
    const recommand_one = '/img/recommand-one.png';
    const recommand_two = '/img/recommand-two.png';
    const recommand_three = '/img/recommand-three.png';
    const recommand_four = '/img/recommand-four.png';
    const recommand_five = '/img/recommand-five.png';

    return (
        <>
            <div className="">
                <h1 className={styles.header}>{ t('recommended-editors') }</h1>
            </div>

            <hr className={styles.recommandBreakLine}/>
            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="col-span-1">
                    <img src={recommand_one} alt="recommand" className={'w-[100px] h-[130px] md:w-[100px] md:h-[130px] rounded-md'} />
                </div>
                <div className="col-span-2">
                    <h1 className={styles.recommandBookHeader}>Birds Goona be Happy</h1>
                    <p className={styles.recommandDesc}>
                        Lorem ipsum dolor  s sit amet consectetur. Est cras dui etiam id cras. Nisi odio nulla urna id.
                        Lorem ipsum dolor  s sit amet consectetur.
                        </p>
                    <p className={styles.recommandUpdate}>Update: <span className={styles.recommandUpdateEpisode}>Episode 40 Night Rain</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="col-span-1">
                    <img src={recommand_two} alt="recommand" className={'w-[100px] h-[130px] rounded-md'} />
                </div>
                <div className="col-span-2">
                    <h1 className={styles.recommandBookHeader}>Birds Goona be Happy</h1>
                    <p className={styles.recommandDesc}>
                        Lorem ipsum dolor  s sit amet consectetur. Est cras dui etiam id cras. Nisi odio nulla urna id.
                        Lorem ipsum dolor  s sit amet consectetur.
                        </p>
                    <p className={styles.recommandUpdate}>Update: <span className={styles.recommandUpdateEpisode}>Episode 40 Night Rain</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="col-span-1">
                    <img src={recommand_three} alt="recommand" className={'w-[100px] h-[130px] rounded-md'} />
                </div>
                <div className="col-span-2">
                    <h1 className={styles.recommandBookHeader}>Birds Goona be Happy</h1>
                    <p className={styles.recommandDesc}>
                        Lorem ipsum dolor  s sit amet consectetur. Est cras dui etiam id cras. Nisi odio nulla urna id.
                        Lorem ipsum dolor  s sit amet consectetur.
                        </p>
                    <p className={styles.recommandUpdate}>Update: <span className={styles.recommandUpdateEpisode}>Episode 40 Night Rain</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="col-span-1">
                    <img src={recommand_four} alt="recommand" className={'w-[100px] h-[130px] md:w-[100px] md:h-[130px]'} />
                </div>
                <div className="col-span-2">
                    <h1 className={styles.recommandBookHeader}>Birds Goona be Happy</h1>
                    <p className={styles.recommandDesc}>
                        Lorem ipsum dolor  s sit amet consectetur. Est cras dui etiam id cras. Nisi odio nulla urna id.
                        Lorem ipsum dolor  s sit amet consectetur.
                        </p>
                    <p className={styles.recommandUpdate}>Update: <span className={styles.recommandUpdateEpisode}>Episode 40 Night Rain</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="col-span-1">
                    <img src={recommand_five} alt="recommand" className={'w-[100px] h-[130px] rounded-md'} />
                </div>
                <div className="col-span-2">
                    <h1 className={styles.recommandBookHeader}>Birds Goona be Happy</h1>
                    <p className={styles.recommandDesc}>
                        Lorem ipsum dolor  s sit amet consectetur. Est cras dui etiam id cras. Nisi odio nulla urna id.
                        Lorem ipsum dolor  s sit amet consectetur.
                        </p>
                    <p className={styles.recommandUpdate}>Update: <span className={styles.recommandUpdateEpisode}>Episode 40 Night Rain</span></p>
                </div>
            </div>
            
        </>
    )
}