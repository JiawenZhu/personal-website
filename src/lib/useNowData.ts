import { useEffect, useState } from "react";
import { fetchNow, type NowData } from "./now";

export type NowState =
  | { status: "loading" }
  | { status: "ready"; data: NowData }
  | { status: "error" };

export function useNowData() {
  const [state, setState] = useState<NowState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetchNow()
      .then((data) => active && setState({ status: "ready", data }))
      .catch(() => active && setState({ status: "error" }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
