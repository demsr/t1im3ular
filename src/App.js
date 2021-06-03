import { useEffect, useState } from "react";
import { useTimeular } from "./components/Timeular";
import "./App.css";

function App() {
  const { state, dispatch } = useTimeular();

  const getBleDevice = () => {
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
        device.addEventListener("gattserverdisconnected", (e) => {
          dispatch({ type: "disconnected" });
        });
        dispatch({ type: "connecting" });
        return device.gatt.connect();
      })
      .then((server) => {
        dispatch({ type: "connected", payload: server });
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
            dispatch({ type: "side_subscribed", payload: true });
            characteristic.addEventListener(
              "characteristicvaluechanged",
              (e) => {
                dispatch({
                  type: "side_changed",
                  payload: e.currentTarget.value.getUint8(0),
                });
              }
            );
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

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: state.connected ? "#238636" : "#b62324",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 30,
          display: state.battery ? "block" : "none",
        }}
      >
        Batterylevel: {state.battery ?? 0}%
      </div>

      {state.connected ? (
        state.side !== null ? (
          <div style={{ fontSize: 90 }}>{state.side}</div>
        ) : (
          <div style={{ fontSize: 90 }}>I'll be ready momentarily</div>
        )
      ) : state.connecting ? (
        <button>Connect your Timeular</button>
      ) : (
        <button onClick={getBleDevice}>Connect your Timeular</button>
      )}
    </div>
  );
}

export default App;
