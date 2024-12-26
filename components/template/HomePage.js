'use client';
import { useState, useEffect } from "react";
import styles from './HomePage.module.css';
import Banner from '../module/Banner';
import Search from '../module/Search';
import Card from '../module/Card';
import ContactSection from '../module/ContactSection';
import WhyTorino from '../module/WhyTorino';
import { digitsEnToFa } from "@persian-tools/persian-tools";
import Services from "../module/Services";

import { MdKeyboardArrowDown } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

function HomePage({ posts }) {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [showCount, setShowCount] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const origin = queryParams.get('origin') || '';
    const destination = queryParams.get('destination') || '';
    const date = queryParams.get('date') || '';

    const initialFilteredPosts = posts.filter(post => {
      const originMatch = post.origin.name.toLowerCase().includes(origin.toLowerCase());
      const destinationMatch = post.destination.name.toLowerCase().includes(destination.toLowerCase());
      const dateMatch = date ? new Date(post.startDate) >= new Date(date) : true;
      return originMatch && destinationMatch && dateMatch;
    });

    setFilteredPosts(initialFilteredPosts);
  }, [posts]);

  useEffect(() => {
    // Update the `isMobile` state based on the screen size
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initialize the value on first render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShowMore = () => {
    setShowCount(showCount + 4);
  };

  return (
    <div className={styles.mainContainer}>
      <Banner />
      <div className={styles.pageTitle}>
        <h2><span>تورینو</span> برگزار کننده بهترین تورهای داخلی و خارجی</h2>
      </div>
      <Search posts={posts} setFilteredPosts={setFilteredPosts} />
      <div className={styles.container}>
        <div>
          {filteredPosts.length > 0 && filteredPosts.length === posts.length ? (
            <h2>همه تور ها</h2>
          ) : (
            <h2>{digitsEnToFa(filteredPosts.length)} تور برای شما پیدا شد</h2>
          )}
        </div>
        <div className={styles.cardContainer}>
          {filteredPosts.slice(0, isMobile ? showCount : filteredPosts.length).map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
        {isMobile && showCount < filteredPosts.length && (
          <button className={styles.showMoreButton} onClick={handleShowMore}>مشاهده بیشتر<MdKeyboardArrowDown />&nbsp;</button>
        )}
        <ContactSection />
        <WhyTorino />
      </div>
      <Services />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default HomePage;
