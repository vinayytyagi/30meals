/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {number} remainingMeals
 */

/**
 * @typedef {'Lunch' | 'Dinner'} MealType
 */

/**
 * @typedef {'Rice + 4 Rotis' | '5 Rotis'} MealChoice
 */

/**
 * @typedef {'Pending' | 'Delivered'} OrderStatus
 */

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {MealType} mealType
 * @property {MealChoice} mealChoice
 * @property {string} date
 * @property {OrderStatus} status
 * @property {string} deliveryOtp
 */

/**
 * @typedef {object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */


const mockUsers = [
  { id: 'user-1', name: 'Ananya Sharma', phone: '9876543210', remainingMeals: 18 },
  { id: 'user-2', name: 'Rohan Verma', phone: '8765432109', remainingMeals: 25 },
  { id: 'user-3', name: 'Priya Singh', phone: '7654321098', remainingMeals: 5 },
];

const mockOrders = [
  { id: 'order-1', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: '2023-10-26', status: 'Delivered', deliveryOtp: '112233' },
  { id: 'order-2', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Dinner', mealChoice: '5 Rotis', date: '2023-10-26', status: 'Delivered', deliveryOtp: '445566' },
  { id: 'order-3', userId: 'user-2', userName: 'Rohan Verma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: '2023-10-27', status: 'Pending', deliveryOtp: '778899' },
  { id: 'order-4', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Lunch', mealChoice: '5 Rotis', date: '2023-10-27', status: 'Pending', deliveryOtp: '123123' },
];

const allSabjis = [
    { id: 'sabji-1', name: 'Aloo Gobi', description: 'Potatoes and cauliflower' },
    { id: 'sabji-2', name: 'Palak Paneer', description: 'Spinach and cottage cheese' },
    { id: 'sabji-3', name: 'Chole', description: 'Spicy chickpeas' },
    { id: 'sabji-4', name: 'Bhindi Masala', description: 'Spiced okra' },
    { id: 'sabji-5', name: 'Dal Tadka', description: 'Yellow lentils with tempering' },
    { id: 'sabji-6', name: 'Rajma', description: 'Red kidney bean curry'},
];

let todaysMenu = [allSabjis[1], allSabjis[4]];

// --- User Functions ---

export const getLoggedInUser = async () => {
  return new Promise(resolve => setTimeout(() => resolve(mockUsers[0]), 500));
};

export const getOrderHistory = async (userId) => {
  const userOrders = mockOrders.filter(order => order.userId === userId);
  return new Promise(resolve => setTimeout(() => resolve(userOrders), 500));
};

export const getTodaysMenu = async () => {
  return new Promise(resolve => setTimeout(() => resolve(todaysMenu), 300));
};

// --- Admin Functions ---

export const getAllUsers = async () => {
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 500));
};

export const getAllOrders = async () => {
    return new Promise(resolve => setTimeout(() => resolve(mockOrders), 500));
};

export const getAllSabjis = async () => {
    return new Promise(resolve => setTimeout(() => resolve(allSabjis), 200));
}

export const setTodaysMenu = async (menuItems) => {
    return new Promise(resolve => {
        setTimeout(() => {
            todaysMenu = menuItems;
            resolve();
        }, 500)
    });
}
