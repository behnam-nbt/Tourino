'use client'
import { useState, useEffect } from 'react';
import { fetchUserTours } from '@/utils/services'; // Assuming this fetches the user's tours
import styles from './page.module.css';

import { GiCommercialAirplane } from "react-icons/gi";
import { LuShip } from "react-icons/lu";
import { PiTrainLight } from "react-icons/pi";
import { IoBus } from "react-icons/io5";
import { IoCarOutline } from "react-icons/io5";
import { WiSunrise } from "react-icons/wi";
import { digitsEnToFa } from '@persian-tools/persian-tools';

function MyTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tours when the component mounts
    const fetchTours = async () => {
      try {
        const fetchedTours = await fetchUserTours();
        setTours(fetchedTours);
      } catch (err) {
        setError('خطا در دریافت لیست تورها!');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const getDayOfWeek = (date) => {
    const options = { weekday: 'long' };
    return new Date(date).toLocaleDateString('fa-IR', options); // Convert to Persian weekday name
  };

  const formatPersianDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Use long month name
    return new Date(date).toLocaleDateString('fa-IR', options);
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType.toLowerCase()) {
      case 'اتوبوس':
        return <IoBus />;
      case 'قطار':
        return <PiTrainLight />;
      case 'کشتی':
        return <LuShip />;
      case 'هواپیما':
        return <GiCommercialAirplane />;
      case 'سواری':
      case 'ون':
        return <IoCarOutline />
    }
  }

  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!tours || tours.length === 0) {
    return <div className={styles.empty}>هیچ توری یافت نشد!</div>;
  }

  return (
    <div className={styles.container}>
      {tours.map((tour) => (
        <div key={tour.id} className={styles.box}>
          <div className={styles.boxHeader}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <WiSunrise style={{ fontSize: "24px", marginLeft: "0.5rem" }} />
              <h3>{tour.title}</h3>
            </div>
            <div className={styles.vehicle}>
              <span>{getVehicleIcon(tour.fleetVehicle)}</span>
              <p>سفر با {tour.fleetVehicle}</p>
            </div>
            <div className={styles.situation}>
              {tour.availableSeats > 0 ? <span style={{ backgroundColor: "#28A7454D", color: "#28A745" }}>در حال برگزاری</span>
                : <span style={{ backgroundColor: "#D1B9004D", color: "#D1B900" }}>به اتمام رسیده</span>}
            </div>
          </div>
          <div className={styles.destination}>
            <div className={styles.destName}>
              <h2>{tour.origin.name} به {tour.destination.name}</h2>
              <p>{getDayOfWeek(tour.startDate)} {formatPersianDate(tour.startDate)}</p>
            </div>
            <div className={styles.endDate}>
              <h2>تاریخ برگشت</h2>
              <p>{getDayOfWeek(tour.endDate)} {formatPersianDate(tour.endDate)}</p>
            </div>
          </div>
          <div className={styles.downSection}>
            <div className={styles.tourNumber}>
              <span>شماره تور</span>
              <p>{digitsEnToFa(tour.tourNumber)}</p>
            </div>
            <div className={styles.price}>
              <span>مبلغ پرداخت شده</span>
              <p>{tour.price.toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyTours;
