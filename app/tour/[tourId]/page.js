import TourInfo from "@/components/template/TourInfo";
import { fetchTour, fetchTourById } from "@/utils/services";
import { cookies } from "next/headers";

export const revalidate = 24 * 60 * 60;

export async function generateStaticParams() {
  const tours = await fetchTour();

  return tours.map((tour) => ({
    tourId: tour.id.toString(),
  }))
}

async function TourDetails({ params }) {
  const storedCookie = cookies();
  const token = storedCookie.get('accessToken')?.value;

  const { tourId } = await params;
  const tour = await fetchTourById(tourId);

  return (
    <TourInfo tour={tour} token={token} />
  )
}

export default TourDetails