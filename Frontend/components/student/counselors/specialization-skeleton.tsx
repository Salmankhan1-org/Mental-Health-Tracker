import { Skeleton } from "@/components/ui/skeleton";

const SpecializationsSkeleton = () => {
  return (
    <div className="space-y-3">
      {/* Heading */}
      <Skeleton className="h-4 w-32" />

      {/* List (10 items) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          {/* Checkbox skeleton */}
          <Skeleton className="h-4 w-4 rounded-sm" />

          {/* Label skeleton */}
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  );
};

export default SpecializationsSkeleton;