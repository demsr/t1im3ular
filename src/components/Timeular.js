import { createContext, useContext, useReducer } from "react";

const Timeular = {
  server: null,
  connecting: false,
  connected: false,

  side_subscribed: false,
  side: null,
  info_service: null,
  uid: null,
  battery: null,
};

const TimeularContext = createContext();

function timeularReducer(state, action) {
  console.log("Reducer:", action);
  switch (action.type) {
    case "connecting":
      return { ...state, connecting: true };
    case "connected":
      return {
        ...state,
        connected: true,
        connecting: false,
        server: action.payload,
      };
    case "disconnected":
      return { ...Timeular };
    case "side_subscribed":
      return { ...state, side_subscribed: true };
    case "side_changed":
      return { ...state, side: action.payload > 8 ? 0 : action.payload };
    case "battery_changed":
      return { ...state, battery: action.payload };
    case "uid_changed":
      return { ...state, uid: action.payload };
    default:
      throw new Error(`${action.type} not implemented`);
  }
}

function TimeularProvider(props) {
  const [state, dispatch] = useReducer(timeularReducer, Timeular);

  const value = { state, dispatch };
  return (
    <TimeularContext.Provider value={value}>
      {props.children}
    </TimeularContext.Provider>
  );
}

function useTimeular() {
  const context = useContext(TimeularContext);
  if (context === undefined) {
    throw new Error("No Context available");
  }
  return context;
}

export { TimeularProvider, useTimeular };
