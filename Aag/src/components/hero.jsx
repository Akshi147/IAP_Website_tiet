export function Hero() {
  return (
    <div className="bg-gradient-to-r from-purple-200 via-indigo-300 to-pink-200 bg-opacity-80 py-16 sm:py-24 lg:py-32 relative">
      {/* Shine Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-20 pointer-events-none"></div>

      {/* Content section */}
      <div className="container mx-auto px-4 flex-1 relative z-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-2xl leading-tight text-white text-shadow-highlight">
          THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground text-white text-shadow-highlight">
          DEEMED TO BE UNIVERSITY
        </p>
      </div>
    </div>
  );
}
