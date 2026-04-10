import { Skeleton } from "@/components/ui/skeleton"

export function SupportThreadSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-4">
      {/* Header Section: Avatar & Name */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Mood and Topic Labels */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>

      {/* Content Area */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Interaction Bar */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Skeleton className="flex-1 h-9 rounded-lg" />
        <Skeleton className="flex-1 h-9 rounded-lg" />
        <Skeleton className="flex-1 h-9 rounded-lg" />
        <Skeleton className="h-9 w-12 rounded-lg" />
      </div>
    </div>
  )
}