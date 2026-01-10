"use client";

import { TDBEvent } from "@/db/schema";
import { dateFormatter, deepClone } from "@/lib/utils";
import { TEventDataByMonth } from "@/router/event";
import { TEventSchema } from "@/schema/event";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type State = {
  events: TEventDataByMonth[];
  setEvents: Dispatch<SetStateAction<TEventDataByMonth[]>>;
  addEvent: (data: TDBEvent) => void;
};

const yearEventsContext = createContext<State | null>(null);

export const YearEventsProvider = ({
  defaultValues,
  children,
}: {
  defaultValues: { eventsByMonth?: TEventDataByMonth[] };
  children: React.ReactNode;
}) => {
  const [events, setEvents] = useState<TEventDataByMonth[]>(
    defaultValues.eventsByMonth ?? []
  );

  const addEvent = async (data: TDBEvent) => {
    const yr = new Date().getFullYear();
    const mn = data.month.toString().padStart(2, "0");
    const dy = "01";
    const formattedDate = `${yr}-${mn}-${dy}`;
    console.log(formattedDate);

    setEvents((prev) => {
      const clone = deepClone(prev);

      const selectedMonth = clone.find((evm) => evm.date === formattedDate)!;
      selectedMonth.users = [
        {
          id: data.id,
          day: data.day,
          month: data.month,
          name: data.name,
          other_info: data.otherInfo ?? {},
        },
      ];
      selectedMonth.total++;

      return clone;
    });
  };

  return (
    <yearEventsContext.Provider value={{ events, setEvents, addEvent }}>
      {children}
    </yearEventsContext.Provider>
  );
};

export const useYearEvents = () => {
  const context = useContext(yearEventsContext);

  if (!context)
    throw new Error("useAppState must be used inside AppStateProvider");

  return context;
};
