import Hero from './components/sections/hero/Hero';
import Services from './components/sections/services/Services';
import Testimonials from './components/sections/testimonials/Testimonials';
import Fabrics from './components/sections/fabrics';
import Gallery from './components/sections/gallery';
import Contact from './components/sections/contact';
import { getActiveServices } from './actions/public/services';
import { getActiveTestimonials } from './actions/public/testimonials';
import { getActiveFabrics } from './actions/public/fabrics';
import { getActiveGalleryItems } from './actions/public/gallery';

export default async function Home() {
  // Получение всех данных на серверной стороне
  const services = await getActiveServices();
  const testimonials = await getActiveTestimonials();
  const fabrics = await getActiveFabrics();
  const galleryItems = await getActiveGalleryItems();

  console.log(testimonials);
  return (
    <>
      {/* Hero секция */}
      <Hero />
      
      {/* Секция услуг */}
      <Services services={services} />
      
      {/* Секция тканей */}
      <Fabrics fabrics={fabrics} />
      
      {/* Секция галереи */}
      <Gallery galleryItems={galleryItems} />
      
      {/* Секция отзывов */}
      <Testimonials testimonials={testimonials} />
      
      {/* Секция контактов */}
      <Contact />
    </>
  );
}
