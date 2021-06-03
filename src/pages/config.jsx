import { useEffect, useState } from "react";
import { useTimeular } from "../context/TimeularContext";
import { useTracking } from "../context/TrackingContext";

export default function Page() {
  const { state: TimeState, dispatch: dispatchTimeular } = useTimeular();
  const { state: TrackingState, dispatch: dispatchTracking } = useTracking();

  const [form, setForm] = useState({ name: "", sides: [] });

  useEffect(() => {
    dispatchTracking({ type: "blockTracking", payload: true });
    return () => {
      dispatchTracking({ type: "blockTracking", payload: false });
    };
  }, []);

  const saveForm = (e) => {
    e.preventDefault();
    console.log(form);

    dispatchTimeular({
      type: "editTracker",
      payload: form,
    });
  };

  useEffect(() => {
    if (TimeState.tracker) setForm(TimeState.tracker);
  }, []);

  return (
    <div style={{ width: 600, padding: 20 }}>
      <form onSubmit={saveForm}>
        <div style={{ padding: "10px 0" }}>
          Tracking is disabled while on Settings Page
          <div>
            <label for="name">Tracker Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label for="side">
              Rotate your Tracker to name Side Number {TimeState.side}
            </label>
            <input
              id="side"
              value={
                form.sides.find((x) => x.side === TimeState.side)?.name ?? ""
              }
              onChange={(e) => {
                let _i = form.sides.findIndex((x) => x.side === TimeState.side);
                if (_i > -1) {
                  form.sides[_i] = {
                    side: TimeState.side,
                    name: e.target.value,
                  };
                } else {
                  form.sides.push({
                    side: TimeState.side,
                    name: e.target.value,
                  });
                }

                setForm({
                  ...form,
                  sides: form.sides,
                });
              }}
            />
          </div>
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
