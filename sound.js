const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playEatSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playExplosionSound() {
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < audioContext.sampleRate * 0.5; i++) {
        noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(500, audioContext.currentTime);
    noiseFilter.Q.setValueAtTime(1, audioContext.currentTime);
    noiseSource.connect(noiseFilter);

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.5, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 0.5);
}
