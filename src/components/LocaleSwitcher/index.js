import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import Image from 'next/image'

import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function LocaleSwitcher() {
	const {locale, locales, route, query} = useRouter();
	const router = useRouter();
	const t = useTranslations('Default');

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (lang) => (e) => {
		if(lang === 'mm') {
			router.push(route, `/mm${router.asPath}`, { locale: 'mm', ...query })
		} else if(lang === 'en') {
			router.push(route, `/en${router.asPath}`, { locale: 'en', ...query })
		}
		setAnchorEl(null);
	};

	const theme = createTheme({
		components: {
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: '#173F5F !important',
					},
				},
			},
		},
	});

	const langIcon = '/icon/language.svg';
	const enIcon = '/icon/en.svg';
	const mmIcon = '/icon/mm.svg';

	return (
		<div className='md:ml-4 lg:ml-8 py-3'>
			<Button
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<Image src={langIcon} alt="language" width={36} height={36} />
			</Button>
			<ThemeProvider theme={theme}>
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose(null)}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem onClick={handleClose('en')}>
						<Image src={enIcon} alt="English" width="30" height="20" />
						<p className='ml-2 text-[#FCFCFC] text-xs'>English</p>
					</MenuItem>
					<MenuItem onClick={handleClose('mm')}>
						<Image src={mmIcon} alt="Myanmar" width="30" height="20" />
						<p className='ml-2 text-[#FCFCFC] text-xs'>မြန်မာ</p>
					</MenuItem>
				</Menu>
			</ThemeProvider>
		</div>
	);
}
