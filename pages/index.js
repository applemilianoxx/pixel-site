import { useState } from "react";

export default function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showBuyNotice, setShowBuyNotice] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold text-green-500">Pixelis</h1>
        <button
          className="bg-green-600 px-6 py-3 rounded-full text-base font-semibold shadow-xl transition-all duration-200 hover:brightness-110"
          onClick={async () => {
            if (window.solana && window.solana.isPhantom) {
              try {
                const response = await window.solana.connect();
                const address = response.publicKey.toString();
                console.log('Connected to wallet:', address);
                setWalletAddress(address);
              } catch (err) {
                console.error('Wallet connection failed:', err);
              }
            } else {
              window.open('https://phantom.app/', '_blank');
            }
          }}
        >
          {walletAddress ? `Wallet: ...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button>
      </header>

      <section className="text-center py-20 px-4 relative z-10">
        <h1 className="text-5xl font-bold mb-4">
          Play to <span className="text-green-500">Own</span>
        </h1>
        <p className="text-lg mb-8 text-gray-400 max-w-xl mx-auto">
          Create. Invest. Earn. Pixelis is the platform where creators launch games and players become shareholders.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 px-6 py-3 rounded-2xl text-lg font-semibold shadow-xl transform transition-transform duration-300 hover:scale-105 hover:bg-purple-700"
          >
            Launch a Game
          </button>
          <button onClick={() => window.location.href='/market'} className="bg-gray-800 px-6 py-3 rounded-2xl text-lg font-semibold shadow-xl transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
            Buy with $PIXELIS
          </button>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-11/12 max-w-md relative">
            <h2 className="text-xl font-bold mb-2">Upload Your Game</h2>
            <p className="text-sm mb-4">
              Upload your game to Pixelis. All submissions are reviewed before going live. You’ll be notified after approval.
            </p>
            <p className="text-xs text-gray-600 mb-1">Make sure your game includes an index.html and all assets bundled.</p>
            <form className="space-y-4">
              <input type="text" placeholder="Game Name" className="w-full px-3 py-2 border rounded" />
              <input type="email" placeholder="Your Email" className="w-full px-3 py-2 border rounded" />
              <input type="text" placeholder="GitHub Repo (optional)" className="w-full px-3 py-2 border rounded" />
              <input type="file" multiple className="w-full px-3 py-2 border rounded bg-white" onChange={(e) => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])} />
              {selectedFiles.length > 0 && (
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit Game
              </button>
            </form>
            <div className="flex justify-end mt-4">
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      <section className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-16 px-4 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 blur-2xl opacity-40" />
        <h2 className="relative z-10 text-3xl font-bold text-center mb-12 animate-fade-in-delay">How It Works</h2>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in-delay">
          <div>
            <div className="relative">
  <img src="/control.png" alt="Decoration" className="absolute -top-36 right-44 w-32 h-32 z-0 opacity-80 pointer-events-none" />
  <h3 className="text-2xl font-bold mb-3 relative z-10">Create</h3>
</div>
            <p className="text-base text-gray-300">Launch your game and tokenize shares instantly.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Invest</h3>
            <p className="text-base text-gray-300">Buy shares using $PIXELIS and back top creators.</p>
          </div>
          <div>
            <div className="relative">
  <img src="/greene.png" alt="Decoration" className="absolute -top-36 right-44 w-32 h-32 z-0 opacity-80 pointer-events-none" />
  <h3 className="text-2xl font-bold mb-3 relative z-10">Earn</h3>
</div>
            <p className="text-base text-gray-300">Get paid as the game grows in popularity and revenue.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
  <h2 className="text-3xl font-bold text-center md:text-left">Live Games</h2>
  <input
    type="text"
    placeholder="Search games..."
    className="mt-4 md:mt-0 bg-black border border-gray-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            i === 1 ? (
              <div key={i} className="group bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl hover:scale-105 transition duration-300 relative">
                <div className="h-40 mb-4 rounded-xl overflow-hidden">
                  <img src="/pepes.png" alt="Pepe Dash" className="object-cover w-full h-full" />
                </div>
                <span className='absolute top-3 right-4 bg-green-500 text-black text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse z-10'>LIVE</span>
                <div className="relative min-h-24 group-hover:min-h-32 transition-all duration-300">
                  <h3 className="text-2xl font-bold mt-10 mb-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                    Pepe Dash <span className="text-green-400 text-sm">$pepedash</span>
                  </h3>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Pepe jumps, dashes, and memes his way through neon chaos. One slip and it’s over. Good luck.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a href="/game1" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Play</a>
                  <button onClick={() => setShowBuyNotice(true)} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Buy</button>
                </div>
              </div>
            ) : i === 3 ? (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-2xl flex flex-col justify-center items-center h-52 text-center text-gray-400">
                <div className="bg-gray-800/30 w-full h-40 rounded-xl mb-4 flex items-center justify-center text-sm">
                  Coming Soon
                </div>
                <button className="bg-gray-700 text-gray-400 font-medium px-5 py-2 rounded-full cursor-not-allowed opacity-60">Play</button>
              </div>
            ) : (
              <div key={i} className="group bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl hover:scale-105 transition duration-300 relative">
                <div className="h-40 mb-4 rounded-xl overflow-hidden">
                  <img src="/cryptorunner.png" alt="Crypto Runner" className="object-cover w-full h-full" />
                </div>
                <span className='absolute top-3 right-4 bg-green-500 text-black text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse z-10'>LIVE</span>
                <div className="relative min-h-24 group-hover:min-h-32 transition-all duration-300">
                  <h3 className="text-2xl font-bold mt-10 mb-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                    Crypto Runner <span className="text-green-400 text-sm">$cryptorunner</span>
                  </h3>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Crypto Runner is a fast-paced, futuristic runner where you dodge flying cars and collect Bitcoin coins in deep space.
                  </p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <a href="/game2" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Play</a>
                  <button onClick={() => setShowBuyNotice(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200">Buy</button>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {showBuyNotice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-11/12 max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Buying coming soon</h2>
<p className="text-sm text-black">Buying opens later this week. <strong>$pepedash</strong> and <strong>$cryptorunner</strong> will be available soon.</p>
            <button
              onClick={() => setShowBuyNotice(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}

<section className="py-16 px-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mt-12 text-center animate-fade-in">
  <h2 className="text-3xl font-bold text-white mb-4">Own a Piece of Every Game</h2>
  <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-6">
    Every time you launch a game on Pixelis, a unique token is created just for that game. These tokens represent ownership and can only be purchased using <span className="text-green-400 font-semibold">$PIXELIS</span>.
  </p>
  <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-8 text-left text-gray-300">
    <div>
      <h4 className="text-lg font-semibold text-white mb-1">Automatic Token Creation</h4>
      <p>A custom token (like <span className="text-green-400">$pepedash</span>) is minted for every game launched.</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white mb-1">Built for Tokenized Ownership</h4>
      <p>Game tokens are exclusively purchasable with <span className="text-green-400">$PIXELIS</span>, ensuring ecosystem value flows through the core platform.</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white mb-1">Growth-Linked Earnings</h4>
      <p>As the game gains players and revenue, token holders benefit directly.</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white mb-1">Community Ownership</h4>
      <p>Players aren’t just participants—they own a stake in the games they believe in.</p>
    </div>
  </div>
</section>

<footer className="bg-gray-950 text-gray-500 text-center py-6 text-sm">
        <p>
          © 2025 Pixelis. Powered by <span className="text-green-500">Believe</span>. All rights reserved.
        </p>
      </footer>

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

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
