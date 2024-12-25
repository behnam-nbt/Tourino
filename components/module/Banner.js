import Image from 'next/image'
import styles from './Banner.module.css'

function Banner() {
  return (
    <div className={styles.banner}>
        <Image src="/images/banner.png" width={1500} height={1200} quality={100} alt='banner' />
    </div>
  )
}

export default Banner