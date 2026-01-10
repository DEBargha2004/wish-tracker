import { client } from "@/lib/orpc/orpc";
import { TEventDataByMonth } from "@/router/event";
import { useEffect, useRef } from "react";

type TModuleProps = {
  query: string;
  setter: (data: TEventDataByMonth[]) => void;
};

export function useEvent(props: TModuleProps) {
  const hasInit = useRef(false);

  useEffect(() => {
    if (!hasInit.current) return;

    const controller = new AbortController();

    async function fetchData() {
      if (controller.signal.aborted) return;
      client.events.userEventsByMonths({ query: props.query }).then((res) => {
        if (controller.signal.aborted) return;
        return props.setter(res);
      });
    }

    setTimeout(fetchData, 400);

    return () => {
      controller.abort();
    };
  }, [props.query]);

  useEffect(() => {
    hasInit.current = true;
  }, []);
}
