'use client'

import Image from 'next/image';
import styles from './TourInfo.module.css';
import { digitsEnToFa } from '@persian-tools/persian-tools';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Basket } from '@/utils/services';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function TourInfo({ tour }) {
  const token = Cookies.get('accessToken');
  console.log(token)
  const [isInBasket, setIsInBasket] = useState(false);
  const router = useRouter();

  const checkTourInBasket = async () => {
    try {
      if (!token) {
        const localTour = JSON.parse(localStorage.getItem('tour'));
        if (localTour && localTour === tour.id) {
          setIsInBasket(true);
        } else {
          setIsInBasket(false);
        }
      } else {
        // Sync local storage tours with the server-side basket
        const localTour = JSON.parse(localStorage.getItem('tour'));
        if (localTour) {
          await Basket.addTourToBasket(localTour); // Sync the tour to the server
          localStorage.removeItem('tour'); // Clear localStorage after syncing
        }

        // Check server-side basket
        const basket = await Basket.getBasket();
        if (basket && basket.id === tour.id) {
          setIsInBasket(true);
        } else {
          setIsInBasket(false);
        }
      }
    } catch (error) {
      console.error('Error checking basket:', error);
    }
  };


  useEffect(() => {
    checkTourInBasket();
  }, []);

  useEffect(() => {
    const handleLogin = async () => {
      if (token) {
        await checkTourInBasket();
      }
    };

    handleLogin();
  }, [token]);

  const resreveHandler = async () => {
    try {
      if (!token) {
        localStorage.setItem('tour', JSON.stringify(tour.id));
        setIsInBasket(true);
        toast.success("با موفقیت به سبد خرید شما اضافه شد.");
      } else {
        await Basket.addTourToBasket(tour.id);
        setIsInBasket(true);
        toast.success("با موفقیت به سبد خرید شما اضافه شد.");
      }
    } catch (error) {
      toast.error("خطا در اضافه شدن تور به سبد خرید!");
    }
  }

  const checkoutHandler = () => {
    if (!token) {
      toast.error("لطفا وارد حساب کاربری خود شوید.");
    } else {
      // Proceed to checkout if the user is logged in
      router.push(`/checkout/${tour.id}`);
    }
  };

  // Calculate travel duration
  const startDate = new Date(tour.startDate);
  const endDate = new Date(tour.endDate);
  const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Days between start and end
  const durationInNights = durationInDays - 1; // Nights between start and end
  const faDurationInNights = digitsEnToFa(durationInNights); // Convert Nights digit from En to Fa
  const faDurationInDays = digitsEnToFa(durationInDays); // Convert Days digit from En to Fa

  return (
    <div className={styles.container}>
      <div className={styles.upSection}>
        <div className={styles.imageBox}>
          <Image src={tour.image} width={1200} height={800} alt={tour.title} quality={99} />
        </div>
        <div className={styles.tourHead}>
          <div className={styles.tourTitle}>
            <h1>{tour.title}</h1>
            <p>{faDurationInDays} روز و {faDurationInNights} شب</p>
          </div>
          <div className={styles.tourServices}>
            <div className={styles.options}>
              <ul>
                {tour.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
            <div className={styles.actions}>
              <p>{digitsEnToFa(tour.price.toLocaleString("fa-IR"))} <span>تومان</span></p>
              {!isInBasket ? (
                <button onClick={resreveHandler}>رزرو و خرید</button>
              ) : (
                <button onClick={checkoutHandler}>ادامه و پرداخت</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Swiper
        spaceBetween={10}
        slidesPerView={6}
        navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
        modules={[Navigation]}
        breakpoints={{
          // For mobile devices
          0: {
            slidesPerView: 3, // 1 slide for very small screens
          },
          640: {
            slidesPerView: 3, // 2 slides for small devices
          },
          768: {
            slidesPerView: 3, // 3 slides for tablets and larger mobiles
          },
          1024: {
            slidesPerView: 6, // Default for desktops
          },
        }}
      >
        <div className={styles.downSection}>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/routing-2.svg" alt="Origin Icon" width={20} height={20} />
                <h6>مبداً</h6>
              </div>
              <p>{tour.origin.name}</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/calendar.svg" alt="Origin Icon" width={20} height={20} />
                <h6>تاریخ رفت</h6>
              </div>
              <p>{new Date(tour.startDate).toLocaleDateString("fa-IR")}</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/calendar.svg" alt="Origin Icon" width={20} height={20} />
                <h6>تاریخ برگشت</h6>
              </div>
              <p>{new Date(tour.endDate).toLocaleDateString("fa-IR")}</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/bus.svg" alt="Origin Icon" width={20} height={20} />
                <h6>حمل و نقل</h6>
              </div>
              <p>{tour.fleetVehicle}</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/profile-2user.svg" alt="Origin Icon" width={20} height={20} />
                <h6>ظرفیت</h6>
              </div>
              <p>حداکثر {digitsEnToFa(tour.availableSeats)} نفر</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.downInfo}>
              <div className={styles.icon}>
                <Image src="/images/security.svg" alt="Origin Icon" width={20} height={20} />
                <h6>بیمه</h6>
              </div>
              <p>{tour.insurance ? "دارد" : "ندارد"}</p>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
      <ToastContainer />
    </div>
  );
}

export default TourInfo;
