import Link from 'next/link'
import styles from './not-found.module.css'
import Image from 'next/image'

function PageNotFound() {
  return (
    <div className={styles.container}>
      <div>
        <h2>صفحه مورد نظر یافت نشد</h2>
        <Link href='/'>بازگشت به صفحه اصلی</Link>
      </div>
      <Image src='/images/error-tv.png' width={1000} height={700} quality={100} />
    </div>
  )
}

export default PageNotFound