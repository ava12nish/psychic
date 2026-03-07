'use client';

export default function DeepCosmicBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-neutral-950 pointer-events-none">
            {/* Deep starry/noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.15] mix-blend-screen"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 
        Slow orbiting massive gradients to give a "nebula" or cosmic feeling.
        Using Tailwind arbitrary values for very large blurs and dimensions.
      */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] animate-orbit-slow opacity-[0.12]">
                {/* Glow 1 - Blue */}
                <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-accent-500 rounded-full blur-[120px] mix-blend-screen animate-pulse-subtle" />
                {/* Glow 2 - Purple/Indigo */}
                <div className="absolute bottom-[20%] right-[30%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px] mix-blend-screen" />
                {/* Glow 3 - Cyan */}
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-cyan-400 rounded-full blur-[90px] mix-blend-screen animate-pulse-subtle" style={{ animationDelay: '2s' }} />
            </div>

            {/* Static center highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-accent-500/10 rounded-full blur-[120px]" />
        </div>
    );
}
