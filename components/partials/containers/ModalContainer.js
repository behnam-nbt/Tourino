import styles from './ModalContainer.module.css'

function ModalContainer({ children, isModalOpen, setIsModalOpen }) {
    if (!isModalOpen) return
    return (
        <div className={styles.modalContainer}>{children}</div>
    )
}

export default ModalContainer