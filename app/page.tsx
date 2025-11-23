"use client";
import { Provider } from "react-redux";
import store from "../redux/store";
import Router from "./router";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Router />
      <Toaster
        duration={1000}
        position="top-right"
        richColors
        expand
      />
    </>
  );
};

export default App;
