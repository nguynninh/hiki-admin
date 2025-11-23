"use client";
import { Provider } from "react-redux";
import store from "../redux/store";
import Router from "./router";
import { toast } from "sonner";

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
