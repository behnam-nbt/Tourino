'use client';
import React, { useEffect, useState } from 'react';
import { fetchUserTransaction } from '@/utils/services';
import { formatDateTime, translateTypeOfTransaction } from '@/helper/helper';
import styles from './page.module.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchUserTransaction();
        setTransactions(res);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {transactions.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>تاریخ و ساعت</th>
              <th className={styles.headerCell}>مبلغ (تومان)</th>
              <th className={styles.headerCell}>نوع تراکنش</th>
              <th className={`${styles.headerCell} ${styles.orderNumberHeader}`}>
                شماره سفارش
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className={styles.row}>
              <td className={`${styles.cell} ${styles.createdAtCell}`}>
                {formatDateTime(transaction.createdAt)}
              </td>
              <td className={`${styles.cell} ${styles.amountCell}`}>
                {transaction.amount.toLocaleString('fa-IR')}
              </td>
              <td className={`${styles.cell} ${styles.typeCell}`}>
                {translateTypeOfTransaction(transaction.type)}
              </td>
              <td className={`${styles.cell} ${styles.orderNumberCell}`}>
                {transaction.orderNumber}
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyMessage}>هیچ تراکنشی یافت نشد.</p>
      )}
    </div>
  );
}

export default Transaction;

