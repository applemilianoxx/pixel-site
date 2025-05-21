export default function MarketPage() {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen font-sans p-6 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-green-500 rounded-sm shadow-lg animate-floatingCube"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-4 text-center bg-yellow-900 text-yellow-300 py-3 px-4 rounded-xl border border-yellow-500 shadow-md">
        ⚠️ Buying and selling is coming soon this week. Stay tuned.
      </div>

      <header className="relative z-10 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-500">Pixelis Market</h1>
        <nav className="space-x-4">
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Trending</button>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Newest</button>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Top Marketcap</button>
        </nav>
      </header>

      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl hover:scale-105 transition duration-300 relative"
          >
            {i === 1 ? (
  <div className="h-40 mb-4 rounded-xl overflow-hidden">
    <img
      src="/pepes.png"
      alt="Pepe Dash"
      className="object-cover w-full h-full"
    />
  </div>
) : i === 2 ? (
  <div className="h-40 mb-4 rounded-xl overflow-hidden">
    <img
      src="/cryptorunner.png"
      alt="Crypto Runner"
      className="object-cover w-full h-full"
    />
  </div>
) : (
  <div className="bg-white/10 backdrop-blur-md border border-white/10 h-40 mb-4 rounded-xl flex items-center justify-center">
    <span className="text-gray-400 text-sm">Coming Soon</span>
  </div>
)}


            {(i === 1 || i === 2) && (
              <span className='absolute top-3 right-4 bg-green-500 text-black text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse z-10'>LIVE</span>
            )}

            <div className="relative h-20 overflow-hidden group-hover:h-28 transition-all duration-300">
              <h3 className="text-2xl font-bold mt-2 mb-2 transform transition-transform duration-300 group-hover:-translate-y-1">
  {i === 1 ? 'Pepe Dash' : i === 2 ? 'Crypto Runner' : ''}
  <span className="ml-2 text-green-400 text-sm font-mono">
    {i === 1 ? '$pepedash' : i === 2 ? '$cryptorunner' : ''}
  </span>
</h3>
              {i === 1 && (
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pepe jumps, dashes, and memes his way through neon chaos. One slip and it’s over. Good luck.
                </p>
              )}
              {i === 2 && (
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Crypto Runner is a fast-paced, futuristic runner where you dodge flying cars and collect Bitcoin coins in deep space.
                </p>
              )}
            </div>

            {i >= 3 ? (
              <div className="flex space-x-2">
                <button className="bg-gray-700 text-gray-400 font-medium px-5 py-2 rounded-full cursor-not-allowed opacity-60">Play</button>
                <button className="bg-gray-800 px-4 py-2 rounded-xl text-gray-500 cursor-not-allowed">Buy</button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <a href={`/game${i}`} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Play</a>
                <button onClick={() => alert('Buying and selling is coming soon this week.')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Buy</button>
                <button onClick={() => alert('Buying and selling is coming soon this week.')} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Sell</button>
              </div>
            )}
          </div>
        ))}
      </section>

      

      <style jsx>{`
        @keyframes floatingCube {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        .animate-floatingCube {
          animation-name: floatingCube;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
