import { db, auth } from './firebase';
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    query, 
    where, 
    addDoc, 
    Timestamp,
    orderBy,
    setDoc,
    writeBatch
} from "firebase/firestore";

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {number} remainingMeals
 * @property {number[]} last5Days
 * @property {string | null} mealStartDate
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

 // --- Seeding Function for Initial Data ---
const seedInitialData = async () => {
    const sabjisCollection = collection(db, 'sabjis');
    const sabjisSnapshot = await getDocs(sabjisCollection);
    if (sabjisSnapshot.empty) {
        console.log("Seeding initial sabjis...");
        const batch = writeBatch(db);
        const allSabjis = [
            { id: 'sabji-1', name: 'Aloo Gobi', description: 'Potatoes and cauliflower' },
            { id: 'sabji-2', name: 'Palak Paneer', description: 'Spinach and cottage cheese' },
            { id: 'sabji-3', name: 'Chole', description: 'Spicy chickpeas' },
            { id: 'sabji-4', name: 'Bhindi Masala', description: 'Spiced okra' },
            { id: 'sabji-5', name: 'Dal Tadka', description: 'Yellow lentils with tempering' },
            { id: 'sabji-6', name: 'Rajma', description: 'Red kidney bean curry'},
        ];
        allSabjis.forEach(sabji => {
            const docRef = doc(db, 'sabjis', sabji.id);
            batch.set(docRef, sabji);
        });
        await batch.commit();
        console.log("Initial sabjis seeded.");
    }
};

// Call seeding function
seedInitialData().catch(console.error);

// --- User Functions ---

export const getLoggedInUser = async () => {
    // In a real app, you'd get the logged-in user's ID from an auth context.
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("User not authenticated");
    }
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
    }
    throw new Error("User not found in database");
};

export const getOrderHistory = async (userId) => {
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTodaysMenu = async () => {
    const menuDoc = await getDoc(doc(db, 'menu', 'todaysMenu'));
    if (menuDoc.exists() && menuDoc.data().items) {
        return menuDoc.data().items;
    }
    return []; // Return empty array if no menu is set for today
};

// --- Admin Functions ---

const _fetchAllOrders = async () => {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const getMealStartDate = (userId, allOrders) => {
    const userOrders = allOrders
        .filter(o => o.userId === userId)
        .sort((a,b) => new Date(a.date) - new Date(b.date));
    return userOrders.length > 0 ? userOrders[0].date : null;
}

const calculateLast5Days = (userId, allOrders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last5DaysData = [];

    for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const mealsOnDay = allOrders.filter(o => o.userId === userId && o.date.startsWith(dateString)).length;
        last5DaysData.push(mealsOnDay);
    }
    return last5DaysData;
};

export const getAllUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // This is inefficient in a real app. You'd typically denormalize this data.
    const allOrders = await _fetchAllOrders(); 

    const usersWithData = users.map(user => ({
        ...user,
        last5Days: calculateLast5Days(user.id, allOrders),
        mealStartDate: getMealStartDate(user.id, allOrders),
    }));

    return usersWithData;
};

export const getAllOrders = async () => {
    return await _fetchAllOrders();
};

export const getAllSabjis = async () => {
    const sabjisCollection = collection(db, 'sabjis');
    const sabjisSnapshot = await getDocs(sabjisCollection);
    return sabjisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const setTodaysMenu = async (menuItems) => {
    await setDoc(doc(db, "menu", "todaysMenu"), { items: menuItems });
}

// --- Analytics Functions ---
export const getAnalyticsData = async (userId = null) => {
    const allOrders = await _fetchAllOrders();
    const ordersToProcess = userId ? allOrders.filter(o => o.userId === userId) : allOrders;
    
    // For admin view, we might want to get all users data
    const allUsers = userId ? null : await getAllUsers();

    const mealsByDate = ordersToProcess.reduce((acc, order) => {
        const date = order.date.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    
    const chartData = Object.entries(mealsByDate).map(([date, meals]) => ({
        name: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
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
        recentOrders: ordersToProcess.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
        allUsers, // This will be null if a userId is provided
        weekChartData,
        streaks: {
            current: currentStreak,
            max: maxStreak
        },
        mealsUsed: totalMeals, // Simplified for this mock
        mealsSkipped: 0, // Needs logic
    };

    return data;
};


// --- Chat/Notification Functions ---

/**
 * Simulates sending a WhatsApp message.
 * @param {string} phone 
 * @param {string} message 
 */
const sendWhatsAppMessage = async (phone, message) => {
    // In a real app, this would call a service like Twilio.
    console.log(`Simulating WhatsApp message to ${phone}: "${message}"`);
    return Promise.resolve();
}

/**
 * Sends a message from a specific sender to a list of users.
 * @param {string[]} userIds - An array of user IDs to send the message to.
 * @param {string} messageText - The message from the admin.
 * @param {'user' | 'admin'} sender - Who is sending the message.
 */
export const sendMessageToUsers = async (userIds, messageText, sender) => {
    const allUsers = await getAllUsers();
    const recipients = allUsers.filter(user => userIds.includes(user.id));
    
    const messagesCollection = collection(db, 'messages');

    const messagePromises = recipients.map(user => {
        return addDoc(messagesCollection, {
            userId: user.id,
            text: messageText,
            sender: sender,
            timestamp: Timestamp.now(),
        });
    });

    await Promise.all(messagePromises);

    // Only send WhatsApp for admin broadcasts for this mock
    if (sender === 'admin') {
      for (const user of recipients) {
          await sendWhatsAppMessage(user.phone, messageText);
      }
    }
};

/**
 * Get all messages for a specific user.
 * @param {string | null} userId
 * @returns {Promise<Message[]>}
 */
export const getMessages = async (userId) => {
    if (!userId) return [];
    
    const messagesQuery = query(
        collection(db, 'messages'), 
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(messagesQuery);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate().toISOString(),
        }
    });
};
