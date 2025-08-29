import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { MonumentAudio } from "@/types/monument";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  audios: MonumentAudio[];
}

export function AudioPlayer({ audios }: AudioPlayerProps) {
  const [currentAudio, setCurrentAudio] = useState<MonumentAudio | null>(audios[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudio]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentAudio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!audios.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-accent/20 to-highlight/20 backdrop-blur-sm rounded-lg p-6 border border-accent/30"
    >
      <div className="flex items-center gap-4 mb-4">
        <Volume2 className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-heritage font-semibold text-foreground">
          Audio Guide
        </h3>
      </div>

      {/* Language Selection */}
      {audios.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {audios.map((audio) => (
            <button
              key={audio.id}
              onClick={() => {
                setCurrentAudio(audio);
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentAudio?.id === audio.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent/20'
              }`}
            >
              {audio.language}
            </button>
          ))}
        </div>
      )}

      {currentAudio && (
        <>
          <audio
            ref={audioRef}
            src={currentAudio.audio_url}
            preload="metadata"
          />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{currentAudio.title}</h4>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="audio-player flex items-center justify-center w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              <div className="flex-1 space-y-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}