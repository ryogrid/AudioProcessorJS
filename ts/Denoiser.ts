/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class Denoiser implements AudioProcessor {
    static windowLength : number = 0;

    static overlapRatio : number = 0;

    /*private*/ fs : number;

    /*private*/ noSpeechDuration : number;

    /*private*/ noSpeechSegments : number;

    /*private*/ speechFlag : boolean;

    /*private*/ noiseFlag : boolean;

    /*private*/ noiseCounter : number;

    /*private*/ noiseLength : number;

    /*private*/ noiseThreshold : number;

    /*private*/ frameReset : number;

    public constructor(fs? : any, noSpeechDuration? : any, noiseLength? : any, noiseThreshold? : any, frameReset? : any) {
        if(((typeof fs === 'number') || fs === null) && ((typeof noSpeechDuration === 'number') || noSpeechDuration === null) && ((typeof noiseLength === 'number') || noiseLength === null) && ((typeof noiseThreshold === 'number') || noiseThreshold === null) && ((typeof frameReset === 'number') || frameReset === null)) {
            let __args = Array.prototype.slice.call(arguments);
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            (() => {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                this.fs = fs;
                this.noSpeechDuration = noSpeechDuration;
                this.noSpeechSegments = (<number>Math.floor((noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1)|0);
                this.speechFlag = false;
                this.noiseFlag = false;
                this.noiseLength = noiseLength;
                this.noiseThreshold = noiseThreshold;
                this.frameReset = frameReset;
            })();
        } else if(((typeof fs === 'number') || fs === null) && ((typeof noSpeechDuration === 'number') || noSpeechDuration === null) && noiseLength === undefined && noiseThreshold === undefined && frameReset === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            (() => {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                this.fs = fs;
                this.noSpeechDuration = noSpeechDuration;
                this.noSpeechSegments = (<number>Math.floor((noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1)|0);
                this.speechFlag = false;
                this.noiseFlag = false;
                this.noiseLength = 9;
                this.noiseThreshold = 3;
                this.frameReset = 8;
            })();
        } else if(((typeof fs === 'number') || fs === null) && noSpeechDuration === undefined && noiseLength === undefined && noiseThreshold === undefined && frameReset === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            this.fs = 0;
            this.noSpeechDuration = 0;
            this.noSpeechSegments = 0;
            this.speechFlag = false;
            this.noiseFlag = false;
            this.noiseCounter = 0;
            this.noiseLength = 0;
            this.noiseThreshold = 0;
            this.frameReset = 0;
            (() => {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                this.fs = fs;
                this.noSpeechDuration = 0.4;
                this.noSpeechSegments = (<number>Math.floor((this.noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1)|0);
                this.speechFlag = false;
                this.noiseFlag = false;
                this.noiseLength = 9;
                this.noiseThreshold = 3;
                this.frameReset = 8;
            })();
        } else throw new Error('invalid overload');
    }

    public process$double_A_A(input : number[][]) : number[][] {
        let channels : number = input.length;
        let signalLength : number = input[0].length;
        let enhanced : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([channels, signalLength]);
        for(let i : number = 0; i < channels; i++) {
            enhanced[i] = this.process$double_A(input[i]);
        };
        return enhanced;
    }

    /**
     * Process function for multi-channel inputs
     * @param  {Array} input Multi channel signal
     * @return   {Array} enhanced Multi channel enhanced signal
     */
    public process(input? : any) : any {
        if(((input != null && input instanceof <any>Array && (input.length==0 || input[0] == null ||input[0] instanceof Array)) || input === null)) {
            return <any>this.process$double_A_A(input);
        } else if(((input != null && input instanceof <any>Array && (input.length==0 || input[0] == null ||(typeof input[0] === 'number'))) || input === null)) {
            return <any>this.process$double_A(input);
        } else throw new Error('invalid overload');
    }

    public process$double_A(input : number[]) : number[] {
        let sampledSignalWindowed : number[][] = this.segmentSignal(input, Denoiser.windowLength, Denoiser.overlapRatio);
        let frames : number = sampledSignalWindowed[0].length;
        let sampledSignalWindowedComplex : ComplexNumber[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return undefined; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        let signalFFT : ComplexNumber[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return undefined; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        let signalFFTMagnitude : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        let signalFFTPhase : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        for(let i : number = 0; i < frames; i++) {
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                sampledSignalWindowedComplex[i][k] = new ComplexNumber(sampledSignalWindowed[k][i]);
            };
        };
        for(let i : number = 0; i < frames; i++) {
            signalFFT[i] = Utils.fft(sampledSignalWindowedComplex[i]);
        };
        for(let i : number = 0; i < frames; i++) {
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                signalFFTMagnitude[i][k] = signalFFT[i][k].mod();
                signalFFTPhase[i][k] = signalFFT[i][k].getArg();
            };
        };
        let noise : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([this.noSpeechSegments, Denoiser.windowLength]);
        let noiseMag : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([this.noSpeechSegments, Denoiser.windowLength]);
        noise = java.util.Arrays.copyOfRange<any>(signalFFTMagnitude, 0, this.noSpeechSegments);
        for(let i : number = 0; i < this.noSpeechSegments; i++) {
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                noiseMag[i][k] = Math.pow(noise[i][k], 2);
            };
        };
        let noiseMean : number[] = Utils.mean$double_A_A$int(noise, 0);
        let noiseVar : number[] = Utils.mean$double_A_A$int(noiseMag, 0);
        let gamma1p5 : number = Utils.gamma(1.5);
        let gain : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        let gamma : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        let gammaUpdate : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        let xi : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        let nu : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        let alpha : number = 0.96;
        /* fill */((a, v) => { for(let i=0;i<a.length;i++) a[i]=v; })(gain, 1);
        /* fill */((a, v) => { for(let i=0;i<a.length;i++) a[i]=v; })(gamma, 1);
        let enhancedSpectrum : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        for(let i : number = 0; i < frames; i++) {
            if(i < this.noSpeechSegments) {
                this.speechFlag = false;
                this.noiseCounter = 100;
            } else {
                this.vad(signalFFTMagnitude[i], noiseMean);
            }
            if(this.speechFlag === false) {
                for(let k : number = 0; k < Denoiser.windowLength; k++) {
                    noiseMean[k] = (this.noiseLength * noiseMean[k] + signalFFTMagnitude[i][k]) / (this.noiseLength + 1);
                    noiseVar[k] = (this.noiseLength * noiseVar[k] + Math.pow(signalFFTMagnitude[i][k], 2)) / (this.noiseLength + 1);
                };
            }
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                gammaUpdate[k] = Math.pow(signalFFTMagnitude[i][k], 2) / noiseVar[k];
                xi[k] = alpha * Math.pow(gain[k], 2) * gamma[k] + (1 - alpha) * Math.max(gammaUpdate[k] - 1, 0);
                gamma[k] = gammaUpdate[k];
                nu[k] = gamma[k] * xi[k] / (xi[k] + 1);
                gain[k] = (gamma1p5 * Math.sqrt(nu[k])) / gamma[k] * Math.exp(-1 * nu[k] / 2) * ((1 + nu[k]) * Bessel.modBesselFirstZero(nu[k] / 2) + nu[k] * Bessel.modBesselFirstOne(nu[k] / 2));
                if(/* isNaN */isNaN(gain[k]) || /* isInfinite */((value) => Number.NEGATIVE_INFINITY === value || Number.POSITIVE_INFINITY === value)(gain[k])) {
                    gain[k] = xi[k] / (xi[k] + 1);
                }
                enhancedSpectrum[i][k] = gain[k] * signalFFTMagnitude[i][k];
            };
        };
        let enhancedSpectrumComplex : ComplexNumber[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return undefined; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        for(let i : number = 0; i < frames; i++) {
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                enhancedSpectrumComplex[i][k] = ComplexNumber.exp(new ComplexNumber(0, signalFFTPhase[i][k]));
                enhancedSpectrumComplex[i][k] = enhancedSpectrumComplex[i][k].times(enhancedSpectrum[i][k]);
            };
        };
        let enhancedSegments : ComplexNumber[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return undefined; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([frames, Denoiser.windowLength]);
        let enhancedSegmentsReal : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([Denoiser.windowLength, frames]);
        for(let i : number = 0; i < frames; i++) {
            enhancedSegments[i] = Utils.ifft(enhancedSpectrumComplex[i]);
        };
        for(let i : number = 0; i < frames; i++) {
            for(let k : number = 0; k < Denoiser.windowLength; k++) {
                enhancedSegmentsReal[k][i] = enhancedSegments[i][k].getRe();
            };
        };
        let enhanced : number[] = this.overlapAndAdd(enhancedSegmentsReal, Denoiser.overlapRatio);
        return enhanced;
    }

    /**
     * Voice activity detector that predicts wheter the current frame contains speech or not
     * @param {Array} frame  Current frame
     * @param {Array} noise   Current noise estimate
     * @param noiseCounter  Number of previous noise frames
     * @param noiseThreshold User set threshold
     * @param frameReset Number of frames after which speech flag is reset
     * @private
     */
    /*private*/ vad(frame : number[], noise : number[]) {
        let spectralDifference : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(Denoiser.windowLength);
        for(let i : number = 0; i < Denoiser.windowLength; i++) {
            spectralDifference[i] = 20 * (/* log10 */(x => Math.log(x) * Math.LOG10E)(frame[i]) - /* log10 */(x => Math.log(x) * Math.LOG10E)(noise[i]));
            if(spectralDifference[i] < 0) {
                spectralDifference[i] = 0;
            }
        };
        let diff : number = Utils.mean$double_A(spectralDifference);
        if(diff < this.noiseThreshold) {
            this.noiseFlag = true;
            this.noiseCounter++;
        } else {
            this.noiseFlag = false;
            this.noiseCounter = 0;
        }
        if(this.noiseCounter > this.frameReset) {
            this.speechFlag = false;
        } else {
            this.speechFlag = true;
        }
    }

    /**
     * Windows sampled signal using overlapping Hamming windows
     * @param {Array} ss The sampled signal
     * @param {number} ww The window width
     * @param {number} or The overlap ratio
     * @return {Array} seg The overlapping windowed segments
     * @private
     */
    /*private*/ segmentSignal(ss : number[], ww : number, or : number) : number[][] {
        let len : number = ss.length;
        let d : number = 1 - or;
        let frames : number = (<number>(Math.floor(len - ww) / ww / d)|0);
        let start : number = 0;
        let stop : number = 0;
        let window : number[] = Utils.hamming(ww);
        let seg : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([ww, frames]);
        for(let i : number = 0; i < frames; i++) {
            start = (<number>(i * ww * or)|0);
            stop = start + ww;
            for(let k : number = 0; k < ww; k++) {
                seg[k][i] = ss[start + k] * window[k];
            };
        };
        return seg;
    }

    /**
     * Overlap and add segments to calculate reconstructed signal
     * @param  {Array} segments 2D array of overlapping signal segments
     * @param  {number} or overlap ratio
     * @return   {Array} reconstructedSignal Speech signal post speech denoising
     * @private
     */
    /*private*/ overlapAndAdd(segments : number[][], or : number) : number[] {
        let ww : number = segments.length;
        let frames : number = segments[0].length;
        let start : number = 0;
        let stop : number = 0;
        let signalLength : number = (<number>(ww * (1 - or) * (frames - 1) + ww)|0);
        let reconstructedSignal : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(signalLength);
        for(let i : number = 0; i < frames; i++) {
            start = (<number>(i * ww * or)|0);
            stop = start + ww;
            for(let k : number = 0; k < ww; k++) {
                reconstructedSignal[start + k] = reconstructedSignal[start + k] + segments[k][i];
            };
        };
        return reconstructedSignal;
    }

    public static main(args : string[]) {
    }
}
Denoiser["__class"] = "Denoiser";
Denoiser["__interfaces"] = ["AudioProcessor"];





Denoiser.main(null);
