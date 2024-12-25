'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';

import styles from './page.module.css'

import { TiUser } from "react-icons/ti";
import { BsSunrise } from "react-icons/bs";
import { MdPayment } from "react-icons/md";

function ProfileLayout({ children }) {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/not-found'); // Redirect to "not-found" if not authenticated
        }
    }, [loading, user, router]);

    if (loading) {
        return <div style={{textAlign: "center"}}>در حال بارگذاری...</div>;
    }

    if (!user) {
        // Prevent rendering after redirection to avoid React errors
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sideBar}>
                <ul>
                    <li className={pathname === '/profile' ? styles.active : ""}><Link href='/profile'><TiUser /><span>پروفایل</span></Link></li>
                    <li className={pathname === '/profile/my-tours' ? styles.active : ""}><Link href='/profile/my-tours'><BsSunrise /><span>تورهای من</span></Link></li>
                    <li className={pathname === '/profile/transaction' ? styles.active : ""}><Link href='/profile/transaction'><MdPayment /><span>تراکنش ها</span></Link></li>
                </ul>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}

export default ProfileLayout;
