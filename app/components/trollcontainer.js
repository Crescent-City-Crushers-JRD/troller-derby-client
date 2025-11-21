export default function TrollsContainer({ children, event }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4 flex items-center justify-center">
            <div className="bg-white/60 backdrop-blur-xl border-1 border-pink-400 rounded-2xl shadow-xl p-2 max-w-4xl w-full relative">

                <h1 className="text-3xl font-extrabold text-pink-700 text-center mb-1 drop-shadow-lg">
                    🌈 Troller Derby! 🌈
                </h1>
                <h2 className="text-xl font-extrabold text-pink-900 text-center">
                    Crescent City Crushers
                </h2>
                {children}
            </div>
        </div>
    );
}
