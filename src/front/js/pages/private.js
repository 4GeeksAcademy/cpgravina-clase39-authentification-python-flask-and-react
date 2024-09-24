import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Private = () => {
  const { store } = useContext(Context);
   const userEmail = store.currentUser?.current_user?.email || "User";

   return (
	   <div className="container d-flex flex-column justify-content-center align-items-center vh-100">+
		   <div className="text-center mb-5">
			   <h1 className="display-3">Welcome!</h1>
			   <h2 className="display-5 text-primary">{userEmail}</h2>
		   </div>
	   </div>
   );
};
