class Convert432 extends AudioWorkletProcessor {
    constructor() {
        super();
        this.phase = 0;
        this.prevSample = 0;
        this.waveTable = new Float32Array(1024);
        for (let i = 0; i < this.waveTable.length; i++) {
          this.waveTable[i] = Math.sin(i * ((Math.PI * 2) / this.waveTable.length));
        }
    }
    
  
    static get parameterDescriptors() {
      return [
        { name: 'pitch', defaultValue: 440, minValue: 0 },
      ];
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
      const sampleRate = this.context.sampleRate;
      const pitch = parameters.pitch[0];
      const pitchRatio = pitch / 440;
      const timeStep = (pitchRatio * this.waveTable.length) / sampleRate;
      const tableSize = this.waveTable.length - 1;
      const phaseStep = tableSize * timeStep;
      let phase = this.phase;
      let prevSample = this.prevSample;
  
      for (let channel = 0; channel < input.length; channel++) {
        const inputChannel = input[channel];
        const outputChannel = output[channel];
        for (let i = 0; i < inputChannel.length; i++) {
          phase += phaseStep;
          if (phase > tableSize) {
            phase -= tableSize;
          }
          const index = Math.floor(phase);
          const fraction = phase - index;
          const currentSample = (this.waveTable[index] * (1 - fraction)) + (this.waveTable[index + 1] * fraction);
          outputChannel[i] = currentSample + ((currentSample - prevSample) * fraction);
          prevSample = currentSample;
        }
      }
  
      this.context = null;
      this.port.onmessage = (event) => {
        if (event.data.type === 'init') {
          this.context = new AudioContext({ sampleRate: event.data.sampleRate });
        }
      };
  
  
      return true;
    }
  }
  
  registerProcessor('convert-432', Convert432);
  