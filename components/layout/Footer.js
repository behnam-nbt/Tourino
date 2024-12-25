import Link from 'next/link'
import styles from './Layout.module.css'
import { digitsEnToFa } from '@persian-tools/persian-tools'

function Footer() {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.lastSection}>
          <div className={styles.right}>
            <div className={styles.torino}>
              <h2>تورینو</h2>
              <div className={styles.list}>
                <ul>
                  <li><Link href="/">درباره ما</Link></li>
                  <li><Link href="/">تماس با ما</Link></li>
                  <li><Link href="/">چرا تورینو</Link></li>
                  <li><Link href="/">بیمه مسافرتی</Link></li>
                </ul>
              </div>
            </div>
            <div className={styles.services}>
              <h2>خدمات مشتریان</h2>
              <div className={styles.list}>
                <ul>
                  <li><Link href="#">پشتیبانی آنلاین</Link></li>
                  <li><Link href="#">راهنمای خرید</Link></li>
                  <li><Link href="#">راهنمای استرداد</Link></li>
                  <li><Link href="#">پرسش و پاسخ</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.left}>
            <div className={styles.logo}>
              <img src='/images/Torino.png' alt='Torino' />
              <p>تلفن پشتیبانی :<span>{digitsEnToFa('8754-021')}</span></p>
            </div>
            <div className={styles.namad}>
              <img src='/images/aira.png' alt='namad' />
              <img src='/images/samandehi.png' alt='namad' />
              <img src='/images/ecunion.png' alt='namad' />
              <img src='/images/passenger-rights.png' alt='namad' />
              <img src='/images/state-airline.png' alt='namad' />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>کلیه حقوق این وبسایت متعلق به تورینو میباشد.</p>
      </div>
    </>
  )
}

export default Footer