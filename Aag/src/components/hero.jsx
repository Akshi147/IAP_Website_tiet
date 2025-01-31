export function Hero() {
  return (
    <div className="bg-gradient-to-r from-purple-200 via-indigo-300 to-pink-200 bg-opacity-80 py-16 sm:py-24 lg:py-32 relative">
      {/* Shine Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-20 pointer-events-none animate-shine"></div>

      {/* Content section */}
      <div className="container mx-auto px-4 flex-1 relative z-10 text-center sm:text-left">
        <div className="text-5xl font-bold max-w-2xl leading-tight text-white shadow-2xl">
          IAP CELL
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-2xl leading-tight text-white text-shadow-highlight mt-6 mb-12">
          THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground text-white text-shadow-highlight mb-8">
          DEEMED TO BE UNIVERSITY
        </p>

        {/* Add a border effect for depth */}
        <div className="relative pl-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-white to-indigo-300 opacity-20"></div>
        </div>

        {/* Add a shimmer effect on the shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-20 pointer-events-none animate-shine"></div>
      </div>
    </div>
  );
}