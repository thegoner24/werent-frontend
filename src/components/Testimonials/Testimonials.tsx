import React from 'react';
import Image from 'next/image';
import Container from '../ui/Container';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, content, avatar }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden relative mb-3 border-2 border-purple-100 shadow-sm">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mt-1">{role}</p>
        </div>
      </div>
      <div className="relative">
        <svg className="absolute -top-2 -left-1 w-6 h-6 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
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
      name: "Sarah Johnson",
      role: "Professional Photographer",
      content: "CamRent has been a game-changer for my photography business. Their equipment is top-notch and the rental process is seamless.",
      avatar: "/avatar1.svg"
    },
    {
      name: "Michael Chen",
      role: "Film Student",
      content: "As a student, I couldn't afford to buy professional equipment. CamRent allows me to access high-quality gear at affordable prices.",
      avatar: "/avatar2.svg"
    },
    {
      name: "Emily Rodriguez",
      role: "Travel Blogger",
      content: "I've rented from CamRent multiple times for my international trips. Their customer service is exceptional and the gear is always in perfect condition.",
      avatar: "/avatar3.svg"
    },
    {
      name: "David Thompson",
      role: "Wedding Videographer",
      content: "The premium packages from CamRent have everything I need for shooting weddings. Highly recommend their services!",
      avatar: "/avatar4.svg"
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-purple-50">
      <Container>
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl">Hear from photographers and videographers who have experienced our premium camera rental service</p>
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
