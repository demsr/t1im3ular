import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useTimeular } from "../context/TimeularContext";
const State = {
  isTracking: false,
  startTime: null,
  entries: [],
};

const Context = createContext();

function Reducer(state, action) {
  console.log("Reducer:", action);
  switch (action.type) {
    case "startTracking":
      return { ...state, isTracking: true, startTime: action.payload };
    case "stopTracking":
      return { ...state, isTracking: false };
    default:
      throw new Error(`${action.type} not implemented`);
  }
}

function Provider(props) {
  const [state, dispatch] = useReducer(Reducer, State);

  const { state: timeState } = useTimeular();

  const [currentSide, setCurrentSide] = useState(null);

  useEffect(() => {
    console.log("TrackingContext init");
  }, []);

  useEffect(() => {
    if (timeState.side !== null && timeState.side !== currentSide) {
      if (currentSide !== 0 && timeState.side === 0) {
        //stop tracking

        dispatch({ type: "stopTracking", payload: Date.now() });
      } else {
        //start tracking

        dispatch({ type: "startTracking", payload: Date.now() });
      }

      setCurrentSide(timeState.side);
    }
  }, [timeState, currentSide]);

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

export { Provider as TrackingProvider, useTracking };
