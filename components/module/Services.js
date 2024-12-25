import styles from './Services.module.css'

function Services() {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <img src='/images/discount.png' alt='img1' />
                <div>
                    <h4>به صرفه ترین قیمت</h4>
                    <p>به صرفه ترین و بهترین قیمت تور را از ما بخواهید.</p>
                </div>
            </div>
            <div className={styles.section}>
                <img src='/images/support.png' />
                <div>
                    <h4>پشتیبانی</h4>
                    <p>پشتیبانی و همراهی 24 ساعته در تمامی مراحل سفر شما.</p>
                </div>
            </div>
            <div className={styles.section}>
                <img src='/images/like.png' />
                <div>
                    <h4>رضایت کاربران</h4>
                    <p>رضایت بیش از ده هزار کاربر از تورهای ما.</p>
                </div>
            </div>
        </div>
    )
}

export default Services