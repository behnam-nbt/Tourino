'use client';
import { useState, useEffect, useRef } from "react";
import moment from "moment-jalaali";
import dynamic from "next/dynamic";
import styles from "./Search.module.css";
import { GrLocation } from "react-icons/gr";
import { IoEarthOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { toast } from "react-toastify";

const DatePicker = dynamic(() =>
  import("zaman").then((mod) => mod.DatePicker),
  { ssr: false }
);

const TravelSearchBox = ({ posts, setFilteredPosts }) => {
  console.log(posts);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [date, setDate] = useState("");
  const [hydrated, setHydrated] = useState(false); // Track hydration state
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const dropdownContainerRef = useRef(null); // Ref to track the dropdown container

  useEffect(() => {
    setHydrated(true); // Mark component as hydrated
  }, []);

  useEffect(() => {
    if (hydrated) {
      const queryParams = new URLSearchParams(window.location.search);
      const origin = queryParams.get("origin") || "";
      const destination = queryParams.get("destination") || "";
      const dateValue = queryParams.get("date") || "";
  
      setOriginInput(origin);
      setDestinationInput(destination);
  
      // Parse the dateValue and set it in the correct format
      if (dateValue) {
        setDate({ value: normalizeDate(dateValue).toISOString().split('T')[0] });
      }
    }
  }, [hydrated]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        originRef.current &&
        !originRef.current.contains(event.target)
      ) {
        setShowOriginDropdown(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const normalizeDate = (dateString) => {
    if (!dateString) {
      return null; // Return null if the date string is invalid or undefined
    }

    let dateObj;

    // Ensure dateString is a string
    const dateStr = String(dateString);

    // Convert Persian date to Gregorian if it's in Persian calendar (e.g., 1403/09/15)
    if (dateStr.includes('/')) {
      // Persian date format (e.g., 1403/09/15)
      dateObj = moment(dateStr, 'jYYYY/jMM/jDD').toDate(); // Convert Persian date to Gregorian
    } else {
      // Assume the date is already in a standard format (e.g., ISO format: 2024-12-01T00:00:00.000Z)
      dateObj = new Date(dateStr);
    }

    // If it's still not a valid date, return null
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    // Return only the date part (without time) for comparison
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  };

  const convertToDate = (dateString) => {
    if (!dateString) return null;

    // Convert the date string to a JavaScript Date object
    const dateObj = new Date(dateString);

    // Check if the conversion was successful
    if (isNaN(dateObj.getTime())) return null;

    // Convert the Date object to the desired format (yyyy-mm-dd)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // Return the date in yyyy-mm-dd format
  };

  const fuzzyMatch = (str1, str2) =>
    str1.toLowerCase().includes(str2.toLowerCase().trim());

  const filterPosts = () =>
    posts.filter((post) => {
      const originMatch = post.origin.name
        .toLowerCase()
        .includes(originInput.trim().toLowerCase());
      const destinationMatch = fuzzyMatch(post.destination.name, destinationInput);

      let dateMatch = true;
      if (date?.value) {
        const postDate = normalizeDate(post.startDate);
        const selectedDate = normalizeDate(date.value);

        // Only compare if both dates are valid
        if (postDate && selectedDate) {
          dateMatch = postDate >= selectedDate;
        } else {
          dateMatch = false; // Invalid date comparison if one is invalid
        }
      }

      return originMatch && destinationMatch && dateMatch;
    });

    const handleSearch = () => {
      const filtered = filterPosts();
      if (filtered.length === 0) {
        setOriginInput("");
        setDestinationInput("");
        setDate("");
        toast.error('هیچ موردی یافت نشد!')
        window.history.replaceState(null, "", window.location.pathname); // Clear URL
      } else {
        setFilteredPosts(filtered);
    
        const queryParams = new URLSearchParams();
        if (originInput) queryParams.set("origin", originInput);
        if (destinationInput) queryParams.set("destination", destinationInput);
    
        // Normalize the date to YYYY-MM-DD before adding to the URL
        if (date?.value) {
          const normalizedDate = normalizeDate(date.value);
          if (normalizedDate) {
            queryParams.set("date", normalizedDate.toISOString().split("T")[0]);
          }
        }
    
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        window.history.pushState(null, "", newUrl); // Update the URL
      }
    };
    

  const filteredOrigins = Array.from(
    new Set(posts.map((post) => post.origin.name))
  ).filter((city) => fuzzyMatch(city, originInput));
  const filteredDestinations = Array.from(
    new Set(posts.map((post) => post.destination.name))
  ).filter((city) => fuzzyMatch(city, destinationInput));

  return hydrated ? (
    <div className={styles.container}>
      <div className={styles.field} ref={originRef}>
        <GrLocation className={styles.icon} />
        <input
          type="text"
          value={originInput}
          placeholder="مبدا"
          onFocus={() => setShowOriginDropdown(true)}
          onChange={(e) => setOriginInput(e.target.value)}
          className={styles.input}
        />
        {showOriginDropdown && (
          <div className={styles.dropdown}>
            <p className={styles.dropdownTitle}>پر تردد</p>
            {filteredOrigins.map((city, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => {
                  setOriginInput(city);
                  setShowOriginDropdown(false);
                }}
              >
                <GrLocation />
                <p>{city}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.field} ref={destinationRef}>
        <IoEarthOutline className={styles.icon} />
        <input
          type="text"
          value={destinationInput}
          placeholder="مقصد"
          onFocus={() => setShowDestinationDropdown(true)}
          onChange={(e) => setDestinationInput(e.target.value)}
          className={styles.input}
        />
        {showDestinationDropdown && (
          <div className={styles.dropdown}>
            <p className={styles.dropdownTitle}>پر تردد</p>
            {filteredDestinations.map((city, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => {
                  setDestinationInput(city);
                  setShowDestinationDropdown(false);
                }}
              >
                <GrLocation />
                <p>{city}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <MdOutlineDateRange className={styles.icon} />
        {DatePicker && (
          <DatePicker
            inputAttributes={{
              placeholder: "تاریخ",
              style: { borderLeft: "none" },
            }}
            accentColor="#28A745"
            onChange={(value) => setDate(value)}
            value={date}
            inputClass={styles.input}
          />
        )}
      </div>

      <button className={styles.button} onClick={handleSearch}>
        جستجو
      </button>
    </div>
  ) : null; // Render null until hydrated
};

export default TravelSearchBox;
