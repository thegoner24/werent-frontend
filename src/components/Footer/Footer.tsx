import React from 'react';
import Link from 'next/link';
import Container from '../ui/Container';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <Link 
      href={href} 
      className="text-gray-600 hover:text-[#ff6b98] transition-all duration-300 text-sm flex items-center group"
    >
      <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
    </Link>
  );
};

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="mb-8 md:mb-0">
      <h3 className="font-semibold text-gray-800 mb-5 text-lg">
        <span className="relative">
          {title}
          <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90"></span>
        </span>
      </h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Footer() {
  const browseLinks = [
    { label: 'Evening Gowns', href: '/category/evening-gowns' },
    { label: 'Cocktail Dresses', href: '/category/cocktail-dresses' },
    { label: 'Wedding Attire', href: '/category/wedding-attire' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'Designer Collections', href: '/category/designer-collections' }
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' }
  ];

  const featuredLinks = [
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Designer Spotlight', href: '/designer-spotlight' },
    { label: 'Special Offers', href: '/special-offers' },
    { label: 'Gift Cards', href: '/gift-cards' }
  ];

  return (
    <footer className="w-full py-16 bg-gradient-to-b from-white to-pink-50 border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center mb-6">
              <span className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent">Dress</span>
                <span className="text-gray-800">Boutique</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">
              The premier destination for designer dress rentals. Elevate your style for any occasion with our curated collection of luxury dresses at affordable rental prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-[#ff6b98] hover:shadow-md transition-all duration-300 group">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-[#ff6b98] hover:shadow-md transition-all duration-300 group">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-[#ff6b98] hover:shadow-md transition-all duration-300 group">
                <span className="sr-only">Pinterest</span>
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0a12 12 0 00-4.373 23.178c-.018-.42-.033-.97-.033-1.358 0-1.5.283-2.543 1.035-3.31.75-.767 1.725-1.156 2.9-1.156 1.035 0 1.97.285 2.802.855.833.57 1.432 1.312 1.798 2.225.366.913.55 1.871.55 2.873 0 .972-.127 1.922-.38 2.85-.254.93-.618 1.745-1.092 2.448-.474.703-1.052 1.27-1.735 1.703-.684.433-1.46.65-2.33.65-1.297 0-2.345-.6-3.145-1.8-.8-1.2-1.2-2.85-1.2-4.95 0-2.4.4-4.95 1.2-7.65.8-2.7 1.903-5.2 3.31-7.5C13.51 4.2 15.167 2 17.073 0 14.775 0 12.648.583 10.69 1.75 8.732 2.917 7.103 4.533 5.8 6.6c-1.303 2.067-2.31 4.45-3.02 7.15C2.07 16.45 1.715 19.367 1.715 22.5c0 .5.018.917.055 1.25.036.333.054.617.054.85.4.1.9.183.15.25.6.067.09.133.09.2 0 .133-.036.25-.109.35-.072.1-.127.15-.163.15-.036 0-.082-.033-.136-.1a.36.36 0 01-.082-.2c-1.03-1.033-1.825-2.233-2.384-3.6C.545 20.033.273 18.6.273 17.1c0-2.8.49-5.417 1.47-7.85.982-2.433 2.328-4.55 4.038-6.35C7.49 1.1 9.455.033 11.673.033c.072 0 .163-.008.272-.025A.555.555 0 0112.218 0H12z" />
                  <path d="M9.5 15.843c.4.5.917.75 1.55.75.5 0 .95-.133 1.35-.4.4-.267.717-.617.95-1.05.233-.433.35-.9.35-1.4 0-.533-.127-1.017-.38-1.45-.253-.433-.584-.775-.993-1.025-.41-.25-.86-.375-1.352-.375-.6 0-1.125.208-1.575.625-.45.417-.675.958-.675 1.625 0 .5.108.958.325 1.375.217.417.45.742.7.975.25.233.375.367.375.4 0 .167-.058.483-.175.95-.117.467-.175.75-.175.85 0 .2.075.3.225.3.1 0 .275-.133.525-.4.25-.267.47-.583.66-.95.19-.367.345-.717.465-1.05.12-.333.18-.567.18-.7 0-.133-.067-.258-.2-.375-.133-.117-.2-.258-.2-.425 0-.2.067-.375.2-.525.133-.15.3-.225.5-.225.267 0 .483.117.65.35.167.233.25.517.25.85 0 .933-.383 1.783-1.15 2.55-.767.767-1.633 1.15-2.6 1.15-.833 0-1.508-.275-2.025-.825-.517-.55-.775-1.258-.775-2.125 0-1.033.35-1.958 1.05-2.775.7-.817 1.567-1.225 2.6-1.225.9 0 1.625.275 2.175.825.55.55.825 1.258.825 2.125 0 .3-.05.517-.15.65-.1.133-.25.2-.45.2-.167 0-.308-.05-.425-.15a.481.481 0 01-.175-.375c0-.1.025-.25.075-.45.05-.2.075-.35.075-.45 0-.5-.175-.925-.525-1.275-.35-.35-.825-.525-1.425-.525-.7 0-1.275.25-1.725.75-.45.5-.675 1.125-.675 1.875 0 .667.167 1.192.5 1.575z" />
                </svg>
              </a>
            </div>
          </div>
          
          <FooterColumn title="Browse Collection" links={browseLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Featured" links={featuredLinks} />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} <span className="font-medium">Dress Boutique</span>. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-[#ff6b98] text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-[#ff6b98] text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-[#ff6b98] text-sm transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
