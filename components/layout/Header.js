'use client';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/context/AuthContext';
import { toPersianDigits } from '@/helper/helper';
import Image from 'next/image';
import Link from 'next/link';
import { TiUser } from 'react-icons/ti';
import { HiOutlineUser } from "react-icons/hi2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RxExit } from "react-icons/rx";
import styles from './Layout.module.css';
import Auth from '../template/Auth';
import HamburgerMenu from '@/elements/HamburgerMenu';
import LoginIcon from '@/elements/LoginIcon';
import { usePathname } from 'next/navigation';

function Header() {
    const { user, loading, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathName = usePathname();
    const menuRef = useRef(null); // Reference for user menu container
    const loginContainerRef = useRef(null); // Reference for login container

    const openUserMenuHandler = () => {
        setIsOpen(!isOpen);
    };

    const authModalHandler = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        // Close menu when navigating to a new page
        setIsOpen(false);
    }, [pathName]);

    useEffect(() => {
        // Close menu when clicking outside of the menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                loginContainerRef.current && !loginContainerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.headContainer}>
                <div className={styles.logo}>
                    <Image src="/images/Torino.png" width={1000} height={700} alt='logo' priority={true} />
                </div>
                <HamburgerMenu />
                <div className={styles.menu}>
                    <ul>
                        <li style={pathName === '/' ? { color: "#28A745" } : null}><Link href="/">صفحه اصلی</Link></li>
                        <li><Link href="/">خدمات گردشگری</Link></li>
                        <li><Link href="/">درباره ما</Link></li>
                        <li><Link href="/">تماس با ما</Link></li>
                    </ul>
                </div>
                <div className={styles.loginContainer} ref={loginContainerRef}>
                    {loading ? null : user ? (
                        <div className={styles.noBorder}>
                            <TiUser />
                            <div className={styles.userTab}>
                                <span>{toPersianDigits(user.mobile)}</span>
                                <button onClick={openUserMenuHandler}><MdOutlineKeyboardArrowDown /></button>
                            </div>
                            {isOpen && (
                                <div className={styles.userMenu} ref={menuRef}>
                                    <div className={styles.phone}>
                                        <div className={styles.mobileIcon}>
                                            <TiUser />
                                        </div>
                                        <span>{toPersianDigits(user.mobile)}</span>
                                    </div>
                                    <Link href="/profile">
                                        <div className={styles.goToProfile}>
                                            <div className={styles.profIcon}>
                                                <HiOutlineUser />
                                            </div>
                                            <div>
                                                <span>اطلاعات حساب کاربری</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div>
                                        <div className={styles.logout}>
                                            <button onClick={logout}>
                                                <RxExit />
                                                <span>خروج از حساب کاربری</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.btnBox} onClick={authModalHandler}>
                            <div className={styles.btnSubBox}>
                                <TiUser />
                                <div>
                                    <button>ورود
                                        &nbsp;|&nbsp;
                                        ثبت نام</button>
                                </div>
                            </div>
                            <LoginIcon />
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && <Auth isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </header>
    );
}

export default Header;
