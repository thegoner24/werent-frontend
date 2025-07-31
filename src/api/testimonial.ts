// Simple mock testimonial API route
import { NextApiRequest, NextApiResponse } from 'next';

const testimonials = [
  {
    review_message: "This is a new test comment!",
    created_at: "2025-07-31T08:35:54.278Z",
    id: 1,
    images: [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Kk2cAAAAASUVORK5CYII=",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Kk2cAAAAASUVORK5CYII="
    ],
    item_id: 1,
    rating: 5,
    service_id: 1,
    updated_at: "2025-07-31T08:35:54.278Z",
    user_full_name: "John Doe",
    user_id: 1
  },
  {
    review_message: "Another updated testimonial comment.",
    created_at: "2025-07-30T10:15:44.278Z",
    id: 2,
    images: [],
    item_id: 2,
    rating: 4,
    service_id: 2,
    updated_at: "2025-07-30T10:15:44.278Z",
    user_full_name: "Jane Smith",
    user_id: 2
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(testimonials);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
