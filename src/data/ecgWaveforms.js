// ECG waveform data generator for LookHeart app

/**
 * Generate realistic ECG waveform with PQRST pattern
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Duration in seconds (default: 6)
 * @param {number} options.heartRate - Heart rate in BPM (default: 72)
 * @param {number} options.samplingRate - Samples per second (default: 100)
 * @param {boolean} options.abnormal - Whether to add irregularities (default: false)
 * @returns {Array} Array of {index, value} points
 */
export function generateECGWaveform(options = {}) {
  const {
    duration = 6,
    heartRate = 72,
    samplingRate = 100,
    abnormal = false,
  } = options;

  const data = [];
  const numPoints = duration * samplingRate;
  const beatDuration = 60 / heartRate; // seconds per beat
  const samplesPerBeat = beatDuration * samplingRate;

  for (let i = 0; i < numPoints; i++) {
    const t = i / samplingRate;
    const beatPhase = (i % samplesPerBeat) / samplesPerBeat;

    let value = 50; // Baseline

    // P wave (0-0.1 of beat)
    if (beatPhase >= 0 && beatPhase < 0.1) {
      const pPhase = beatPhase / 0.1;
      value += 5 * Math.sin(pPhase * Math.PI);
    }

    // QRS complex (0.12-0.22 of beat)
    else if (beatPhase >= 0.12 && beatPhase < 0.22) {
      const qrsPhase = (beatPhase - 0.12) / 0.1;
      if (qrsPhase < 0.2) {
        // Q wave (negative)
        value -= 5;
      } else if (qrsPhase < 0.5) {
        // R wave (tall positive spike)
        value += 70 * Math.sin((qrsPhase - 0.2) / 0.3 * Math.PI);
      } else {
        // S wave (negative)
        value -= 10 * Math.sin((qrsPhase - 0.5) / 0.5 * Math.PI);
      }
    }

    // T wave (0.3-0.5 of beat)
    else if (beatPhase >= 0.3 && beatPhase < 0.5) {
      const tPhase = (beatPhase - 0.3) / 0.2;
      value += 10 * Math.sin(tPhase * Math.PI);
    }

    // Add irregularity for abnormal heartbeat
    if (abnormal && Math.random() < 0.1) {
      value += (Math.random() - 0.5) * 15;
    } else {
      // Normal slight noise
      value += (Math.random() - 0.5) * 2;
    }

    data.push({
      index: i,
      value: Math.max(0, Math.min(150, value)), // Clamp between 0-150
    });
  }

  return data;
}

/**
 * Pre-generated ECG waveforms for specific events
 */
export const ecgWaveforms = {
  338: generateECGWaveform({ heartRate: 145, abnormal: true }),
  337: generateECGWaveform({ heartRate: 138, abnormal: true }),
  336: generateECGWaveform({ heartRate: 142, abnormal: true }),
  335: generateECGWaveform({ heartRate: 140, abnormal: true }),
  334: generateECGWaveform({ heartRate: 137, abnormal: true }),
  42: generateECGWaveform({ heartRate: 132, abnormal: true }),
  41: generateECGWaveform({ heartRate: 128, abnormal: true }),

  // Normal waveform for comparison
  normal: generateECGWaveform({ heartRate: 72, abnormal: false }),
};

/**
 * Get ECG waveform for a specific event ID
 * @param {number} eventId - Event ID
 * @returns {Array} ECG waveform data
 */
export function getECGWaveform(eventId) {
  return ecgWaveforms[eventId] || ecgWaveforms.normal;
}

export default {
  generateECGWaveform,
  ecgWaveforms,
  getECGWaveform,
};
