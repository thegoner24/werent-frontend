# CamRent Website Sitemap

## 1. Home (`/`)
- Introduction to CamRent
- Featured gear
- Hero section with brand logos
- Solution showcase
- Promo section
- Collection preview
- Packages overview
- Customer testimonials
- Offer banner
- Call to action (Rent Now)
- **Status**: ✅ Implemented

## 2. About Us (`/about`)
- Company mission
- How CamRent works
- Why choose CamRent?
- **Status**: 🚧 Planned

## 3. Browse Gear (`/browse`)
- Categories
  - Cameras
  - Lenses
  - Lighting
  - Audio Equipment
  - Tripods & Accessories
- Gear filtering options
  - Price range
  - Equipment type
  - Brand
  - Availability
- Search functionality
- Product grid view
- **Status**: 🚧 Planned

### 3.1. Product Details Page (`/browse/[id]`)
- Equipment specifications
- High-quality images
- Availability calendar
- Pricing details (daily/weekly rates)
- Related equipment suggestions
- Add to cart functionality
- **Status**: 🚧 Planned

## 4. How It Works (`/how-it-works`)
- Step-by-step rental process
- Payment options
- Delivery and pickup information
- Equipment condition guidelines
- **Status**: 🚧 Planned

## 5. Pricing (`/pricing`)
- Rental rate structure
- Time-based pricing (per day, week, month)
- Discount packages for extended rentals
- Membership benefits
- **Status**: 🚧 Planned

## 6. Contact Us (`/contact`)
- Contact form
- Phone number and email
- Office locations
- Business hours
- Support information
- **Status**: 🚧 Planned

## 7. Authentication System
### 7.1. Sign Up (`/signup`)
- User registration form
- Email validation
- Password requirements
- Name and contact information
- Account creation confirmation
- **Status**: ✅ Implemented

### 7.2. Login (`/login`)
- User authentication
- Email/password form
- Remember me option
- Forgot password link
- Social login placeholders (Google/Facebook)
- **Status**: ✅ Implemented

### 7.3. Dashboard (`/dashboard`)
- Personalized welcome message
- Profile information display
- Quick action cards
- Recent activity overview
- Account management links
- **Status**: ✅ Implemented

## 8. User Account Management
### 8.1. Profile Settings (`/profile`)
- Edit personal information
- Change password
- Update contact details
- Account preferences
- **Status**: 🚧 Planned

### 8.2. Order History (`/orders`)
- Past and current rentals
- Order status tracking
- Rental receipts
- Reorder functionality
- **Status**: 🚧 Planned

### 8.3. Payment Methods (`/payment-methods`)
- Saved payment cards
- Add/remove payment methods
- Billing information
- **Status**: 🚧 Planned

### 8.4. Wishlist (`/wishlist`)
- Saved equipment
- Availability notifications
- Quick rental access
- **Status**: 🚧 Planned

## 9. Shopping & Checkout
### 9.1. Shopping Cart (`/cart`)
- Selected equipment review
- Rental period selection
- Quantity adjustments
- Price calculations
- **Status**: 🚧 Planned

### 9.2. Checkout (`/checkout`)
- Rental summary
- Customer information
- Payment processing
- Delivery/pickup options
- Order confirmation
- **Status**: 🚧 Planned

## 10. Customer Support
### 10.1. FAQ (`/faq`)
- Common questions about renting
- Rental policies (cancellations, late fees)
- Equipment care guidelines
- **Status**: 🚧 Planned

### 10.2. Customer Reviews (`/reviews`)
- User testimonials
- Equipment ratings
- Review submission
- **Status**: 🚧 Planned

## 11. Legal & Information
### 11.1. Terms & Conditions (`/terms`)
- Rental agreement
- User responsibilities
- Equipment liability
- **Status**: 🚧 Planned

### 11.2. Privacy Policy (`/privacy`)
- Data collection practices
- Cookie policy
- User rights
- **Status**: 🚧 Planned

### 11.3. Blog (`/blog`) *(Optional)*
- Equipment usage tips
- Photography tutorials
- Industry news
- Gear reviews
- **Status**: 🚧 Future consideration

## 12. Development & Testing
### 12.1. CORS Test (`/test-cors`)
- Backend connectivity testing
- API endpoint validation
- Development debugging tool
- **Status**: ✅ Implemented (Development only)

## Navigation Structure
- **Global Navigation**: Home, About Us, Browse Gear, How It Works, Pricing, Contact
- **Authentication States**:
  - **Not logged in**: Login, Sign up buttons
  - **Logged in**: User greeting, Dashboard link, Logout button
- **Mobile responsive** navigation with hamburger menu
- **Sticky header** with backdrop blur effect

## Technical Implementation Notes
- **Frontend**: Next.js 15.4.2 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context for authentication
- **Authentication**: JWT tokens with localStorage persistence
- **Backend Integration**: RESTful API with CORS support
- **Responsive Design**: Mobile-first approach

## Status Legend
- ✅ **Implemented**: Feature is complete and functional
- 🚧 **Planned**: Feature is designed but not yet implemented
- 🔄 **In Progress**: Feature is currently being developed
- 💡 **Future consideration**: Feature may be added in future iterations
