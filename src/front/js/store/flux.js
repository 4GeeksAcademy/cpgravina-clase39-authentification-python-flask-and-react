import axios from 'axios'

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      token: null,
      currentUser: null,

      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      login: async (email, password) => {
        const bodyData = {
          email,
          password,
        };
        console.log("bodyData", bodyData);
        try {
          const res = await axios.post(`${process.env.BACKEND_URL}/api/login`, bodyData)
          console.log("res", res);
          const { data } = res;
          console.log("data", data);
          
          const accessToken = data.access_token;
          const withToken = !!accessToken;
          console.log(`accessToken: ${accessToken}`);
          console.log(`withTokend: ${withToken}`);
          if (withToken) {
            setStore({ token: accessToken});
            getActions().getCurrentUser();
            return true;
          }
          return false;
        } catch (error) {
          console.error("Loading message from backend", error);
          return false;
        }
      },

      getCurrentUser: async () => {
        console.log("PEDIR USUARIO!!!");
        try {
          const store = getStore();
          const token = store.token;
          console.log("token", token);

          const res = await axios.post(`${process.env.BACKEND_URL}/api/current-user`,
            { headers: {"Authorization" : `Bearer ${token}`} }
          );
          console.log("res", res);
          const {data} = res;
          console.log("data", data);
          setStore({ currentUser: data});
        } catch (error) {
          console.error("Loading message from backend", error);
          return false;
        }
      },


      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
