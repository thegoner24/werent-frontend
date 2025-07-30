'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Container from '../ui/Container';
import { fetchTestimonials, TestimonialData } from '../../api/testimonials';

interface TestimonialProps {
  id: number;
  rating: number;
  review_message: string;
  created_at: string;
  images: Array<{
    id: number;
    image_base64: string;
  }>;
  user_id: number;
  item_id: number;
}

// Generate a consistent avatar for a user ID
const getAvatarForUser = (userId: number): string => {
  const avatars = ['/avatar1.svg', '/avatar2.svg', '/avatar3.svg', '/avatar4.svg'];
  return avatars[userId % avatars.length];
};

// Generate a consistent user name for a user ID
const getNameForUser = (userId: number): string => {
  const names = [
    'Jessica P.', 'Sophia W.', 'Emma R.', 'Madison T.',
    'Ashley M.', 'Taylor B.', 'Morgan K.', 'Jordan L.',
    'Alex C.', 'Casey D.', 'Riley S.', 'Avery H.'
  ];
  return names[userId % names.length];
};

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  id, 
  rating, 
  review_message, 
  created_at, 
  images, 
  user_id, 
  item_id 
}) => {
  const avatar = getAvatarForUser(user_id);
  const name = getNameForUser(user_id);
  const date = new Date(created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
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
          <p className="text-xs font-medium text-[#ff6b98] bg-[#ff6b98]/10 px-3 py-1 rounded-full inline-block mt-1">Verified Customer</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      
      {/* Review Images */}
      {images.length > 0 && (
        <div className="mb-4 flex justify-center">
          <div className="grid grid-cols-2 gap-2 max-w-32">
            {images.slice(0, 2).map((image) => (
              <div key={image.id} className="w-14 h-14 rounded-lg overflow-hidden relative">
                <Image
                  src={image.image_base64}
                  alt="Review image"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <svg className="absolute -top-2 -left-1 w-6 h-6 text-[#ff6b98]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-600 text-sm pl-6 pr-2">{review_message}</p>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTestimonials();
        if (response.success) {
          // Sort by created_at desc and take latest 4 testimonials
          const sortedTestimonials = response.data
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 4);
          setTestimonials(sortedTestimonials);
        } else {
          setError('Failed to load testimonials');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
        // Fallback to empty array - component will show message
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-white to-[#ff6b98]/10">
        <Container>
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl">Hear from women who have experienced our premium dress rental service for their special occasions</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b98]"></div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-[#ff6b98]/10">
      <Container>
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl">Hear from women who have experienced our premium dress rental service for their special occasions</p>
        </div>
        
        {error && testimonials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Unable to load testimonials at the moment. Please try again later.</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No testimonials available yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${testimonials.length >= 4 ? 'lg:grid-cols-4' : testimonials.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id} 
                id={testimonial.id}
                rating={testimonial.rating}
                review_message={testimonial.review_message}
                created_at={testimonial.created_at}
                images={testimonial.images}
                user_id={testimonial.user_id}
                item_id={testimonial.item_id}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
