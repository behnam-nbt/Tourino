'use client';
import Image from 'next/image';
import styles from './Card.module.css';
import Link from 'next/link';

function Card({ post }) {
  return (
    <div className={styles.card}>
      <Link href={`/tour/${post.id}`}>
        <Image src={post.image} width={1000} height={700} alt={post.title} />
        <div className={styles.title}>
          <h4>{post.title}</h4>
          <p>{post.options.slice(0, 2)}</p>
        </div>
      </Link>
      <div className={styles.reserve}>
        <Link href={`/tour/${post.id}`}>
          رزرو
        </Link>
        <p>{post.price.toLocaleString("fa-IR")} <span>تومان</span></p>
      </div>
    </div>
  );
}

export default Card;
