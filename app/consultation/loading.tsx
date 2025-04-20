export default function Loading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-8 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-[500px] bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div>
          <div className="h-[400px] bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-[300px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
