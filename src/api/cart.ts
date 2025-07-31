export interface CartItem {
  id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  item_name?: string;
  item_brand?: string;
  item_image?: string;
  rental_days: number;
  booking_id?: number; // Optional booking ID for items added from bookings
}

export interface AddToCartPayload {
  item_id: string;
  start_date: string;
  end_date: string;
  item_name?: string;
  item_brand?: string;
  item_image?: string;
  daily_price: number;
  booking_id?: number; // Optional booking ID for items added from bookings
}

const CART_STORAGE_KEY = 'werent_cart';

// Helper function to calculate rental days
const calculateRentalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to generate unique cart item ID
const generateCartItemId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

// Save cart items to localStorage
const saveCartItems = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart items:', error);
    throw error;
  }
};

// Add item to cart (frontend-only)
export const addToCart = (payload: AddToCartPayload): Promise<CartItem> => {
  return new Promise((resolve, reject) => {
    try {
      const cartItems = getCartItems();
      const rentalDays = calculateRentalDays(payload.start_date, payload.end_date);
      const totalPrice = payload.daily_price * rentalDays;
      
      // Check if item with same dates already exists
      const existingItemIndex = cartItems.findIndex(
        item => item.item_id === payload.item_id && 
                item.start_date === payload.start_date && 
                item.end_date === payload.end_date
      );
      
      if (existingItemIndex !== -1) {
        reject(new Error('Item with these dates is already in cart'));
        return;
      }
      
      const newCartItem: CartItem = {
        id: generateCartItemId(),
        item_id: payload.item_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        total_price: totalPrice,
        item_name: payload.item_name,
        item_brand: payload.item_brand,
        item_image: payload.item_image,
        rental_days: rentalDays,
        booking_id: payload.booking_id // Include booking ID if provided
      };
      
      cartItems.push(newCartItem);
      saveCartItems(cartItems);
      resolve(newCartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      reject(error);
    }
  });
};

// Remove item from cart
export const removeFromCart = (cartItemId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const cartItems = getCartItems();
      const filteredItems = cartItems.filter(item => item.id !== cartItemId);
      saveCartItems(filteredItems);
      resolve();
    } catch (error) {
      console.error('Error removing from cart:', error);
      reject(error);
    }
  });
};

// Clear entire cart
export const clearCart = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      resolve();
    } catch (error) {
      console.error('Error clearing cart:', error);
      reject(error);
    }
  });
};

// Get cart total
export const getCartTotal = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.total_price, 0);
};

// Get cart item count
export const getCartItemCount = (): number => {
  return getCartItems().length;
};

// Check if item with specific dates is already in cart
export const isItemInCart = (itemId: string, startDate: string, endDate: string): boolean => {
  try {
    const cartItems = getCartItems();
    return cartItems.some(item => 
      item.item_id === itemId && 
      item.start_date === startDate && 
      item.end_date === endDate
    );
  } catch (error) {
    console.error('Error checking if item is in cart:', error);
    return false;
  }
};

// Get cart item by item ID and dates
export const getCartItemByDetails = (itemId: string, startDate: string, endDate: string): CartItem | null => {
  try {
    const cartItems = getCartItems();
    return cartItems.find(item => 
      item.item_id === itemId && 
      item.start_date === startDate && 
      item.end_date === endDate
    ) || null;
  } catch (error) {
    console.error('Error getting cart item by details:', error);
    return null;
  }
};

// Update cart item
export const updateCartItem = (cartItemId: string, updates: Partial<CartItem>): Promise<CartItem> => {
  return new Promise((resolve, reject) => {
    try {
      const cartItems = getCartItems();
      const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
      
      if (itemIndex === -1) {
        reject(new Error('Cart item not found'));
        return;
      }
      
      cartItems[itemIndex] = { ...cartItems[itemIndex], ...updates };
      saveCartItems(cartItems);
      resolve(cartItems[itemIndex]);
    } catch (error) {
      console.error('Error updating cart item:', error);
      reject(error);
    }
  });
};