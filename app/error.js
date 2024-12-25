'use client'
import Image from 'next/image'
import styles from './error.module.css'

function Error({ error }) {
    return (
        <div className={styles.container}>
            <div>
                <h2>اتصال با سرور برقرار نیست</h2>
                <p>{error.message}</p>
            </div>
            <Image src='/images/error-robot.png' width={1000} height={700} quality={100} alt='error' />
        </div>
    )
}

export default Error