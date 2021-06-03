import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const Timeular = {
  connecting: false,
  connected: false,
  ready: false,
  side: null,
  info: null,
  powerState: null,
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
      };
    case "setReady":
      return {
        ...state,
        ready: true,
      };
    case "disconnected":
      return { ...Timeular };
    case "side_subscribed":
      return { ...state, side_subscribed: true };
    case "side_changed":
      return { ...state, side: action.payload > 8 ? 0 : action.payload };
    case "battery_changed":
      return { ...state, battery: action.payload };
    default:
      throw new Error(`${action.type} not implemented`);
  }
}

function TimeularProvider(props) {
  const [state, dispatch] = useReducer(timeularReducer, Timeular);

  const [bleDevice, setBleDevice] = useState(null);

  useEffect(() => {
    if (state.side != null) {
    }
  }, [state]);

  const connect = () => {
    navigator.bluetooth
      .requestDevice({
        optionalServices: [
          "battery_service",
          "device_information",
          "c7e70010-c847-11e6-8175-8c89a55d403c",
        ],
        filters: [{ namePrefix: "Timeular" }],
      })
      .then((device) => {
        setBleDevice(device);
        device.addEventListener("gattserverdisconnected", (e) => {
          dispatch({ type: "disconnected" });
        });
        dispatch({ type: "connecting" });
        return device.gatt.connect();
      })
      .then((server) => {
        dispatch({ type: "connected" });
        //battery
        server
          .getPrimaryService("battery_service")
          .then((s) => s.getCharacteristic("battery_level"))
          .then(async (c) => {
            c.startNotifications();
            c.addEventListener("characteristicvaluechanged", (e) => {
              dispatch({
                type: "battery_changed",
                payload: e.currentTarget.value.getUint8(0),
              });
            });
            let val = await c.readValue();
            dispatch({
              type: "side_changed",
              payload: val.getUint8(0),
            });
          });

        server
          .getPrimaryService("c7e70010-c847-11e6-8175-8c89a55d403c")
          .then((service) => {
            console.log(service);
            return service.getCharacteristic(
              "c7e70012-c847-11e6-8175-8c89a55d403c"
            );
          })
          .then(async (characteristic) => {
            characteristic.startNotifications();
            characteristic.addEventListener(
              "characteristicvaluechanged",
              (e) => {
                dispatch({
                  type: "side_changed",
                  payload: e.currentTarget.value.getUint8(0),
                });
              }
            );
            dispatch({
              type: "setReady",
            });
            let val = await characteristic.readValue();
            dispatch({
              type: "side_changed",
              payload: val.getUint8(0),
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const disconnect = () => {
    if (!bleDevice.gat.connected) return;

    bleDevice.gat.disconnect();
  };

  function waitingScreen() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: state.connected ? "#238636" : "#b62324",
        }}
      >
        {state.connected ? (
          <div style={{ fontSize: 90 }}>This shouldn't take too long</div>
        ) : state.connecting ? (
          <div style={{ fontSize: 90 }}>Waiting for pairing</div>
        ) : (
          <button onClick={connect}>Connect your Tracker</button>
        )}
      </div>
    );
  }

  const value = { state, connect, disconnect };
  return (
    <TimeularContext.Provider value={value}>
      {state.ready ? props.children : waitingScreen()}
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
