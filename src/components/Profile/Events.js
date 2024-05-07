import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from 'next/router'
import eventJson from '@/dummy/event_users.json'
import ImageComponent from "../ImageComponent";
import { useState, useEffect } from "react";
import dateformat from 'dateformat';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Api from "@/services/api";
import helper from '@/utils/helper';
import { useSession, signOut } from "next-auth/react";

export default function Events(props){
    const t = useTranslations("Default");
    const { locale } = useRouter()
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const {data:session} = useSession();
    const [disable, setDisable] = useState(false);
    const [leaderboards, setLeaderboards] = useState([]);
    const [myrank, setMyrank] = useState(null);
    const [task, setTask] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const userFakeImage = '/icon/user.svg';

    let taskStyle = "bg-[#005599] px-3 py-2 text-white rounded-full md:rounded-xl flex items-center justify-center gap-3";
    let doneTaskStyle = "bg-[#999999] px-3 py-2 text-white rounded-full md:rounded-xl flex items-center justify-center gap-3";

    useEffect(() => {
        if(session?.accessToken){
            fetchLeaderboards()
            fetchEvents()
        }
    },[session?.accessToken])

    const fetchLeaderboards = async () => {
        try {
            let result = await Api.puller( session?.accessToken,'/leaderboards', {
                c:9
            });
            const response = JSON.parse(helper.decrypt(result.data.data))
            if(response){
                setLeaderboards(response?.leaderboardList);
                setMyrank(response?.myRank);
            }
        } catch (e) {
            if(e?.response?.data?.status === 40101){
                signOut({callbackUrl: '/login'})
            }
        }
        
    }

    const fetchEvents = async () => {
        try {
            let result = await Api.puller(session?.accessToken,'/event-tasks', {
                c:9
            });
            const response = JSON.parse(helper.decrypt(result.data.data))
            if (response) {
                setTask(response)
            }
        } catch(e) {
            if(e?.response?.data?.status === 40101){
                signOut({callbackUrl: '/login'})
            }
        }
    } 
    const getReward = async (task) => {
        if(session?.accessToken){
            if (task.type == 'share') {
                router.push({
                    pathname: '/comics'
                })
            }
            else if (task.type == 'invite') {
                let url = `${window.location.origin}/register?r=${props.user?.referCode}`;
                navigator.clipboard.writeText(url)
                alert('Invite link is copied successfully!')
            } else if (task.type == 'checkin') {                
                checkinReward(task)

            } else {
                router.push({
                    pathname: '/comics'
                })
            }
        } else {
            signOut({callbackUrl: '/login'})
        }
    }

    const checkinReward = async (task) => {
        try {
            const res = await Api.poster( session?.accessToken,`/daily-checkin-reward`, {
                c:9,
                day: task.day,
                value: task.diamond
            });
            fetchLeaderboards()
            fetchEvents();
            // setDisable(true);
            
        } catch (e){
            if(e?.response?.data?.status === 40101){
                signOut({callbackUrl: '/login'})
            }
        }
    }


    return (
        <>
            <div className='w-full min-h-full bg-[#F1FAFB]  border rounded-3xl relative'>
                <div className='rounded-t-3xl bg-[#005599] w-full px-5 lg:px-10 py-3 lg:py-4 text-white'>
                    <div className="flex items-center">
                        <p className="text-[14px] md:text-lg font-bold tracking-wider">{t('events')}</p>
                        <p className="text-[10px] md:text-[16px] text-[#FCD434] ml-2 md:ml-4 flex-1">
                            ( { dateformat(props.user?.event?.startDate, "dd-mm-yyyy") } - {dateformat(props.user?.event?.endDate, "dd-mm-yyyy")} )
                        </p>
                        <button onClick={() => handleOpen()} className="flex items-center">
                            <ImageComponent src="/icon/modal.svg" className='w-[20px] h-[20px] md:w-[30px] md:h-[30px]' alt="modal" />
                            <p className="text-[12px] md:text-[14px] font-normal ml-2">
                                {t('rules-regulations')}
                            </p>
                        </button>
                    </div>
                </div>
                <div
                    className='w-full py-3 px-5 xl:px-10 relative'
                >
                    <div className="mb-10">
                        <div className="h-[400px] md:h-[550px] border-b-0 border rounded-t-2xl relative">
                            <table className="w-full">
                                <thead className="w-full">
                                    <tr className="w-full">
                                        <th className="py-2 px-3 md:px-5 md:py-3"></th>
                                        <th className="py-2 px-3 md:px-5 md:py-3"></th>
                                        <th className="text-md md:text-lg text-[#005599] py-2 px-3 md:px-5 md:py-3">{t('name')}</th>
                                        <th className="text-md md:text-lg text-[#005599] py-2 px-3 md:px-5 md:py-3">{t('email')}</th>
                                        <th className="text-md text-right md:text-lg text-[#005599] py-2 px-3 md:px-5 md:py-3">{t('achievers')}</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="w-full h-[350px] md:h-[500px] overflow-y-auto">
                                {
                                    leaderboards && leaderboards.length > 0 ?
                                        <table className="w-full">
                                            <tbody className="w-full">
                                                {
                                                    leaderboards && leaderboards.length > 0 && leaderboards.map((user, index) => (

                                                        <tr className={` ${index == 0 && 'bg-[#9DE4F5] '} w-full`} key={index}>
                                                            <td className="py-2 px-3 md:px-5 md:py-3">{index + 1}</td>

                                                            <td className="py-2 px-3 md:px-5 md:py-3">
                                                                <div className="flex flex-col items-center">
                                                                    {index === 0 && <ImageComponent src={"/icon/top.svg"} className="top-10 z-20" />}
                                                                    <ImageComponent src={user?.readerImage ?? userFakeImage} className="w-[40px] h-[40px]  rounded-full" />
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-3 md:px-5 md:py-3">{user?.readerName}</td>
                                                            <td className="py-2 px-3 md:px-5 md:py-3">{ user?.readerGmail ? helper.hideGmail(user?.readerGmail) : '-' }</td>
                                                            <td className="py-2 px-3 md:px-5 text-right md:py-3"><div className="flex w-full items-center justify-center gap-1 md:gap-3 "><ImageComponent src="/icon/point.svg" className="w-[10px] h-[10px] md:h-[20px] md:w-[20px]" alt={"point"} /><p className="text-[12px]  md:text-sm">{user.diamond}</p></div></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        <div className="w-full flex flex-col justify-center items-center">
                                            <ImageComponent src='/img/nodata.svg' className="rounded-full" />
                                        </div>
                                }
                            </div>
                            <div className="absolute w-full -bottom-4 z-40 rounded-b-2xl">
                                <table className="w-full rounded-b-2xl">
                                    <tbody>
                                        <tr className="bg-[#005599] text-white rounded-b-2xl">
                                            <td className="py-2 px-3 md:px-5 md:py-3 rounded-bl-2xl">{myrank?.rank ? myrank?.rank : '--'}</td>
                                            <td className="py-2 px-3 md:px-5 md:py-3">
                                                <ImageComponent src={props?.user?.profile} className="rounded-full w-[40px] h-[40px]" />
                                            </td>
                                            <td className="py-2 px-3 md:px-5 md:py-3 text-left">{myrank?.data?.readerName ?? props.user?.name}</td>
                                            <td className="py-2 px-3 md:px-5 md:py-3 text-left">{myrank?.data?.readerGmail ?? props.user?.email}</td>
                                            <td className="py-2 px-3 md:px-5 md:py-3 text-right rounded-br-2xl">
                                                <div className="flex w-full items-center justify-center gap-1 md:gap-3 ">
                                                    <ImageComponent src="/icon/point.svg" className="w-[10px] h-[10px] md:h-[20px] md:w-[20px]" alt={"point"} />
                                                    <p className="text-[12px]  md:text-sm">{myrank?.data?.diamond ?? 0}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </div>

                    <div className="flex flex-col gap-2 bg-[#B5E4EF] rounded-xl mt-4">

                        {
                            task && task.length > 0 && task.map((item, index) => (
                            <div 
                                className="flex justify-between items-center border-b-2 border-[#DAF2F7] px-3 py-2 md:px-5 md:py-3"
                                key={index}
                            >
                                    <p>{item.task}  </p>
                                    <p>{item?.type == 'invite' ? item?.invitedFriend :''}</p>
                                    <button
                                        onClick={() => { getReward(item) }}
                                        className={(item && item.isDone == true) ? doneTaskStyle : taskStyle}
                                        disabled={item?.isDone ? true : false}
                                    >
                                    Claim  <Image src="/icon/point.svg" width={20} height={20} alt={"point"} />{item.diamond}
                                </button>
                            </div>
                          ))
                        }                       
                        
                        
                    </div>

                </div>
            </div>

            {
                open &&
                <Dialog 
                    open={open} 
                    onClose={handleClose}
                    className='w-full'
                >
                    <DialogContent
                        className='md:w-[600px] md:h-[600px]'
                    >
                        <div className='px-3 md:px-5 w-full'>
                            <>
                                <h3 className='text-lg font-bold text-center'>
                                    နှစ်ကူးအတာသင်္ကြန် ဆုလက်ဆောင်
                                </h3><br/>
                                <p>သင်္ကြန်ပွဲတော်ကိုအတူကြိုဆိုဖို့ abcbookmm.com က user များကို အောက်ပါအစီအစဥ်တွင်ပါဝင်ဖို့ဖိတ်ခေါ်အပ်ပါတယ်။ ရုပ်ပြကောင်းများကိုဖတ်ရှူ့ရင်းနဲ့ ဆုများကိုမြန်မြန်ရယူသွားလိုက်ပါ!</p><br/>
                                <p>ဖတ်ရှူ့သူများအနေနှင့် အောက်ဖော်ပြသည့် task များကိုပြုလုပ်ရုံနှင့် စိန်တုံးများရယူနိုင်ပါသည်။ အဆင့်ပေးဇယားတွင် အဆင့်များကို စိန်တုံးနှင့်စီပေးပြီး၊ အဆင့် ၁ - အဆင့် ၁၀ ထိ လက်ဆောင်များရယူသွားနိုင်ပါမည်။</p><br/>
                                <p>Task 1. Invite - အကောင့်ဖွင့်ပြီးက userများက ကိုယ်ပိုင် link ဖြင့် အခြား user များကိုအောင်မြင်စွာဖိတ်ခေါ်နိုင်ပြီး၊ ဖိတ်ခေါ်ခံရသည့် user က အကောင့်ဖွင့်ပြီး login ဝင်ပါက၊ ဖိတ်ခေါ်သူသည် စိန်တုံးကိုရရှိနိုင်မည်ဖြစ်သည်။ (Inviteလိုက်သည့်အရေအတွက် n*စိန်တုံး)</p>
                                <p>Task 2. Check in - အကောင့်ဖွင့်ပြီး user များက အစီအစဥ်ကျင်းပသည့်ရက်အတောအတွင်းတွင် နေ့စဥ် check in ပြုလုပ်ခြင်းဖြင့် စိန်တုံးကိုရယူနိုင်မည်ဖြစ်သည်။(တစ်ရက်ကိုတစ်ကြိမ်သာ)</p>
                                <p>Task 3. Share comic - အကောင့်ဖွင့်ပြီး user များက ဖတ်ရှူ့နေသော comic ကို လူမှုကွန်ရက်များ(Facebook / Viber / Telegram )ပေါ်သို့ အောင်မြင်စွာ share ပေးနိုင်ပါက စိန်တုံးကိုရယူနိုင်မည်ဖြစ်သည်။(တစ်ရက်ကိုတစ်ကြိမ်သာ)</p>
                                <p>Task 4. Read 15 mins - အကောင့်ဖွင့်ပြီး user များက abcbookmm.com ပေါ်တွင် 15 mins ဖတ်ရှူ့မှုပြုလုပ်ပါက စိန်တုံးများကိုရယူနိုင်မည်ဖြစ်သည်။(တစ်ရက်ကိုတစ်ကြိမ်သာ)</p>
                                <p>Task 5. Read 30 mins - အကောင့်ဖွင့်ပြီး user များက abcbookmm.com ပေါ်တွင် 30 mins ဖတ်ရှူ့မှုပြုလုပ်ပါက စိန်တုံးများကိုရယူနိုင်မည်ဖြစ်သည်။(တစ်ရက်ကိုတစ်ကြိမ်သာ)</p><br/>
                                <p className="mt-4 text-lg font-semibold">အစီအစဥ်စည်းမျဥ်း-</p>
                                <p>1. ရရှိလာသည့် စိန်တုံးများကို အဆင့်ပေးဇယားတွင် အဆင့်သတ်မှတ်ပေးရန်အတွက်သာအသုံးပြုပါမည်။</p>
                                <p>2. အစီအစဥ်ပြီးဆုံးပါက အဆင့်ပေးဇယားပေါ်ရှိ အဆင့် ၁- အဆင့် ၁၀ user များသာ ဆုလက်ဆောင်ရရှိနိုင်ပါမည်။</p>
                                <p>3. ဆုလက်ဆောင်များကို deli အပ်ပေးရာ၌ deli ခကို လက်ခံသူဖက်ကရှင်းပေးရပါမည်။</p>
                                <p>4. ၎င်းအကြိမ်တွင်ရရှိသည့် စိတ်တုံးများသည် အစီအစဥ်ပြီးဆုံးပါက 0 ဖြစ်သွားပါမည်။</p>
                                <p>5. အစီအစဥ်ကျင်းပချိန် - 10.04.2023 - 25.04.2023 </p>
                                <p>6. အစီအစဥ်ပြီးဆုံးပါက user email နှင့်ဆက်သွယ်ပြီး ဆုများကိုပေးဆောင်သွားပါမည်။</p><br/>
                                <p>အဆင့် ၁ - Edward Newgate （White beard） figures （high - 27cm ) </p>
                                <p>အဆင့် ၂ - Roronoa Zoro figures （high - 20cm) </p>
                                <p>အဆင့် ၃ - Pokémon figures set (high - 8cm/ခု * 4ခု + show box )</p>
                                <p>အဆင့် ၄ - Gear 5 lufy figures （high - 14.5cm)</p>
                                <p>အဆင့် ၅ - ဖုန်းဘေလ် 20000 ကျပ်</p>
                                <p>အဆင့် ၆ - ဖုန်းဘေလ် 10000 ကျပ်</p>
                                <p>အဆင့် ၇ - ဖုန်းဘေလ် 5000ကျပ်</p>
                                <p>အဆင့် ၈ - ဖုန်းဘေလ် 5000 ကျပ်</p>
                                <p>အဆင့် ၉ - ဖုန်းဘေလ် 5000 ကျပ်</p>
                                <p>အဆင့် ၁၀ - ဖုန်းဘေလ် 5000 ကျပ်</p><br/>
                                <p>Note : အငြင်းပွားဖွယ်ရာတစ်ခုခုဖြစ်ပေါ်လာပါက abc မှ ဆုံးဖြတ်ပေးသည်သာ အကြုံးဝင်ပါမည်ဖြစ်သည်။</p>
                            </>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            className='bg-gray-300 rounded-lg px-3 py-2'
                            onClick={() => handleClose()}
                        >
                            {t('close')}
                        </button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )

}