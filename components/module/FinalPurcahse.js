'use client'

import { useEffect, useState } from 'react';
import styles from './FinalPurchase.module.css'

function FinalPurcahse({ loading, user }) {

    const [userInfoInputs, setUserInfoInputs] = useState({
        surname: user?.surname || "",
        identity: user?.identity || "",
        gender: user?.gender || "مرد", // Default to "مرد" or "زن"
        birthday: user?.birthday || "",
    });

    const handleInputChange = (setInputs) => (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (user?.birthday) {
            const utcDate = new Date(user.birthday); // Parse the UTC date
            const irDate = new Date(utcDate.getTime() + (3.5 * 60 * 60 * 1000)); // Convert to IRST (UTC + 3:30)

            const year = irDate.getFullYear();
            const month = String(irDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
            const day = String(irDate.getDate()).padStart(2, '0'); // Add leading zero if needed

            const formattedDate = `${year}/${month}/${day}`; // Format to YYYY/MM/DD
            setUserInfoInputs(prev => ({ ...prev, birthday: formattedDate }));
        }
    }, [user?.birthday]); // Re-run when `user.birthday` changes

    if (loading) return null;

    return (
        <div className={styles.inputBox}>
            <div className={styles.surname}>
                <input
                    disabled
                    className={styles.customInput}
                    name="surname"
                    value={userInfoInputs.surname}
                    onChange={handleInputChange(setUserInfoInputs)}
                />
            </div>
            <div className={styles.identity}>
                <input
                    disabled
                    className={styles.customInput}
                    name="identity"
                    value={userInfoInputs.identity}
                    onChange={handleInputChange(setUserInfoInputs)}
                />
            </div>
            <div className={styles.birthday}>
                <input
                    disabled
                    className={styles.customInput}
                    name="birthday"
                    value={userInfoInputs.birthday}
                    onChange={handleInputChange(setUserInfoInputs)}
                />
            </div>
            <div className={styles.gender}>
                <select
                    disabled
                    className={styles.customInput}
                    name="gender"
                    value={userInfoInputs.gender}
                    onChange={handleInputChange(setUserInfoInputs)}
                >
                    <option value="مرد">مرد</option>
                    <option value="زن">زن</option>
                </select>
            </div>
        </div>
    )
}

export default FinalPurcahse