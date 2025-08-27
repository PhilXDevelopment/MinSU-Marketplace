export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          {/* Breadcrumb placeholder */}
          <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Question placeholder */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>

                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>

                <div className="flex gap-2 mb-6">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-10"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>

              {/* Answers placeholder */}
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>

                {[1, 2].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>

                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add answer placeholder */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-end">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Sidebar placeholder */}
            <div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>

                <div className="space-y-4 mb-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index}>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-200 my-4"></div>

                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>

                <div className="h-px bg-gray-200 my-4"></div>

                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
