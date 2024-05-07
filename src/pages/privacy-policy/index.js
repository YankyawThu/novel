import React, {useRef, useState} from 'react'
import Layout from '@/layouts/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useTranslations} from 'next-intl';
import Head from 'next/head'
import helper from '@/utils/helper'

export async function getServerSideProps(context) {
    return {
		props: {
			messages: {
				...require(`../../lang/${context.locale}.json`)
			},
		},
	};
}

export default function PrivacyPolicy() {
    const { locale } = useRouter()
	const router = useRouter()
    const t = useTranslations("Default");

    return (
        <>
			<Head>
				<title>Privacy Policy</title>
			</Head>
			<Layout>
                <div className='w-full pt-5 pb:5 md:pt-10 md:pb-20 container mx-auto px-5 md:px-0'>
                    <div className="tracking-wider text-xs">
						<Link href='/' className=''>{t('home')}</Link>
                        <span className='ml-2 text-blue-500 font-semibold'>/ &ensp; {t('privacy-policy')}</span>
					</div>

                    <div className='text-sm text-gray-600 mt-4 font-medium leading-7 tracking-wide'>
                        <p className='text-center text-xl font-bold text-gray-700'>Privacy Policy</p>

                        <p className='mt-4 text-right'>
                            Effective date: February 17, 2023 <br />
                            Release date: February 17, 2023<br />
                            Updated date: February 17, 2023
                        </p>

                        <p className='mt-4 text-lg font-semibold'>
                            1. User Personal Information Protection and Privacy Protection
                        </p>
                        <p>
                            1.1 Protection of users' personal information is a basic principle of Tamron Corporation. China Literature regards user information security and privacy protection as its "lifeline". We are committed to improving the transparency of information processing, enhancing your convenience in information management, and ensuring your information and communication security. Strictly abide by laws and regulations, and follow the following privacy protection principles to provide you with safer and more reliable services: <br />
                            (1) Safe and reliable: We do our best to prevent your information from being leaked, damaged, or lost through reasonable and effective information security technology and management processes;<br />
                            (2) Protect communication secrets: We strictly abide by laws and regulations, protect your communication secrets, and provide you with secure communication services;
                            (3) Reasonable and necessary: In order to provide you and other users with better services, we only collect necessary information; <br />
                            (4) Clear and transparent: We strive to use concise and easy-to-understand expressions to introduce the privacy policy to you, so that you can clearly understand our information processing methods;<br />
                            (5) Integrate privacy protection into product design: We integrate the concept of privacy protection into all aspects of product or service development by integrating multiple factors including laws, products, and design. <br /><br />
                            1.2 During the process of registering an account or using this service, you may need to fill in some necessary information (see the second point for details, the information we may collect). According to the special provisions of national or regional laws and regulations, you may need to fill in real identity information. If the real information you fill in is incomplete, you may be restricted in the process of using the service. Generally, we only retain your personal information for the shortest time necessary to fulfill our purposes. When our products or services cease to operate, we will notify you in the form of a notice or announcement, and delete or anonymize your personal information within a reasonable period of time;
                            Personal information storage and overdue processing methods: the personal information collected and generated during our operations in the Union of Myanmar is stored in the Union of Myanmar;<br />
                            Storage period: log information is no less than 6 months, transaction information* is no less than three years from the transaction completion date, and record backup is no less than 60 days, unless there is a mandatory retention requirement by law; after your personal information exceeds the retention period , we will delete or anonymize your personal information in accordance with applicable feedback requirements. <br /><br />
                            1.3 In general, you can browse and modify the information you submit at any time, but for the sake of security and identification (such as number appeal service), you may not be able to modify the initial registration information and other verification information provided during registration.<br /><br />
                            1.4 ABC Book mm attaches great importance to the protection of personal information of minors. According to relevant laws and regulations, if you are a minor under the age of 18, you should obtain the consent of your parent or legal guardian before using our services. If you are the guardian of a minor, when you have any questions about the personal information of the minor under your guardianship, please contact us through the contact information on the website.<br /><br />
                            1.5 Without your consent, Tamron will not disclose your personal information to any company, organization or individual other than Tamron, and guarantee that it will not disclose or disclose to third parties or provide user registration information and users' stored information when using network services. Non-public content and information on ABC book mm, servers or databases, with the following exceptions:<br />
                            (1) Obtain the explicit authorization of the user in advance;<br />
                            (2) According to relevant laws and regulations;<br />
                            (3) In accordance with the requirements of relevant government authorities and judicial authorities;<br />
                            (4) To safeguard the interests of the public;<br />
                            (5) Purposes that are reasonably necessary to implement relevant service agreements or to protect the personal and property safety or other legal rights of our customers, us or our affiliates, other users or employees.<br /><br />
                            1.6 Due to the use of third-party services or equipment by users, user information may be disclosed to third parties through other means. Users need to understand the relevant terms of third parties for user information protection, and China Literature shall not bear the risks arising therefrom. The above situations include: users use third-party applications on mobile devices; user information collected by third-party applications may be sent to third parties for processing.<br /><br />
                            1.7 You understand and agree: If you have activated this service through your QQ number or WeChat account, please refer to the "QQ Number Account" for the acquisition, use, retrieval of your QQ number, registration, login, and use of your WeChat account. "Rules" and "Tencent WeChat Terms of Use and Privacy Policy" Note: The link address may change, and the official information of QQ and WeChat shall prevail.
                        </p>
                        <p className='mt-4 text-lg font-semibold'>
                            2. [Information we may collect]
                        </p>
                        <p>
                            Based on the principles of legality, justification and necessity, we only collect information necessary to realize product functions. We may collect, store and use the following information about you. Agreeing to this agreement will be deemed to agree to our collection of your personal information and use it within the scope of the law and this agreement.<br />
                            2.1 We collect the following types of information:<br />
                            2.1.1 Information required for account services<br />
                            (1) Information you fill in when registering an account: mobile phone number*, email address*;<br />
                            (2) We may obtain the information disclosed to us by the third party when you log in with the account of the third-party partner, including: user name and avatar. For this part, please carefully read the user agreement or privacy policy of the third-party partner service;<br />
                            (3) The information you fill in when editing the profile: avatar, nickname;<br />
                            (4) Personal account information display: avatar, nickname, in-app virtual currency balance*, recharge record*, consumption record*;<br />
                            (5) Real-name authentication: You need to provide us with your corresponding identity information* through "real-name authentication": ID card*, passport* and other ID information*;<br />
                            (6) Account security: We need to collect some of your information to protect your account security and judge your account and transaction risks, including the following information: account login location*, login IP address*, login time, model, network type , device unique identifier* (IMEI, IMSI, device MAC address, AndroidID, OAID, MEID), screen resolution and size, system version number, product version number, transaction information*, real-name authentication information*, application list information; once When we detect that there is or is suspected to be an account security risk, we will use relevant information for security verification and risk elimination to ensure the security of the products and services we provide to you, so as to protect your rights and interests from infringement.<br /><br />
                            2.1.2 Information required for products or services<br />
                            (1) Text book and comic reading, listening function: In order to better provide you with novel reading services, improve reading experience, and optimize novel display effects, we need to collect the following information: device model, device brand, operating system and applications Program version and source channel, network type, login IP address*, log information* (operation log, service log, development log, crash log);<br />
                            (2) Search function: When you use the search function, we need to collect your search words and browsing records to provide you with better search results and improve our products and services;<br />
                            (3) Personalized recommendation and push function: In order to better recommend works for you, we may collect your personal information, including: gender, reading preference* (the classification information of your favorite works that you actively fill in), reading records, Browsing behavior, adding bookshelf behavior, transaction records*, unique device identifiers* (IMEI, IMSI, ICCID, device MAC address, AndroidID, Android advertising ID, OAID, MEID), application startup and shutdown information, application list information, to collect, Analysis alone or in combination with other information in order to provide you with personalized services and push;<br />
                            (4) Comments, Q&A information posting functions: When you use comments, dubbing, comic barrage, and posting functions, we will collect graphic, audio, and video information that you voluntarily provide;<br />
                            (5) Customer service/user feedback function: When you use the customer service for consultation and account appeal functions, we may need to collect your account information to verify your identity, and may also collect your mobile phone number*, viber number, etc.;<br />
                            (6) Purchase of physical goods/events containing physical prizes: When you purchase physical goods, or get physical rewards by participating in activities, and need to deliver goods, you need to collect your: name*, mobile phone number*, delivery address*. In order to provide you with related services smoothly, we may share your personal information, order information, product information, and payment information with suppliers who support our functions. These supports include supplying or providing infrastructure technical services, logistics and distribution services, payment services, after-sales and customer service services, etc. for us. The purpose of our sharing this information is to realize the core shopping functions of our products and/or services. For example, we must share the product information and receipt information in your order with the logistics service provider to arrange delivery; when you place an order When the goods or services are directly shipped or provided by the supplier, we need to share your order information, product information and delivery information with the supplier to instruct them to deliver the goods or provide services; when you apply for after-sales or customer service support , we need to share your personal information, order information, product information, and payment information with after-sales and customer service support providers to solve problems encountered in shopping, refunds, and returns for you.<br />
                            You can purchase physical goods for others, you need to provide the aforementioned personal information of the actual consignee, and ensure that you have obtained the consent of the actual consignee;<br />
                            * Some of our services may require you to provide specific sensitive personal information (marked with * in this Privacy Policy) to achieve specific functions. If you choose not to provide such information, you may not be able to use certain functions in the service normally, but it will not affect your use of other functions in the service. If you voluntarily provide your sensitive personal information, you agree that we will process your sensitive personal information according to the purpose and method described in this policy;<br />
                            * Personal sensitive information refers to personal information that may endanger personal and property safety, damage personal reputation, physical and mental health, or cause discriminatory treatment if leaked, illegally provided, or misused. For example, personal sensitive information includes ID number, personal biometric information, bank account number, communication content, health and physiological information, etc. The content contained in "personal information" or "personal sensitive information" in this privacy policy comes from GB/T35273 "Personal Information Security Specification", and the definition is consistent with the definition in "Personal Information Security Specification".<br /><br />
                            2.2 According to user behavior and product characteristics, ABC book mm may access the following content on the user's mobile phone:<br />
                            2.2.1 For users using the Android system, when you use the relevant products we provide to you, for the purpose of providing, processing, maintaining, improving, developing our products and/or providing you with services, the products may obtain The following permissions for your terminal device:<br />
                            (1) When users download books and store book data in SD cards and store user information when receiving push services, they need to use SD cards to write/delete internal storage permissions;<br />
                            (2) When the user reads the downloaded book, reads the book data and accepts the push to store the user information, the permission to read the internal storage is required;<br />
                            (3) In order to confirm the storage method of the downloaded book data, it is necessary to judge whether the user has inserted the SD card and use the mount file system permission;<br />
                            (4) Use the permission to obtain the application size for calculating the free area of the storage space;<br />
                            (5) When the user uses the voice reading function, the status and identity of the mobile phone are read in order to ensure that the voice reading is stopped when the call is received;<br />
                            (6) The role dubbing function and sentence dubbing need to use the recording audio permission;<br />
                            (7) Users can choose to use the camera to take pictures when uploading their avatars, but use the permission to take photos and videos and access the flashlight;<br />
                            (8) Use access to the network for the purpose of using the networking function of this software;<br />
                            (9) Obtain the user's network status in order to judge the user's current network status in order to prompt the user;<br />
                            (10) Prompt the user to open the network and use the permission to change the network status;<br />
                            (11) When the user is downloading books, when the user's current network is 2G/3G/4G, in order to save the user's traffic, prompt him to open the wifi network and use the permission to obtain and change the wifi status;<br/>
                            (12) Apply for permission to change the system settings so that the user can change the orientation of the horizontal and vertical screens while reading;<br/>
                            (13) Read and write system setting items for the user to adjust the brightness of the mobile phone and access the unique user ID;<br/>
                            (14) In order to ensure that users can get notifications at the first time and that the function of listening to books can be used normally, the program is allowed to run automatically when it is turned on, and the background process of the program is still running after the phone screen is turned off;<br/>
                            (15) Use the authority to end system tasks in order to restart the software when an abnormal situation occurs;<br/>
                            (16) Use sorting system tasks to create shortcuts on the phone desktop;<br/>
                            (17) In order to realize the ShortCut shortcut function in the Android 7.1 system and above, it is necessary to create a desktop shortcut permission;<br/>
                            (18) The user uses the permission to modify the sound settings to adjust the volume when using the voice reading function and dubbing playback;<br/>
                            (19) Use permission to vibrate in order to send notifications to users and obtain mobile phone vibrations;<br/>
                            (20) Read system logs to help users solve problems when the software is abnormal;<br/>
                            (21) In order to monitor whether the user's sharing of books to other applications is normal, use the permission program to obtain the current or recently running application permissions;<br/>
                            (22) Use the display system window permission to realize the floating window function;<br/>
                            (23) The live audiobook function needs to quickly unlock the phone through fingerprints when the screen is locked, and use fingerprints to unlock permissions;<br/>
                            (24) Use the battery status permission to enable the user to display battery power information on the reading page when reading in full screen;<br/>
                            (25) In order to support the reading always-on function and keep the network connection unobstructed, it is necessary to monitor the screen status and obtain the screen always-on permission, so that the system will not turn off the screen because the user does not operate for a long time;<br/>
                            (26) In order to allow users to use the function of listening to books through a Bluetooth headset, when the Bluetooth is disconnected, the audio will be automatically suspended, and the permission to create a Bluetooth connection is used;
                            (27) In order to allow users to use the function of listening to books with real people through the Bluetooth headset and the push in the personal push service, it is necessary to use the Bluetooth management authority;<br/>
                            (28) Receive the broadcast sent by the Android system and allow a program to quickly receive the next broadcast after receiving the broadcast;<br/>
                            (29) In order to allow the application to clear its own process restart after flashback, it is necessary to kill the background process function;<br/>
                            (30) To allow users to use the comic download function and audio book function to avoid being terminated by the system during the operation of the comic download function and audio book function of this program;<br/>
                            (31) For users in thisBrowsing the web within the program allows the program to automatically open the "Tencent X5 Kernel" to help improve the fluency of web browsing.<br/><br/>
                            2.2.2 For iOS users, when you use this software, for the purpose of providing, processing, maintaining, improving, developing our products and/or providing you with services, this software may obtain the following permissions on your terminal equipment :<br/>
                            (1) Calling the microphone permission for the purpose of obtaining the user's voice when using the playback function or dubbing function;<br/>
                            (2) In order to realize the functions of uploading avatars and posting posts, users may need to use the mobile phone camera permission;<br/>
                            (3) In order to allow users to save pictures, permission to use albums may be required;<br/>
                            (4) In order to realize the normal operation of the software, network permissions are required;<br/>
                            (5) Ensure that the audiobook function can be used normally and allow the background process of the program to still run after the phone screen is turned off;<br/>
                            (6) In order to obtain system advertisement identification for more accurate recommendation, permission to allow advertisement tracking may be required.<br/><br/>
                            2.2.3 Permissions required for third-party SDK access services. Our products and services may include those of third parties, as well as links to third-party websites. When you use these products or services, your information may also be collected. When third parties provide products and services to you, they may obtain the following permissions:<br/>
                            (1) When the user downloads the file, the third-party SDK Tencent Video and Baidu TTS need to write/delete the internal storage permission because the data needs to be stored in the SD card;<br/>
                            (2) When the user opens the stored document, because the document data needs to be read, the third-party SDK Tencent Video and Baidu TTS need to read the internal storage permission;<br/>
                            (3) When the user uses the voice reading function, in order to ensure that the voice reading is stopped when an incoming call is made, and when the push service generates a unique identifier, it is necessary to read the status and identity of the mobile phone;<br/>
                            (4) Use access to the network for the purpose of using the networking function of this software;<br/>
                            (5) Obtain the user's network status in order to judge the user's current network status in order to prompt the user;<br/>
                            (6) Prompt the user to open the network and use the permission to change the network status;<br/>
                            (7) When the user performs a download operation, when the user's current network is 2G/3G/4G, in order to save user traffic, the third-party SDK Sina and UnionPay will prompt the user to open the wifi network, collect the user's geographic information and use it to obtain and change wifi status permissions;<br/>
                            (8) Read and write system setting items for users to adjust the brightness of mobile phones;<br/>
                            (9) In order to monitor whether the functions shared by users to other applications are normal, the third-party SDK Alipay, UnionPay, Tencent Cloud, Aurora Push, Getui Push, and VIVO Push need to use the permission program to obtain the current or recently running application permissions;<br/>
                            (10) When the user is setting the reading interface to be always on, he needs to use the permission to keep the screen always on, so that the system will not turn off the screen because the user does not operate for a long time;<br/>
                            (11) The third-party SDK UnionPay Payment, Jiguang Push, Getui Push, Guangdiantong, Tencent Cloud, and Youzan Mall need to make relevant decisions based on the user's current location*, and need to obtain rough location* and location* permissions;<br/>
                            (12) In order to support the UnionPay NFC payment function, it is necessary to obtain the short-range communication operation authority;<br/>
                            (13) In order to receive messages from Jiguang, it is necessary to obtain Jiguang push permission;<br/>
                            (14) In order to support the push function on OPPO mobile phones, it is necessary to obtain the custom permission of OPPO push;<br/>
                            (15) In order to support the push function on Xiaomi mobile phones, it is necessary to obtain the custom permission of Xiaomi Push;<br/>
                            (16) Install APK permission: the permission required to access the third-party SDK Guangdiantong;<br/>
                            (17) In order to support push capabilities, access to additional location* provider command permissions is required;<br/>
                            (18) In order to use the third-party basic image loading library Glide, permission to read and write contacts in the address book is required;<br/>
                            (19) It is necessary to obtain the list of installed applications so that Guangdiantong and Youzan Mall can make relevant decisions through the current application list;<br/><br/>
                        </p>

                        <p className='mt-4 text-lg font-semibold'>
                            3. 【How we may use information】
                        </p>
                        <p>
                            3.1 How we may use the information<br/>
                            3.1.1 The user agrees that ABC book mm needs to use the user's information resources for the following reasons:<br/>
                            (1) To provide you with core reading services;<br/>
                            (2) Safety guarantee. We will use your information for identity verification, security protection, anti-fraud monitoring, archive backup, and customer security services;<br/>
                            (3) Product development and optimization. When our system fails, we will record and analyze the information generated when the system fails to optimize our services;<br/>
                            (4) Let us know more about how you access and use our services, so as to respond to your individual needs in a targeted manner, including personalized recommended books and personalized push;<br/>
                            (5) Executing software, performing software certification or software upgrades;<br/>
                            (6) Let you participate in surveys about our products and services;<br/>
                            (7) Recommend advertisements, information, and evaluations that you may be interested in, so as to further improve the effect of our advertising and other promotions and promotional activities;<br/>
                            (8) With the consent of the user, provide the cooperation unit with statistical data based on user information, behavior analysis and non-associated user identification information to present the cooperation effect;<br/>
                            (9) Push notifications for users and service information provided by China Literature;<br/>
                            (10) Modify global system settings; change screen display orientation; use simulated location sources for testing; edit SMS or MMS.<br/>
                            (11) Provide you with physical goods shopping services and activities including physical rewards. Including the realization of product display and search, order placement, payment functions, delivery of products/prizes, customer service and after-sales functions.<br/><br/>
                            3.1.2 List of functions involving the use of personal information:<br/>
                            (1) Personalized recommendation: based on user equipment information and service log information, indirectly extract user preference features*, and generate user group portraits based on feature tags, user display, push and possible commercial advertisements;<br/>
                            (2) Basic account services: Use your mobile phone number*, intended nickname and password to create a starting point account, and then use services that require a platform account to open: comments, dubbing, posting, sharing, check-in, events, uploading/ Change the avatar to display the public honors the user has received;<br/>
                            (3) Social/publishing function: When you publish information in the book friend circle or this chapter, we need your personal information: nickname/avatar is used for publishing public content;<br/>
                            (4) When a user participates in an event held on the site, we need the user's personal information: nickname/avatar is used for the display of lottery results, fan rankings and other public content.<br/>
                            3.2 In order to allow you to have a better experience, improve our services or other purposes you agree to, we may use the information collected through a service for our other services, subject to compliance with relevant laws and regulations. The information collected when you use one of our services may be used in another service to provide you with specific content, or to show you information that is relevant to you and not generally pushed. If we provide the corresponding option in the relevant service, you can also authorize us to use the information provided and stored by the service for our other services.<br/>
                            3.3 In order to ensure the security of the service and help us better understand the operation of our application, we may record relevant information, such as the frequency of your use of the application, fault information, overall usage, performance data and the source of the application. We do not combine the information we store in the analytics software with personally identifiable information you provide in the application.<br/>

                            3.4 When you use our products or services, we may collect your information by placing secure cookies and related technologies, including: your login information, browsing information, and preferences. You can also manage cookies through your browser settings. But please note that if you disable cookies, you may not be able to enjoy the best service experience, and some services may not work properly. Cookies are very important to improve the user's network experience. We generally use cookies for the following purposes:<br/>
                            (1) Optimize login experience: Cookies can help you fill in your last login account name by storing account information when you register and log in, simplifying your repeated steps;<br/>
                            (2) Security: Cookies can help us ensure the security of data and services, and check for cheating, hacking, and fraud targeting our products and services;<br/>
                            (3) Preferences: used to save the user's simple personalized settings.<br/>
                            3.5 Sharing and disclosure of information<br/>
                            3.5.1 We may share your personal information with third parties under the circumstances stipulated by laws and regulations, or with your prior explicit consent or manual choice;<br/><br/>
                            3.5.2 Only for the purpose of external processing, we may cooperate with third-party partners (third-party service providers, contractors, etc. service providers, agents, advertising partners, application developers, communication service providers who send email or push notifications on our behalf, map service providers who provide location* services for us) (they may not be located in your jurisdiction) to share your Let them process the above information for us in accordance with our instructions, privacy agreement and other relevant confidentiality and security measures. If we share your information with the above third parties, we will use encryption, anonymization and other means Keep your information safe and use it for the following purposes:<br/>
                            (1) Provide our services to you;<br/>
                            (2) To achieve the purpose described in the section "How we use the collected information";<br/>
                            (3) Fulfill our obligations and exercise our rights in the "User Service Agreement";<br/>
                            (4) To understand, maintain and improve our services.<br/>
                            If we share your information with the above-mentioned third parties, we will use encryption and anonymization to ensure the security of your information.<br/><br/>
                            3.5.3 Transfer of information<br/>
                            We will not transfer the user's personal information with companies or organizations other than Tamron's provider, except in the following cases:<br/>
                            (1) Transfer with explicit consent: After obtaining your explicit consent, we will transfer your personal information to other parties;<br/>
                            (2) With the continuous development of our business, when mergers, acquisitions, and asset transfer transactions result in the sharing of your personal information with third parties, we will notify you of the relevant situation through push notifications and announcements. Continue to protect or require a new controller to continue to protect your personal information to the standards required by this Agreement.<br/><br/>
                            3.5.4 We will use the collected information for big data analysis. We use the collected information for analysis to form industry insight reports that do not contain any personal information. We may disclose and share with our partners the statistically processed and non-identifiable information to understand how users use our services or to let the public understand the overall usage trends of our services.<br/><br/>
                            3.5.5 We may disclose your personal information for the following purposes:<br/>
                            (1) Comply with applicable laws and regulations and other relevant provisions;<br/>
                            (2) Comply with court judgments, rulings or other legal procedures;<br/>
                            (3) Comply with the requirements of relevant government agencies or other legally authorized organizations;<br/>
                            (4) We have reasons to believe that we need to abide by relevant laws and regulations;<br/>
                            (5) Reasonable and necessary purposes to implement relevant service agreements or this agreement, safeguard social and public interests, protect the personal and property safety of our customers, us or our affiliates, other users or employees, or other legitimate rights and interests.<br/><br/>
                            3.5.6 Types of sharing, transfer, and public disclosure of personal information<br/>
                            (1) Types of personal information shared, transferred, and publicly disclosed on the webpage: device number, network region, recharge/consumption amount*, reading books, posting comments/thoughts/dubbing/posting, book ratings, created book lists, reading Check the number of books, pay attention to authors/users, collect books/topics/book lists;<br/>
                            (2) Types of personal information shared, transferred, and publicly disclosed by the App: Advertisement service encryption provides downloading of user device numbers, channels, versions, platforms, models, screen resolutions and screen sizes, lists of Apps, and reading through this channel. Duration, App usage time, reading book classification, payment amount*.<br/><br/>
                            3.5.7 We are aware of the corresponding legal responsibilities for external sharing, transfer, and public disclosure of personal information, and will take reasonable measures to protect the security of personal information.<br/><br/>
                        </p>

                        <p className='mt-4 text-lg font-semibold'>
                            4. 【How do you access and control your personal information】
                        </p>
                        <p>
                            {/* 4.【How do you access and control your personal information】<br/> */}
                            4.1 You have control over your personal information in our products and/or services in a variety of ways, including: you can access, correct/modify, delete your personal information, and you can withdraw your previous access to your personal information Agree, and you can also cancel your account at the same time. In order to facilitate you to exercise your above-mentioned control rights, we provide you with operation guidelines and operation settings on the relevant function pages of the product, and you can perform operations by yourself. If you have doubts or difficulties during the operation, you can contact us through the methods at the end of the article Let's take control and we'll take care of it for you in a timely manner.<br/>
                            4.1.1 Access to your personal information<br/>
                            You can inquire or access your relevant personal information in our products and/or services, including:<br/>
                            Account information: You can log in to your personal account, visit - "I" - personal home page to access the personal information in your account, including: profile picture, nickname, community profile;<br/>
                            Use information: You can check your browsing records, bookshelf addition records, search records, etc. at any time through the bookshelf page, search page, and my page;<br/>
                            Transaction and consumption information*: You can view your transaction records* and consumption records* by visiting the "Me" page-click on the account balance;<br/>
                            Other information: If you encounter operational problems during this visit or if you need to obtain other personal information that cannot be obtained above, you can contact us through the methods provided at the end of this article, and we will provide you with a reasonable period of time after verifying your identity. Provided by you, except as otherwise provided by laws and regulations or otherwise agreed in this policy.<br/><br/>
                            4.1.2 Correction/amendment of your personal information<br/>
                            You can correct/modify your relevant personal information in our products and/or services. In order to facilitate you to exercise your above rights, we provide you with two ways to correct/modify online and apply for correction/modification to us. For the sake of security and identification (such as number appeal service), you may not be able to modify the initial registration information and other verification information provided during registration.<br/>
                            For some of your personal information, we provide you with operation guidelines and operation settings on the relevant function pages of the product, and you can directly correct/modify them. The operation guidelines are as follows:<br/>
                            (1) The correction/modification interface of "Avatar/Nickname/Community Profile" information is: "I"—Personal Homepage—Edit Information;<br/>
                            (2) The correction/modification interface of "mobile phone number*/email*/password*/third-party account" information is: "Me"-Settings-Security Center;<br/><br/>
                            4.1.3 Deletion and deregistration<br/>
                            Generally speaking, we will only save your personal information for the shortest time required by laws and regulations or necessary. To facilitate your exercise of yourFor the above-mentioned deletion right, we provide you with two ways to delete yourself online and apply for deletion to us.<br/>
                            For some of your personal information, we provide you with operation guidelines and operation settings on the relevant function pages of the product, and you can directly delete it. Once you delete it, we will delete or anonymize such information, unless Laws and regulations provide otherwise:<br/>
                            (1) The deletion interface of "Search History" information in the App is: Bookshelf/Selection/Discovery-Search-Search History;<br/>
                            (2) The deletion interface of the "browsing history" information in the App is: "I"-browsing history;<br/>

                            Under the following circumstances, you can directly submit a request to us to delete your personal information, except that the data has been anonymized or otherwise stipulated by laws and regulations:<br/>
                            (1) If our handling of personal information violates laws and regulations;<br/>
                            (2) If we collect and use your personal information without your consent;<br/>
                            (3) If our handling of personal information violates our agreement with you;<br/>
                            (4) If you no longer use our products or services, or you cancel your account;<br/>
                            (5) If we no longer provide you with products or services.<br/>
                            We provide you with account cancellation authority. You can cancel your account through the function operation in the App or contact our customer service. The operation interface: "Me"-Settings-Security Center-Account Cancellation. Once you cancel your account, you will not be able to use the services of our full-line user products and automatically give up your existing rights and interests, so please proceed with caution. Unless otherwise stipulated by laws and regulations, after canceling the account, we will stop providing you with all our products and services, and all content, information, data, and records of our products and services that you have used through this account will be deleted. Deletion or anonymization.<br/><br/>
                            4.1.4 Right to withdraw consent<br/>
                            If you want to change the authorization scope of related functions, you can modify the authorization scope corresponding to the product management through your device, the operation interface: System Settings-App Details Page-Permission Settings/Notification Settings. When you cancel the authorization to collect relevant personal information, we will no longer collect this information, and we will no longer be able to provide you with the above-mentioned corresponding services.<br/>
                            4.2 When you access, modify and delete relevant information, we may require you to perform identity verification to ensure the security of your account.<br/>
                            4.3 Please understand that due to technical limitations, legal or regulatory requirements, we may not be able to meet all your requests, and we will respond to your requests within a reasonable time limit.<br/>
                            4.4 Personal information security protection measures and capabilities: protecting users' personal information is a basic principle of China Literature, and China Literature will take reasonable measures to protect users' personal information. Unless otherwise stipulated by laws and regulations or otherwise agreed in this agreement, China Literature will not disclose or disclose the user's personal information to third parties without the user's permission. China Literature adopts professional encrypted storage and transmission methods for relevant information to ensure the security of users' personal information. China Literature will use various security technologies and procedures to establish a sound management system to protect your personal information from unauthorized access, use or disclosure.<br/>
                            (1) In terms of secure data transmission, cryptographic technologies such as transport layer security protocols are used to prevent the risk of sniffing, eavesdropping and interception of the transmission link through Https and other methods, and establish a safe and private data collection environment to ensure the privacy and integrity of data collection ;<br/>
                            (2) In terms of data security storage, classify and classify data and take additional security protection measures such as independent and encrypted storage for users' personal sensitive information;<br/>
                            (3) In terms of security control of data access and use, implement strict data authority control mechanisms, adopt multiple identity authentication technologies, and monitor behaviors that can process your information to prevent data from being accessed in violation of regulations and used without authorization;<br/>
                            (4) Other measures to achieve data security protection.<br/>
                            4.5 Only for the purpose of external processing, or with the continuous development of our business, when mergers, acquisitions, asset transfer transactions occur, we may cooperate with third-party partners (third-party service providers, contractors, agents, advertising Partners, application developers) (who may not be located in your jurisdiction) share your personal information and let them process the above information for us in accordance with our instructions, privacy agreement and other relevant confidentiality and security measures. If we share your information with the above-mentioned third parties, we will use encryption and anonymization to ensure the security of your information.<br/>
                        </p>

                        <p className='mt-4 text-lg font-semibold'>
                            5. [Agreement Update]
                        </p>
                        <p>
                            For the revised agreement, we will separately explain to you the purpose, scope and use of the corresponding information through in-site letters, page prompts, and marking with red dots, and provide you with a way to choose your own consent, and after obtaining your express consent At the same time, collect and use your personal information.<br/>
                        </p>

                        <p className='mt-4 text-lg font-semibold'>
                            6.【Contact us】
                        </p> 
                        <p>
                            Our contact information:<br/>
                            Tamron Corporation<br/>
                            Customer service phone: *** (customer service complaint processing time is 3 days)<br/>
                            Customer service page: ***<br/>
                            Registered address:****
                        </p>
                    </div>

                </div>
            </Layout>
        </>
    )
}