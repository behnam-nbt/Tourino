'use client'
import Link from 'next/link';
import styles from './HamburgerMenu.module.css'
import { RxHamburgerMenu } from "react-icons/rx";
import { RiHome7Fill } from "react-icons/ri";
import { SlSupport } from "react-icons/sl";
import { RxSpeakerModerate } from "react-icons/rx";
import { FiPhone } from "react-icons/fi";
import { useState } from 'react';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <RxHamburgerMenu />
      </div>
      {isOpen && (
        <div className={styles.menuContainer}>
          <div className={styles.menu}>
            <ul>
              <li><Link href="/"><RiHome7Fill /> صفحه اصلی</Link></li>
              <li><Link href="/"><SlSupport /> خدمات گردشگری</Link></li>
              <li><Link href="/aboutus"><RxSpeakerModerate /> درباره ما</Link></li>
              <li><Link href="/"><FiPhone /> تماس با ما</Link></li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default HamburgerMenu