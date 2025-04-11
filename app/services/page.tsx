import { Metadata } from 'next';
import Hero from './components/Hero';
import ServicesList from './components/ServicesList';
import PriceTable from './components/PriceTable';
import Process from './components/Process';
import FAQ from './components/FAQ';
import CTA from './components/CTA';

export const metadata: Metadata = {
  title: 'Услуги ателье | DressCutur',
  description: 'Широкий спектр услуг по индивидуальному пошиву одежды, ремонту и реставрации. Высокое качество и индивидуальный подход к каждому клиенту.',
};

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <ServicesList />
      <PriceTable />
      <Process />
      <FAQ />
      <CTA />
    </div>
  );
} 