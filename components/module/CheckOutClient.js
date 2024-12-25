    'use client';

    import React, { useEffect, useState } from 'react';
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css'; // Import styles for ToastContainer
    import styles from './CheckOutClient.module.css';
    import { TiUser } from "react-icons/ti";
    import FinalPurcahse from '@/components/module/FinalPurcahse';

    import { useUser } from '@/context/AuthContext';
    import { Order } from '@/utils/services';
    import { useRouter } from 'next/navigation';
    import { generateOrderNumber } from '@/helper/helper';

    const CheckOutClient = ({ token, tour, duration }) => {
        const { user, loading: userLoading } = useUser();
        const [isSubmitting, setIsSubmitting] = useState(false); // Separate loading for submission
        const [orderNumber, setOrderNumber] = useState(null);
        const router = useRouter();

        if (!token) {
            window.location.href = '/';
        };

        useEffect(() => {
            const newOrderNumber = generateOrderNumber();
            setOrderNumber(newOrderNumber);
            console.log("Generated Order Number:", newOrderNumber);
        }, []);

        const handleOrderSubmit = async () => {
            if (isSubmitting || userLoading) return; // Prevent multiple submissions

            setIsSubmitting(true);
            try {
                // Prepare the order payload
                const orderData = {
                    fullName: user.surname,
                    nationalCode: user.identity,
                    birthDate: user.birthday,
                    gender: user.gender,
                    orderNumber,
                };
                console.log('Sending order data:', orderData);

                await Order.submitOrder(orderData);

                // Handle success
                toast.success("سفارش شما با موفقیت ثبت شد!");

                setTimeout(() => {
                    router.push('/');
                }, 2000)
            } catch (error) {
                // Handle error
                toast.error("خطایی در ثبت سفارش رخ داد. لطفاً دوباره امتحان کنید.");
                console.error("Order submission error:", error);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className={styles.container}>
                {/* User Details */}
                <div className={styles.userDetails}>
                    <div className={styles.userTitle}>
                        <TiUser />
                        <h2>مشخصات مسافر</h2>
                    </div>
                    <FinalPurcahse user={user} loading={userLoading} />
                </div>

                {/* Tour Details */}
                <div className={styles.tourDetails}>
                    <div className={styles.tourTitle}>
                        <h2>{tour.title}</h2>
                        <p>{`${duration.faDurationInDays} روز و ${duration.faDurationInNights} شب`}</p>
                    </div>
                    <div className={styles.tourPrice}>
                        <span>قیمت نهایی</span>
                        <p>{tour.price.toLocaleString("fa-IR")}
                            <span style={{ fontSize: "14px", fontWeight: "400" }}>تومان</span>
                        </p>
                    </div>
                    <div className={styles.accept}>
                        <button onClick={handleOrderSubmit} disabled={isSubmitting || userLoading}>
                            {isSubmitting ? "در حال ثبت..." : "ثبت و خرید نهایی"}
                        </button>
                    </div>
                </div>

                {/* Toast Notifications */}
                <ToastContainer position="bottom-right" />
            </div>
        );
    };

    export default CheckOutClient;
