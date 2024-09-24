export const PlanetDispatcher = {
    get: async () => {
    const BASE_URL = "https://www.swapi.tech/api";
    const PATH = "/planets";
    const response = await fetch(`${BASE_URL}${PATH}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    },
  };