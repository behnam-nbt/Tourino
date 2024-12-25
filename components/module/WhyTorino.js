'use client'
import Carousel from '@/elements/Carousel';
import styles from './WhyTorino.module.css'

function WhyTorino() {

    return (
        <div className={styles.container}>
            <div className={styles.right}>
                <div className={styles.title}>
                    <div className={styles.mark}>
                        <p>?</p>
                    </div>
                    <h2>چرا <span>تورینو ؟</span></h2>
                </div>
                <div className={styles.description}>
                    <h4>تور طبیعت گردی و تاریخی</h4>
                    <p>اگر دوست داشته باشید که یک جاذبه طبیعی را از نزدیک ببینید و
                        در دل طبیعت چادر بزنید یا در یک اقامتگاه بوم گردی اتاق بگیرید، باید تورهای طبیعت‌گردی را خریداری کنید.
                        اما اگر بخواهید از جاذبه‌های گردشگری و آثار تاریخی یک مقصد خاص بازدید کنید،
                        می‌توانید تورهای فرهنگی و تاریخی را خریداری کنید.</p>
                </div>
            </div>
            <Carousel />
        </div>
    )
}

export default WhyTorino;
