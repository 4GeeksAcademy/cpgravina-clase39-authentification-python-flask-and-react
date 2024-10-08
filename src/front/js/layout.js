import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
import { Private } from "./pages/private";
import injectContext from "./store/appContext";
import { CharactersCard } from "./pages/charactersCard";
import { CharactersDetailsCard } from "./pages/charactersDetailsCard";
import { PlanetsCard } from "./pages/planetsCard";
import { PlanetDetailsCard } from "./pages/planetDetailsCard";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<Signin />} path="/sign-in" />
            <Route element={<Signup />} path="/sign-up" />
            <Route element={<Private />} path="/private" />
            <Route path="/charactersCard" element={<CharactersCard />} />
            <Route
              path="/charactersDetailsCard/:uid"
              element={<CharactersDetailsCard />}
            />
            <Route
              path="/planetDetailsCard/:uid"
              element={<PlanetDetailsCard />}
            />
            <Route path="/planetsCard" element={<PlanetsCard />} />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
