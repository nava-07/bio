"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Premium ambient synthwave track
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25; // Keep background music comfortable

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio playback blocked by browser", err);
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3">
      {/* Audio Visualizer Waves (flatline when muted, jumps when unmuted) */}
      <div className="flex gap-0.5 items-end h-5 w-6 px-1 select-none pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-0.5 bg-[#00f0ff] rounded-t-full ${
              isPlaying ? "sound-bar" : "h-1"
            }`}
            style={{ 
              height: isPlaying ? undefined : '4px',
              animationDuration: isPlaying ? `${0.8 + i * 0.15}s` : undefined
            }}
          />
        ))}
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={togglePlayback}
        className={`relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl bg-black/60 backdrop-blur-md border border-[#00f0ff]/30 shadow-neon-primary text-[#00f0ff] hover:text-white hover:border-[#bd00ff] hover:shadow-neon-secondary transition-all duration-300`}
        title={isPlaying ? "Mute Background System" : "Play Cyberpunk Ambient"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
}
