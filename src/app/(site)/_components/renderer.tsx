"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, dateFormatter, getAcronym } from "@/lib/utils";
import { TEventDataByMonth } from "@/router/event";
import { Calendar, CalendarPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryStates } from "nuqs";
import { params } from "./query-props";
import { useEvent } from "@/hooks/use-event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  eventSchema,
  getEventDefaultValues,
  TEventSchema,
} from "@/schema/event";
import { zodResolver } from "@hookform/resolvers/zod";
import EventForm from "@/components/custom/forms/event";
import { client } from "@/lib/orpc/orpc";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Renderer({ res }: { res: TEventDataByMonth[] }) {
  const [data, setData] = useState<TEventDataByMonth[]>(res);
  const [query, setQuery] = useQueryStates(params, { history: "push" });
  const [createEventDialog, setCreateEventDialog] = useState(false);
  const eventForm = useForm<TEventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: getEventDefaultValues(),
  });

  useEvent({ query: query.query, setter: setData });

  const onSubmit = async (data: TEventSchema) => {
    const res = await client.events.createUserEvent(data);

    setCreateEventDialog(false);
  };

  useEffect(() => {
    if (!createEventDialog) eventForm.reset(getEventDefaultValues());
  }, [createEventDialog]);

  return (
    <div>
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-lg font-medium">Overview of monthly events</h1>
          <p className="text-sm text-muted-foreground">
            {dateFormatter(data[0].date, { month: "long", year: "numeric" })} -{" "}
            {dateFormatter(data.at(-1)!.date, {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Dialog open={createEventDialog} onOpenChange={setCreateEventDialog}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlusIcon />
              <span>New Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm form={eventForm} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </header>
      <section className="mt-8">
        <Input
          placeholder="Search..."
          value={query.query}
          onChange={(e) => setQuery({ query: e.target.value })}
        />
      </section>
      <section className="space-y-6 mt-12">
        {data.map((d, index) => (
          <div
            key={index}
            className={cn(
              "rounded-2xl border p-6 bg-primary-foreground",
              "flex items-center justify-between"
            )}
          >
            <div className="flex items-center gap-4">
              <section className="size-12 rounded-lg bg-muted border grid place-content-center">
                <Calendar />
              </section>
              <section>
                <h2 className="font-bold text-lg">
                  {dateFormatter(d.date, { month: "long" })}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {dateFormatter(d.date, { year: "numeric" })}
                </p>
              </section>
            </div>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              <AvatarGroup data={d} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function AvatarGroup({ data }: { data: TEventDataByMonth }) {
  if (!data.total)
    return <i className="text-sm text-muted-foreground">No Events</i>;

  return data.users.map((uev) => (
    <Tooltip key={uev.id}>
      <TooltipTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt={uev.name} />
          <AvatarFallback>{getAcronym(uev.name)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p>{uev.name}</p>
      </TooltipContent>
    </Tooltip>
  ));
}
