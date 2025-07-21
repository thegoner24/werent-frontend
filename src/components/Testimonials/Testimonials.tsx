import React from 'react';
import Image from 'next/image';
import Container from '../ui/Container';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  event?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, content, avatar, event }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden relative mb-3 border-2 border-[#ff6b98] shadow-sm">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-xs font-medium text-[#ff6b98] bg-[#ff6b98]/10 px-3 py-1 rounded-full inline-block mt-1">{role}</p>
          {event && <p className="text-xs text-gray-500 mt-1">For: {event}</p>}
        </div>
      </div>
      <div className="relative">
        <svg className="absolute -top-2 -left-1 w-6 h-6 text-[#ff6b98]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-600 text-sm pl-6 pr-2">{content}</p>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Jessica Parker",
      role: "Bride-to-be",
      content: "I rented my dream Vera Wang gown for my engagement photos at a fraction of the purchase price. The dress fit perfectly after the complimentary alterations!",
      avatar: "/avatar-woman-1.png",
      event: "Engagement Photoshoot"
    },
    {
      name: "Sophia Williams",
      role: "Corporate Executive",
      content: "As someone who attends many formal events, Dress Boutique Rentals has saved me thousands while allowing me to never wear the same dress twice.",
      avatar: "/avatar-woman-2.png",
      event: "Charity Gala"
    },
    {
      name: "Emma Rodriguez",
      role: "Wedding Guest",
      content: "The Wedding Guest Package was perfect! I received so many compliments on my dress and accessories, and the styling consultation was incredibly helpful.",
      avatar: "/avatar-woman-3.png",
      event: "Beach Wedding"
    },
    {
      name: "Madison Thompson",
      role: "College Student",
      content: "I couldn't afford to buy a designer dress for prom, but renting made it possible to wear my dream dress. The process was so easy and stress-free!",
      avatar: "/avatar-woman-4.png",
      event: "Senior Prom"
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-[#ff6b98]/10">
      <Container>
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl">Hear from women who have experienced our premium dress rental service for their special occasions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
