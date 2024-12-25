import HomePage from "@/components/template/HomePage";
import { fetchTour } from "@/utils/services";

export const revalidate = 24 * 60 * 60;

export default async function Home() {
  const posts = await fetchTour();
  return (
    <>
      <HomePage posts={posts} />
    </>
  );
}
