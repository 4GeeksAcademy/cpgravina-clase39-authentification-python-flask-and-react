import React, { useContext, useEffect } from "react";
import "../../styles/home.css";
import { Context } from "../store/appContext";
import { CharactersCard } from "./charactersCard";
import { PlanetsCard } from "./planetsCard";

export const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getCharacters();
    actions.getPlanets();
  }, []);

  return (
    <div className="container mt-5">
      <p className="fs-1 text-danger">Characters</p>
      <div className="overflow-auto d-flex">
        {store.characters && store.characters.length > 0 ? (
          store.characters.map((character, index) => (
            <div
              className="flex-shrink-0 me-3"
              key={index}
              style={{ width: "18rem" }}
            >
              <CharactersCard characters={character} />
            </div>
          ))
        ) : (
          <p>Loading characters...</p>
        )}
      </div>

      <p className="fs-1 text-danger">Planets</p>
      <div className="overflow-auto d-flex">
        {store.planets && store.planets.length > 0 ? (
          store.planets.map((planet, index) => (
            <div
              className="flex-shrink-0 me-3"
              key={index}
              style={{ width: "18rem" }}
            >
              <PlanetsCard planets={planet} />
            </div>
          ))
        ) : (
          <p>Loading planets...</p>
        )}
      </div>
    </div>
  );
};

