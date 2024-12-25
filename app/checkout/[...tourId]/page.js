import { digitsEnToFa } from '@persian-tools/persian-tools';
import { fetchTourById } from "@/utils/services";
import { cookies } from 'next/headers';
import CheckOutClient from '@/components/module/CheckOutClient';

async function CheckOut({ params }) {
  const storedCookie = cookies();
  const token = storedCookie.get('accessToken');
  const { tourId } = params;

  const tour = await fetchTourById(tourId);

  // Calculate travel duration
  const startDate = new Date(tour.startDate);
  const endDate = new Date(tour.endDate);
  const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const durationInNights = durationInDays - 1;
  const faDurationInNights = digitsEnToFa(durationInNights);
  const faDurationInDays = digitsEnToFa(durationInDays);

  return (
    <CheckOutClient 
      token={token} 
      tour={tour} 
      duration={{ faDurationInDays, faDurationInNights }} 
    />
  );
}

export default CheckOut;
