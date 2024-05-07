import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import Image from 'next/image'

import { useState , useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export default function LocaleSwitcher() {
	const {locale, locales, route, query} = useRouter();
	const router = useRouter();
	const t = useTranslations('Default');
    const anchorRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
    
        setOpen(false);
    };

    const handleMenuItemClick = (event, lang) => {
        if(lang === 'mm') {
			router.push(route, `/mm${router.asPath}`, { locale: 'mm', ...query })
		} else if(lang === 'en') {
			router.push(route, `/en${router.asPath}`, { locale: 'en', ...query })
		}
        setOpen(false);
    };

	const langIcon = '/icon/mobile-lang.svg';
	const enIcon = '/icon/en.svg';
	const mmIcon = '/icon/mm.svg';

	return (
		<div className='py-2 relative'>
			<Button
				id="mobile-basic-button"
				aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
			>
				<Image src={langIcon} alt="language" width={36} height={36} />
                <p className='ml-2 text-white text-sm'>
                    {
                        locale === 'en' ? 'English' : 'မြန်မာ'
                    }
                </p>
			</Button>
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                        transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    <MenuItem onClick={(event) => handleMenuItemClick(event, 'en')}>
                                        <Image src={enIcon} alt="English" width="30" height="20" />
                                        <p className='ml-2 text-gray-700 text-xs'>English</p>
                                    </MenuItem>
                                    <MenuItem onClick={(event) => handleMenuItemClick(event, 'mm')}>
                                        <Image src={mmIcon} alt="Myanmar" width="30" height="20" />
                                        <p className='ml-2 text-gray-700 text-xs'>မြန်မာ</p>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>     
		</div>
	);
}
