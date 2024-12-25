'use client';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./Search.module.css";
import { GrLocation } from "react-icons/gr";
import { IoEarthOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { DatePicker } from "zaman";

const TravelSearchBox = ({ posts }) => {
    const searchParams = useSearchParams(); // Access query parameters
    const queryOrigin = searchParams.get("origin") || ""; // Read `origin` parameter
    const queryDestination = searchParams.get("destination") || ""; // Read `destination` parameter
    const queryDate = searchParams.get("date") || ""; // Read `date` parameter

    const [originInput, setOriginInput] = useState(queryOrigin);
    const [destinationInput, setDestinationInput] = useState(queryDestination);
    const [date, setDate] = useState(queryDate ? { value: queryDate } : ""); // Initialize with the date in the query
    const [filteredOrigins, setFilteredOrigins] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState({ origin: false, destination: false });
    const [filteredPosts, setFilteredPosts] = useState(posts); // Ensure filteredPosts is initialized properly

    const allOrigins = [...new Set(posts.map((post) => post.origin.name))];
    const allDestinations = [...new Set(posts.map((post) => post.destination.name))];

    const normalizeGregorianDate = (gregorianDate) => new Date(gregorianDate).toISOString().split("T")[0]; // Normalize date format for comparison

    // Handle the search logic
    const handleSearch = (e) => {
        e.preventDefault();

        const results = posts.filter((post) => {
            const originMatch = post.origin.name.toLowerCase().includes(originInput.toLowerCase());
            const destinationMatch = post.destination.name.toLowerCase().includes(destinationInput.toLowerCase());
            const normalizedPostDate = normalizeGregorianDate(post.startDate);
            const dateMatch = date && date.value ? normalizedPostDate === normalizeGregorianDate(date.value) : true;

            return originMatch && destinationMatch && dateMatch;
        });

        setFilteredPosts(results);

        const query = new URLSearchParams({
            origin: originInput,
            destination: destinationInput,
            date: date?.value ? normalizeGregorianDate(date.value) : "",
        }).toString();

        window.history.pushState(null, "", `/?${query}`);
    };

    // Effect to handle the date state initialization from query
    useEffect(() => {
        // Initialize date from query params if not already set
        if (queryDate && date?.value !== queryDate) {
            setDate({ value: queryDate });
        }
    }, [queryDate, date?.value]); // Runs only if queryDate or date value changes

    // Handle visibility and filtering of dropdown options
    const handleDropdownVisibility = (type) => {
        setDropdownVisible((prevState) => ({
            ...prevState,
            [type]: true,
        }));

        // Filter the cities for the dropdown based on the user's input
        if (type === "origin") {
            setFilteredOrigins(allOrigins.filter((city) => city.toLowerCase().includes(originInput.toLowerCase())));
        } else if (type === "destination") {
            setFilteredDestinations(allDestinations.filter((city) => city.toLowerCase().includes(destinationInput.toLowerCase())));
        }
    };

    const closeDropdowns = () => {
        setDropdownVisible({ origin: false, destination: false });
    };

    return (
        <div className={styles.container} onClick={closeDropdowns}>
            <div className={styles.field} onClick={(e) => e.stopPropagation()}>
                <GrLocation className={styles.icon} />
                <input
                    type="text"
                    value={originInput}
                    placeholder="مبدا"
                    onFocus={() => handleDropdownVisibility("origin")}
                    onChange={(e) => setOriginInput(e.target.value)} // Update input on change
                    className={styles.input}
                />
                {dropdownVisible.origin && filteredOrigins.length > 0 && (
                    <ul className={styles.dropdown}>
                        {filteredOrigins.map((city, index) => (
                            <li
                                key={index}
                                onMouseDown={() => {
                                    setOriginInput(city);
                                    setDropdownVisible({ ...dropdownVisible, origin: false });
                                }}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.field} onClick={(e) => e.stopPropagation()}>
                <IoEarthOutline className={styles.icon} />
                <input
                    type="text"
                    value={destinationInput}
                    placeholder="مقصد"
                    onFocus={() => handleDropdownVisibility("destination")}
                    onChange={(e) => setDestinationInput(e.target.value)} // Update input on change
                    className={styles.input}
                />
                {dropdownVisible.destination && filteredDestinations.length > 0 && (
                    <ul className={styles.dropdown}>
                        {filteredDestinations.map((city, index) => (
                            <li
                                key={index}
                                onMouseDown={() => {
                                    setDestinationInput(city);
                                    setDropdownVisible({ ...dropdownVisible, destination: false });
                                }}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.field}>
                <MdOutlineDateRange className={styles.icon} />
                <DatePicker
                    inputAttributes={{ placeholder: "تاریخ", style: { borderLeft: "none" } }}
                    onChange={(value) => setDate(value)}
                    value={date}
                    inputClass={styles.input}
                />
            </div>

            <button className={styles.button} onClick={handleSearch}>
                جستجو
            </button>

            {/* Show no results message if no posts are found */}
            {filteredPosts.length === 0 && <div className={styles.noResults}>هیچ داده‌ای یافت نشد!</div>}
        </div>
    );
};

export default TravelSearchBox;
