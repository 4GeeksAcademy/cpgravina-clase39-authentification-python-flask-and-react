import axios from 'axios'

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      token: null,
      currentUser: null,
    },

    actions: {

      login: async (email, password) => {
        const bodyData = { email, password };
        console.log("bodyData", bodyData);
        
        try {
          const res = await axios.post(`${process.env.BACKEND_URL}/api/login`, bodyData);
          console.log("res", res);
          
          const { data } = res;
          console.log("data", data);
          
          const accessToken = data.access_token;
          if (accessToken) {
            setStore({ token: accessToken });
            await getActions().getCurrentUser();
            return true; // Login successful
          } else {
            console.warn("Login failed, no access token returned");
            return false; // Login failed
          }
        } catch (error) {
          // Log error response details for debugging
          console.error("Login error:", error.response ? error.response.data : error.message);
          return false; // Login failed
        }
      },
      
      
      
           

      getCurrentUser: async () => {
        console.log("PEDIR USUARIO!!!");
        try {
          const store = getStore();
          const token = store.token;
          console.log("token", token);
      
          const res = await axios.get(`${process.env.BACKEND_URL}/api/current-user`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
      
          console.log("res", res);
          const { data } = res;
          console.log("data", data);
          setStore({ currentUser: data });
        } catch (error) {
          console.error("Loading message from backend", error.response ? error.response.data : error.message);
          return false;
        }
      },
      

    },
  };
};

export default getState;
