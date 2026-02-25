import { Skeleton } from "@/components/ui/skeleton";

type SectionSkeletonProps = {
  id: string;
};

export function HeroSkeleton() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <Skeleton className="mx-auto mb-4 h-4 w-44" />
        <Skeleton className="mx-auto mb-6 h-14 w-72 max-w-full" />
        <Skeleton className="mx-auto mb-3 h-5 w-full max-w-2xl" />
        <Skeleton className="mx-auto mb-10 h-5 w-4/5 max-w-xl" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </section>
  );
}

export function SectionSkeleton({ id }: SectionSkeletonProps) {
  return (
    <section id={id} className="px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <Skeleton className="mx-auto mb-2 h-4 w-32" />
        <Skeleton className="mx-auto mb-12 h-10 w-80 max-w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
