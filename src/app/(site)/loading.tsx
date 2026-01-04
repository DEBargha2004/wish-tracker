import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-28" />
      </header>
      <section className="mt-8">
        <Skeleton className="h-10 w-full" />
      </section>
      <section className="space-y-6 mt-12">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border p-6 bg-primary-foreground flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex -space-x-2">
              <Skeleton className="size-10 rounded-full ring-2 ring-background" />
              <Skeleton className="size-10 rounded-full ring-2 ring-background" />
              <Skeleton className="size-10 rounded-full ring-2 ring-background" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
