import React, { useEffect, useState } from 'react'

import Footer from './Footer'
import Header from './Header'
import MobileFooter from './MobileFooter'
import MobileHeader from './MobileHeader'
import styles from '@/styles/Header.module.css'
import mstyles from '@/styles/MobileHeader.module.css'
import helper from '@/utils/helper'

const Layout = ({children}) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(helper.isMobile(window.navigator.userAgent))
	}, [])

	return (
		<>
			{
				isMobile ?
				<>
					<MobileHeader />
						<main className={mstyles.mainContainer}>
							{children}
						</main>
					<MobileFooter />
				</>
					
				:
				<>
					<Header />
						<main className={styles.mainContainer}>
							{children}
						</main>
					<Footer />
				</>
			}
			
		</>
	)
}

export default Layout;
