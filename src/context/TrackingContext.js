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
  const [tracking, dispatch] = useReducer(Reducer, State);

  const { state: timeState } = useTimeular();

  const [currentSide, setCurrentSide] = useState(null);

  useEffect(() => {
    if (timeState.side !== null && timeState.side !== currentSide) {
      if (currentSide !== 0 && timeState.side === 0) {
        //stop tracking
        console.log("Start Tracking");
      } else {
        //start tracking
        console.log("Stop Tracking");
      }

      setCurrentSide(timeState.side);
    }
  }, [timeState, currentSide]);

  const value = { tracking, dispatch };
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
