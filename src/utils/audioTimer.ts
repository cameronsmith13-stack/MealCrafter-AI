// Web Audio API chime generator for cooking timer alerts (no external MP3 required)
export function playCookingTimerAlarm() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a friendly pleasant 3-tone chime (E5 -> G5 -> C6)
    const notes = [659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.18);
      osc.stop(ctx.currentTime + idx * 0.18 + 0.4);
    });
  } catch (err) {
    console.warn('Audio alert not supported in environment:', err);
  }
}
