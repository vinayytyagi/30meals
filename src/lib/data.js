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

/** @type {Message[]} */
let mockMessages = [
    { id: 'msg-1', userId: 'user-1', text: 'Hi, I have a question about my order.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg-2', userId: 'user-1', text: 'Sure, how can I help you?', sender: 'admin', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
];


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
 * Sends a message from the admin to a list of users.
 * @param {string[]} userIds - An array of user IDs to send the message to.
 * @param {string} messageText - The message from the admin.
 */
export const sendMessageToUsers = async (userIds, messageText) => {
    const recipients = mockUsers.filter(user => userIds.includes(user.id));
    
    const newMessages = recipients.map(user => ({
        id: `msg-${Date.now()}-${user.id}`,
        userId: user.id,
        text: messageText,
        sender: 'admin',
        timestamp: new Date().toISOString(),
    }));

    mockMessages.push(...newMessages);

    for (const user of recipients) {
        await sendWhatsAppMessage(user.phone, messageText);
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

/**
 * Sends a message from a user to the admin.
 * @param {string} userId
 * @param {string} messageText
 * @returns {Promise<Message>}
 */
export const sendMessage = async (userId, messageText) => {
    const newMessage = {
        id: `msg-${Date.now()}`,
        userId,
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString(),
    };
    mockMessages.push(newMessage);
    
    console.log(`New message from ${userId}: "${messageText}"`);

    // Simulate an admin auto-reply for demonstration
    setTimeout(() => {
        const autoReply = {
            id: `msg-${Date.now() + 1}`,
            userId,
            text: "Thanks for your message. An admin will get back to you shortly.",
            sender: 'admin',
            timestamp: new Date().toISOString(),
        };
        mockMessages.push(autoReply);
    }, 2000);

    return new Promise(resolve => setTimeout(() => resolve(newMessage), 200));
};
