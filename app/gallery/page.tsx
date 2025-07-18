import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import { getActiveGalleryItems } from '~/app/actions/public/gallery';

export default async function GalleryPage() {
  // Получаем данные с помощью server action
  const galleryItems = await getActiveGalleryItems();
  
  return (
    <main className="min-h-screen">
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <CategoryFilter />
            <SearchBar />
          </div>
          
          <GalleryGrid initialItems={galleryItems} />
        </div>
      </section>
    </main>
  );
}