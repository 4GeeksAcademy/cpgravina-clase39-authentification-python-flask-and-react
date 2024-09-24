import axios from 'axios'
import { CharacterDispatcher } from "./characterDispatcher";
import { CharacterDetailsDispatcher } from "./characterDetailsDispatcher";
import { PlanetDispatcher } from "./planetDispatcher";
import { PlanetDetailsDispatcher } from "./planetDetailsDispatcher";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      token: null,
      currentUser: null,
      people: [],
			planets: [],
			favorites: []
    },

    actions: {

      login: async (email, password) => {
        const bodyData = { email, password };
        try {
          const res = await axios.post(`${process.env.BACKEND_URL}/api/login`, bodyData);       
          const { data } = res;
          const accessToken = data.access_token;
          if (accessToken) {
            setStore({ token: accessToken });
            await getActions().getCurrentUser();
            return true;
          } else {
            console.warn("Login failed, no access token returned");
            return false;
          }
        } catch (error) {
          console.error("Login error:", error.response ? error.response.data : error.message);
          return false
        }
      },
      
      getCurrentUser: async () => {
        try {
            const store = getStore();
            const token = store.token;     
            const res = await axios.get(`${process.env.BACKEND_URL}/api/current-user`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const { data } = res;
            console.log("Current user data:", data);
            setStore({ currentUser: data });
        } catch (error) {
            console.error("Loading message from backend", error.response ? error.response.data : error.message);
            return false;
        }
    },

      signup: async (email, password) => {
        const bodyData = { email, password };
        try {
          const res = await axios.post(`${process.env.BACKEND_URL}/api/signup`, bodyData);      
          const { data } = res;
          const accessToken = data.access_token;
      
          if (accessToken) {
            setStore({ token: accessToken });
            await getActions().getCurrentUser();
            return true;
          } else {
            console.warn("Signup successful, but no token returned.");
            return true;
          }
        } catch (error) {
          console.error("Signup error:", error.response ? error.response.data : error.message);
          return false;
        }
      },

      logout: async () => {
        try {
          localStorage.removeItem("accessToken");
          setStore({ currentUser: null });
          return true;
        } catch (error) {
          if (error.response) {
          } else {
          }
          return false;
        }
      },

      getCharacters: async () => {
        try {
          const store = getStore();
          const data = await CharacterDispatcher.get();
          const characterPromises = data.results.map(async (character) => {
            return await getActions().getCharactersDetail(character.uid);
          });

          const charactersDetails = await Promise.all(characterPromises);
          console.log("Fetched characters details:", charactersDetails);

          setStore({ characters: charactersDetails });
        } catch (error) {
          console.log("The characters have not been found", error);
        }
      },

      getCharactersDetail: async (uid) => {
        try {
          const store = getStore();
          const data = await CharacterDetailsDispatcher.get(uid);

          return {
            description: data.result.description,
            uid: data.result.uid,
            ...data.result.properties,
          };
        } catch (error) {
          console.log("The character details have not been found", error);
          return null;
        }
      },

      getPlanets: async () => {
        try {
          const store = getStore();
          const data = await PlanetDispatcher.get();
          const planetPromises = data.results.map(async (planet) => {
            return await getActions().getPlanetsDetail(planet.uid);
          });

          const planetsDetails = await Promise.all(planetPromises);
          console.log("Fetched planets details:", planetsDetails);

          setStore({ planets: planetsDetails });
        } catch (error) {
          console.log("The planets have not been found", error);
        }
      },

      getPlanetsDetail: async (uid) => {
        try {
          const store = getStore();
          const data = await PlanetDetailsDispatcher.get(uid);

          return {
            description: data.result.description,
            uid: data.result.uid,
            ...data.result.properties,
          };
        } catch (error) {
          console.log("The character details have not been found", error);
          return null;
        }
      },

      getFavorites: async () => {
        try {
            const store = getStore();
            const token = store.token;     
            const res = await axios.get(`${process.env.BACKEND_URL}/api/favorites`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const { data } = res;
            console.log("Fetched favorites:", data);
            setStore({ favorites: data }); // Assuming the response contains the favorites array
        } catch (error) {
            console.error("Error fetching favorites:", error.response ? error.response.data : error.message);
        }
    },
    

      addFavorite: (item) => {
        const store = getStore();
        setStore({
          ...store,
          favorites: [...store.favorites, item],
        });
      },

      removeFavorite: (uid) => {
        const store = getStore();
        setStore({
          ...store,
          favorites: store.favorites.filter((fav) => fav.uid !== uid),
        });
      },


    },
  };
};

export default getState;
