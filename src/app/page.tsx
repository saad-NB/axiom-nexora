import { Contact } from './components/Contact';
import { FAQ } from './components/FAQ';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { Process } from './components/Process';
import { Publications } from './components/Publications';
import { Services } from './components/Services';
import { Ticker } from './components/Ticker';
import { Work } from './components/Work';

/**
 * Throws if anything tries to render this page dynamically, which
 * guarantees the whole site is a static export with zero server cost.
 * See DESIGN.md section 11.1.
 */
export const dynamic = 'error';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Services />
      <Work />
      <Publications />
      <Pricing />
      <Process />
      <FAQ />
      <Contact />
    </>
  );
}
