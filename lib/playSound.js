// lib/playSound.js
export function playSound(src = '/sounds/correct.mp3') {
  if (typeof window !== 'undefined') {
    const audio = new Audio(src);
    audio.play().catch((e) => {
      console.warn('Audio playback failed:', e);
    });
  }
}
