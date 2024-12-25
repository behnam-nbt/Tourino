import TourInfo from "@/components/template/TourInfo";
import { fetchTour, fetchTourById } from "@/utils/services";


export const revalidate = 24 * 60 * 60;

export async function generateStaticParams() {
  try {
    const tours = await fetchTour();
    if (!Array.isArray(tours)) {
      throw new Error("Invalid response from fetchTour()");
    }

    return tours.map((tour) => ({
      tourId: tour.id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];  // Return an empty array in case of error
  }
}


async function TourDetails({ params }) {

  const { tourId } = await params;
  const tour = await fetchTourById(tourId);

  return (
    <TourInfo tour={tour} />
  )
}

export default TourDetails