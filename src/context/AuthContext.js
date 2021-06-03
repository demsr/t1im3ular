import { createContext, useContext, useEffect, useReducer } from "react";

const State = {
  isTracking: false,
};

const Context = createContext();

function Reducer(state, action) {
  console.log("Reducer:", action);
  switch (action.type) {
    default:
      throw new Error(`${action.type} not implemented`);
  }
}

function Provider(props) {
  const [state, dispatch] = useReducer(Reducer, State);

  const value = { state, dispatch };
  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

function useTracking() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("No Context available");
  }
  return context;
}

export { Provider as AuthProvider, useTracking };
