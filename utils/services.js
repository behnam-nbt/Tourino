import api from "@/api/api";

export const fetchTour = async () => {
  try {
    // Make a GET request with pagination parameters
    const response = await api.get(`/tour`);

    return response.data; // Return the response data directly
  } catch (error) {
    console.error('خطا در دریافت لیست تورها:', error.message || error);
    throw new Error('لطفا بعدا امتحان کنید!');
  }
};

export const fetchTourById = async (tourId) => {
  try {
    // Make a GET request with pagination parameters
    const response = await api.get(`/tour/${tourId}`);

    return response.data; // Return the response data directly
  } catch (error) {
    console.error('خطا در دریافت لیست تورها:', error.message || error);
    throw new Error('لطفا بعدا امتحان کنید!');
  }
};

export const updateUserInfo = async (updatedData) => {
  try {
    const { data } = await api.put('/user/profile', updatedData); // Call the API with the entire user data
    return data; // Return the updated data after successful response
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Re-throw the error so the caller can handle it
  }
};

export const Basket = {
  // Add a tour to the basket
  addTourToBasket: async (tourId) => {
    try {
      const response = await api.put(`/basket/${tourId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding tour to basket:", error);
      throw error;
    }
  },

  // Get the current basket content
  getBasket: async () => {
    try {
      const response = await api.get('/basket');
      return response.data;
    } catch (error) {
      console.error("Error fetching basket content:", error);
      throw error;
    }
  },
};

export const Order = {
  // Submit the order
  submitOrder: async (orderData) => {
    try {
      const response = await api.post('/order', orderData);
      return response.data;
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  },
};

export const fetchUserTours = async () => {
  try {
    const response = await api.get(`/user/tours`);
    console.log('API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Server Response:', error.response?.data); // Capture detailed error
    console.error('Status Code:', error.response?.status);
    throw new Error('Error fetching tours!');
  }
};

export const fetchUserTransaction = async () => {
  try {
    const response = await api.get(`/user/transactions`);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error in fetchUserTransaction:', error);
    throw new Error('Error fetching transactions!');
  }
};

