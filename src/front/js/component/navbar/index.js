import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../img/logo.jpg";
import "./styles.css";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getCurrentUser();
  }, []);

  const handleLogout = async () => {
    const success = await actions.logout(navigate);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="Logo"
              className="d-inline-block align-text-top"
              style={{ width: "auto", height: "65px" }}
            />
            <span className="brand-name ms-2 fs-1 fw-bold">
              Star wars
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggler"
            aria-controls="navbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i className="fa-solid fa-bars"></i>
            </span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarToggler"
          >
            <div className="d-flex justify-content-end">
              <div className="dropdown m-1">
                <button
                  className="btn dropdown-toggle search-button"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ width: "70px", height: "auto" }}
                >
                  <i className="fa-regular fa-user fs-1"></i>
                </button>
                <ul className="dropdown-menu fs-6 dropdown-menu-end mt-2 rounded">
                  {store.currentUser ? (
                    <>
                      <p className="dropdown-item text-primary-emphasis">
                        Welcome!
                      </p>
                      <p className="dropdown-item text-primary-emphasis">
                        Favorites
                      </p>
                      {store.favorites && store.favorites.length > 0 ? (
                        store.favorites.map((favorite, index) => (
                          <li key={index}>
                            <Link className="dropdown-item" to={`/favorites/${favorite.id}`}>
                              {favorite.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="dropdown-item text-muted">No favorites added</span>
                        </li>
                      )}
                      <li>
                        <span
                          className="dropdown-item border-top border-danger"
                          onClick={() => {
                            handleLogout();
                          }}
                        >
                          Log out
                        </span>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link className="dropdown-item" to="/sign-up">
                        Sign up
                      </Link>
                      <Link className="dropdown-item" to="/sign-in">
                        Sign in
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row justify-content-center">
        </div>
      </div>
    </div>
  );
};
