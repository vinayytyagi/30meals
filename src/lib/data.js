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

 /**
 * @typedef {object} Message
 * @property {string} id
 * @property {string} text
 * @property {'user' | 'admin'} sender
 * @property {string} timestamp
 * @property {string} userId
 */


const mockUsers = [
  { id: 'user-1', name: 'Ananya Sharma', phone: '9876543210', remainingMeals: 18 },
  { id: 'user-2', name: 'Rohan Verma', phone: '8765432109', remainingMeals: 25 },
  { id: 'user-3', name: 'Priya Singh', phone: '7654321098', remainingMeals: 5 },
];

const mockOrders = [
    // Previous orders
    { id: 'order-1', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: '2023-10-26', status: 'Delivered', deliveryOtp: '112233' },
    { id: 'order-2', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Dinner', mealChoice: '5 Rotis', date: '2023-10-26', status: 'Delivered', deliveryOtp: '445566' },
    { id: 'order-3', userId: 'user-2', userName: 'Rohan Verma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: '2023-10-27', status: 'Pending', deliveryOtp: '778899' },
    { id: 'order-4', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Lunch', mealChoice: '5 Rotis', date: '2023-10-27', status: 'Pending', deliveryOtp: '123123' },
  
    // Add more orders for better analytics
    // Today's date
    { id: 'order-5', userId: 'user-2', userName: 'Rohan Verma', mealType: 'Dinner', mealChoice: '5 Rotis', date: new Date().toISOString().split('T')[0], status: 'Pending', deliveryOtp: '234234' },
    { id: 'order-6', userId: 'user-3', userName: 'Priya Singh', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: new Date().toISOString().split('T')[0], status: 'Pending', deliveryOtp: '345345' },
    
    // Yesterday
    { id: 'order-7', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Delivered', deliveryOtp: '456456' },
    { id: 'order-8', userId: 'user-3', userName: 'Priya Singh', mealType: 'Lunch', mealChoice: '5 Rotis', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Delivered', deliveryOtp: '567567' },
    { id: 'order-9', userId: 'user-3', userName: 'Priya Singh', mealType: 'Dinner', mealChoice: 'Rice + 4 Rotis', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Delivered', deliveryOtp: '678678' },
  
    // Two days ago
    { id: 'order-10', userId: 'user-1', userName: 'Ananya Sharma', mealType: 'Dinner', mealChoice: '5 Rotis', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], status: 'Delivered', deliveryOtp: '789789' },
    { id: 'order-11', userId: 'user-2', userName: 'Rohan Verma', mealType: 'Lunch', mealChoice: 'Rice + 4 Rotis', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], status: 'Delivered', deliveryOtp: '890890' },
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

/** @type {Message[]} */
let mockMessages = [
    { id: 'msg-1', userId: 'user-1', text: 'Hi, I have a question about my order.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg-2', userId: 'user-1', text: 'Sure, how can I help you?', sender: 'admin', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
    { id: 'msg-3', userId: 'user-2', text: 'When will my lunch be delivered?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];


// --- User Functions ---

export const getLoggedInUser = async () => {
  return new Promise(resolve => setTimeout(() => resolve(mockUsers[0]), 500));
};

export const getOrderHistory = async (userId) => {
  const userOrders = mockOrders.filter(order => order.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
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

// --- Analytics Functions ---
export const getAnalyticsData = async (userId = null) => {
    const ordersToProcess = userId ? mockOrders.filter(o => o.userId === userId) : mockOrders;

    const mealsByDate = ordersToProcess.reduce((acc, order) => {
        const date = order.date.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    
    const chartData = Object.entries(mealsByDate).map(([date, meals]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        meals,
    })).slice(-30);

    const mealChoicesCount = ordersToProcess.reduce((acc, order) => {
        acc[order.mealChoice] = (acc[order.mealChoice] || 0) + 1;
        return acc;
    }, {});

    const mostPopularChoice = Object.keys(mealChoicesCount).length > 0
        ? Object.entries(mealChoicesCount).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'N/A';
    
    const totalMeals = ordersToProcess.length;

    const mealsByDayOfWeek = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    ordersToProcess.forEach(order => {
        const day = new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' });
        mealsByDayOfWeek[day]++;
    });
    const weekChartData = Object.entries(mealsByDayOfWeek).map(([day, meals]) => ({ name: day, meals }));

    let currentStreak = 0;
    let maxStreak = 0;
    let lastOrderDate = null;
    const sortedDates = Object.keys(mealsByDate).sort((a,b) => new Date(a) - new Date(b));
    for (const date of sortedDates) {
        const currentDate = new Date(date);
        if (lastOrderDate) {
            const diffDays = (currentDate - lastOrderDate) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                currentStreak++;
            } else {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }
        lastOrderDate = currentDate;
    }
    maxStreak = Math.max(maxStreak, currentStreak);


    const data = {
        totalMeals,
        mostPopularChoice,
        chartData,
        calendarData: mealsByDate,
        recentOrders: ordersToProcess.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
        weekChartData,
        streaks: {
            current: currentStreak,
            max: maxStreak
        },
        mealsUsed: totalMeals, // Simplified for this mock
        mealsSkipped: 0, // Needs logic
    };

    return new Promise(resolve => setTimeout(() => resolve(data), 800));
};


// --- Chat/Notification Functions ---

/**
 * Simulates sending a WhatsApp message.
 * @param {string} phone 
 * @param {string} message 
 */
const sendWhatsAppMessage = async (phone, message) => {
    console.log(`Sending WhatsApp message to ${phone}: "${message}"`);
    return Promise.resolve();
}

/**
 * Sends a message from a specific sender to a list of users.
 * @param {string[]} userIds - An array of user IDs to send the message to.
 * @param {string} messageText - The message from the admin.
 * @param {'user' | 'admin'} sender - Who is sending the message.
 */
export const sendMessageToUsers = async (userIds, messageText, sender) => {
    const recipients = mockUsers.filter(user => userIds.includes(user.id));
    
    const newMessages = recipients.map(user => ({
        id: `msg-${Date.now()}-${user.id}`,
        userId: user.id,
        text: messageText,
        sender: sender,
        timestamp: new Date().toISOString(),
    }));

    mockMessages.push(...newMessages);
    console.log(`Saving ${newMessages.length} new messages.`);

    // Only send WhatsApp for admin broadcasts for this mock
    if (sender === 'admin') {
      for (const user of recipients) {
          await sendWhatsAppMessage(user.phone, messageText);
      }
    }
    
    return new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Get all messages for a specific user.
 * @param {string | null} userId
 * @returns {Promise<Message[]>}
 */
export const getMessages = async (userId) => {
    if (!userId) return Promise.resolve([]);
    const messages = mockMessages.filter(msg => msg.userId === userId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return new Promise(resolve => setTimeout(() => resolve(messages), 300));
};
