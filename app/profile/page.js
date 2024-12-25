'use client'
import { useUser } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { updateUserInfo } from "@/utils/services";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { GoPencil } from "react-icons/go";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import styles from './page.module.css';
import { DatePicker } from "zaman";
import moment from "moment-jalaali";

function Profile() {
    const { user, setUser, loading } = useUser();

    const genderMapping = {
        "مرد": "male",
        "زن": "female",
    };

    const genderMappingFromBackend = {
        "male": "مرد",
        "female": "زن",
    };

    const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingBankInfo, setIsEditingBankInfo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userInfoForm = useForm({
        defaultValues: {
            surname: user?.surname || "",
            identity: user?.identity || "",
            gender: user?.gender || "مرد",
            birthday: user?.birthday || "",
        },
        mode: "onBlur", // Trigger validation when field loses focus
        resolver: undefined, // You can use a validation schema here if needed
    });

    const emailForm = useForm({
        defaultValues: { email: user?.email || "" },
    });

    const bankInfoForm = useForm({
        defaultValues: {
            iban: user?.bank?.iban || "",
            cardNumber: user?.bank?.cardNumber || "",
            accountNumber: user?.bank?.accountNumber || "",
        },
    });

    const handleSaveUserInfo = async (data) => {
        try {
            setIsSaving(true);

            const genderToSend = genderMapping[data.gender] || data.gender;
            const payload = {
                ...data,
                gender: genderToSend,
                // Send `birthday` in the Gregorian format (or another format expected by the backend)
                birthday: moment(data.birthday, "YYYY-MM-DD").toISOString(),
            };

            const updatedUser = await updateUserInfo(payload);

            updatedUser.gender = genderMappingFromBackend[updatedUser.gender] || updatedUser.gender;

            setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
            setIsEditingUserInfo(false);
            toast.success("اطلاعات با موفقیت ذخیره شد!");
        } catch (error) {
            console.error("Error updating user info:", error);
            toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
        } finally {
            setIsSaving(false);
        }
    };


    const handleSaveEmail = async ({ email }) => {
        if (!email.trim()) {
            toast.error("ایمیل نمی‌تواند خالی باشد.");
            return;
        }
        try {
            setIsSaving(true);
            const updatedUser = await updateUserInfo({ email });

            setUser((prevUser) => ({ ...prevUser, email: updatedUser.email }));
            setIsEditingEmail(false);
            toast.success("ایمیل با موفقیت ذخیره شد!");
        } catch (error) {
            console.error("Error updating email:", error);
            toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBankInfo = async (data) => {
        if (!bankInfoForm.formState.isValid) {
            const errors = bankInfoForm.formState.errors;
            for (let field in errors) {
                const errorMessage = errors[field]?.message;
                if (errorMessage) {
                    toast.error(errorMessage);
                }
            }
            return;
        }

        try {
            setIsSaving(true);
            const updatedUser = await updateUserInfo({ bank: data });

            setUser((prevUser) => ({ ...prevUser, bank: updatedUser.bank }));
            setIsEditingBankInfo(false);
            toast.success("اطلاعات بانکی با موفقیت ذخیره شد!");
        } catch (error) {
            console.error("Error updating bank info:", error);
            toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
        } finally {
            setIsSaving(false);
        }
    };

    // User Info Form useEffect
    useEffect(() => {
        const genderValue = genderMappingFromBackend[user.gender] || user.gender;
        if (user) {
            userInfoForm.reset({
                surname: user.surname || "",
                identity: user.identity || "",
                gender: genderValue || "مرد",
                birthday: user.birthday || "",
            });
        }
    }, [user, userInfoForm]);

    // Email Form useEffect
    useEffect(() => {
        if (user) {
            emailForm.reset({ email: user.email || "" });
        }
    }, [user, emailForm]);

    // Bank Info Form useEffect
    useEffect(() => {
        if (user && user.bank) {
            bankInfoForm.reset({
                iban: user.bank.iban || "",
                cardNumber: user.bank.cardNumber || "",
                accountNumber: user.bank.accountNumber || "",
            });
        }
    }, [user, bankInfoForm]);

    // Validation rules
    const userInfoValidation = {
        surname: {
            required: "نام و نام خانوادگی الزامی است.",
        },
        identity: {
            required: "کد ملی الزامی است.",
            pattern: {
                value: /^[0-9]{10}$/,
                message: "کد ملی باید 10 رقم باشد.",
            },
        },
        gender: {
            required: "جنسیت الزامی است.",
        },
        birthday: {
            required: "تاریخ تولد الزامی است.",
        },
    };

    const emailValidation = {
        email: {
            required: "ایمیل الزامی است.",
            pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "لطفا یک ایمیل معتبر وارد کنید.",
            },
        },
    };

    const bankInfoValidation = {
        iban: {
            required: "شماره شبا الزامی است.",
            minLength: {
                value: 24,
                message: "شماره شبا باید 24 رقم باشد.",
            },
            maxLength: {
                value: 24,
                message: "شماره شبا باید 24 رقم باشد.",
            },
        },
        cardNumber: {
            required: "شماره کارت الزامی است.",
            minLength: {
                value: 16,
                message: "شماره کارت باید 16 رقم باشد.",
            },
            maxLength: {
                value: 16,
                message: "شماره کارت باید 16 رقم باشد.",
            },
        },
        accountNumber: {
            required: "شماره حساب الزامی است.",
        },
    };

    if (loading) return null;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.accountInfo}>
                <h2>اطلاعات حساب کاربری</h2>
                <div className={styles.accInfoContainer}>
                    <div className={styles.mobileInfo}>
                        <span>شماره موبایل</span>
                        <p>{digitsEnToFa(user.mobile)}</p>
                    </div>
                    <div className={styles.emailInfo}>
                        {!isEditingEmail ? (
                            <>
                                <span>ایمیل</span>
                                <p>{user?.email || "-"}</p>
                                <button onClick={() => setIsEditingEmail(true)} className={styles.editInfo}>
                                    <GoPencil /> {user?.email ? "ویرایش" : "افزودن"}
                                </button>
                            </>
                        ) : (
                            <div className={styles.emailEditContainer}>
                                <form onSubmit={emailForm.handleSubmit(handleSaveEmail)}>
                                    <input
                                        className={`${styles.customInput} ${emailForm.formState.errors.email ? styles.errorBorder : ""}`}
                                        type="email"
                                        {...emailForm.register("email", emailValidation.email)}
                                    />
                                    <button className={styles.submit} type="submit" disabled={isSaving}>
                                        {isSaving ? "در حال ذخیره..." : "تایید"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className={styles.userInfo}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
                    <h2>اطلاعات شخصی</h2>
                    {!isEditingUserInfo && (
                        <button onClick={() => setIsEditingUserInfo(true)} className={styles.editInfo}>
                            <GoPencil /> ویرایش اطلاعات
                        </button>
                    )}
                </div>
                {!isEditingUserInfo ? (
                    <div style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>
                        <div className={styles.top}>
                            <div className={styles.surname}>
                                <span>نام و نام خانوادگی</span>
                                <p>{user?.surname || "-"}</p>
                            </div>
                            <div className={styles.identity}>
                                <span>کد ملی</span>
                                <p>{digitsEnToFa(user?.identity || "-")}</p>
                            </div>
                        </div>
                        <div className={styles.down}>
                            <div className={styles.gender}>
                                <span>جنسیت</span>
                                <p>{genderMappingFromBackend[user.gender] || user.gender}</p>
                            </div>
                            <div className={styles.birthday}>
                                <span>تاریخ تولد</span>
                                {user?.birthday
                                    ? digitsEnToFa(moment(user.birthday).format("jYYYY/jMM/jDD"))
                                    : "-"}
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={userInfoForm.handleSubmit(handleSaveUserInfo)}>
                        <div className={styles.topInput}>
                            <div>
                                <input
                                    placeholder="نام و نام خانوادگی"
                                    className={`${styles.customInput} ${userInfoForm.formState.errors.surname ? styles.errorBorder : ""}`}
                                    {...userInfoForm.register("surname", userInfoValidation.surname)}
                                />
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    placeholder="کد ملی"
                                    className={`${styles.customInput} ${userInfoForm.formState.errors.identity ? styles.errorBorder : ""}`}
                                    {...userInfoForm.register("identity", userInfoValidation.identity)}
                                />
                            </div>
                            <DatePicker
                            accentColor="#28A745"
                                inputClass={`${userInfoForm.formState.errors.birthday ? styles.errorBorder : ""} ${styles.customInput}`}
                                value={
                                    userInfoForm.watch("birthday")
                                        ? moment(userInfoForm.watch("birthday"), "YYYY-MM-DD")
                                            .locale("fa") // Use Persian locale
                                            .format("jYYYY/jMM/jDD") // Proper Jalali date format
                                        : ""
                                }
                                onChange={(selectedDateObj) => {
                                    const selectedDate = selectedDateObj?.value; // Extract the `value` object

                                    if (!selectedDate || !(selectedDate instanceof Date)) {
                                        console.error("Invalid date object received:", selectedDateObj);
                                        return;
                                    }

                                    // Convert Gregorian date to Jalali string
                                    const jalaliDate = moment(selectedDate)
                                        .locale("fa")
                                        .format("jYYYY/jMM/jDD"); // Proper Jalali format

                                    // Convert the Jalali date string to Gregorian
                                    const gregorianDate = moment(jalaliDate, "jYYYY/jMM/jDD")
                                        .locale("en")
                                        .format("YYYY-MM-DD");

                                    if (gregorianDate === "Invalid date") {
                                        console.error("Failed to convert Jalali to Gregorian. Input Jalali Date:", jalaliDate);
                                        return;
                                    }

                                    userInfoForm.setValue("birthday", gregorianDate, { shouldValidate: true });
                                }}
                                calendar="jalali"
                                locale="fa"
                                format="jYYYY/jMM/jDD"
                                placeholder="تاریخ تولد"
                            />



                            <select
                                className={styles.customInput}
                                {...userInfoForm.register("gender")}
                            >
                                <option value="مرد">مرد</option>
                                <option value="زن">زن</option>
                            </select>
                        </div>
                        <div className={styles.btnBox}>
                            <button className={styles.submit} type="submit" disabled={isSaving}>
                                {isSaving ? "در حال ذخیره..." : "تایید"}
                            </button>
                            <button className={styles.cancel} onClick={() => setIsEditingUserInfo(false)}>انصراف</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Bank Info */}
            <div className={styles.bankInfo}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
                    <h2>اطلاعات حساب بانکی</h2>
                    {!isEditingBankInfo && (
                        <button onClick={() => setIsEditingBankInfo(true)} className={styles.editInfo}>
                            <GoPencil /> ویرایش اطلاعات
                        </button>
                    )}
                </div>
                {!isEditingBankInfo ? (
                    <div style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>
                        <div className={styles.top}>
                            <div className={styles.numbers}>
                                <span>شماره شبا</span>
                                <p>{digitsEnToFa(user?.bank?.iban || "-")}</p>
                            </div>
                            <div className={styles.numbers}>
                                <span>شماره کارت</span>
                                <p>{digitsEnToFa(user?.bank?.cardNumber || "-")}</p>
                            </div>
                            <div className={styles.numbers}>
                                <span>شماره حساب</span>
                                <p>{digitsEnToFa(user?.bank?.accountNumber || "-")}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={bankInfoForm.handleSubmit(handleSaveBankInfo)}>
                        <div style={{ width: "100%" }} className={styles.top}>
                            <input
                                className={`${styles.customInput} ${bankInfoForm.formState.errors.iban ? styles.errorBorder : ""}`}
                                {...bankInfoForm.register("iban", bankInfoValidation.iban)}
                            />
                            <input
                                className={`${styles.customInput} ${bankInfoForm.formState.errors.cardNumber ? styles.errorBorder : ""}`}
                                {...bankInfoForm.register("cardNumber", bankInfoValidation.cardNumber)}
                            />
                            <input
                                className={styles.customInput}
                                {...bankInfoForm.register("accountNumber")}
                            />
                        </div>
                        <div className={styles.btnBox}>
                            <button className={styles.submit} type="submit" disabled={isSaving}>
                                {isSaving ? "در حال ذخیره..." : "ذخیره"}
                            </button>
                            <button className={styles.cancel} onClick={() => setIsEditingBankInfo(false)}>انصراف</button>
                        </div>
                    </form>
                )}
            </div>

            <ToastContainer
                position="bottom-right"   // You can change the position as needed
                autoClose={5000}       // Toast will close after 5 seconds
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
            />
        </div>
    );
}

export default Profile;
