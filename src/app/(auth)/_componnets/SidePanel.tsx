const SidePanel = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex flex-col justify-center px-16 text-white">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to the Future
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Join millions of users who trust our platform for their business needs.
              Experience seamless collaboration, powerful features, and exceptional support.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-lg">Secure and reliable platform</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-lg">24/7 customer support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-lg">Advanced analytics and insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
