/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var Denoiser = (function () {
    function Denoiser(fs, noSpeechDuration, noiseLength, noiseThreshold, frameReset) {
        var _this = this;
        if (((typeof fs === 'number') || fs === null) && ((typeof noSpeechDuration === 'number') || noSpeechDuration === null) && ((typeof noiseLength === 'number') || noiseLength === null) && ((typeof noiseThreshold === 'number') || noiseThreshold === null) && ((typeof frameReset === 'number') || frameReset === null)) {
            var __args = Array.prototype.slice.call(arguments);
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
            (function () {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                _this.fs = fs;
                _this.noSpeechDuration = noSpeechDuration;
                _this.noSpeechSegments = (Math.floor((noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1) | 0);
                _this.speechFlag = false;
                _this.noiseFlag = false;
                _this.noiseLength = noiseLength;
                _this.noiseThreshold = noiseThreshold;
                _this.frameReset = frameReset;
            })();
        }
        else if (((typeof fs === 'number') || fs === null) && ((typeof noSpeechDuration === 'number') || noSpeechDuration === null) && noiseLength === undefined && noiseThreshold === undefined && frameReset === undefined) {
            var __args = Array.prototype.slice.call(arguments);
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
            (function () {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                _this.fs = fs;
                _this.noSpeechDuration = noSpeechDuration;
                _this.noSpeechSegments = (Math.floor((noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1) | 0);
                _this.speechFlag = false;
                _this.noiseFlag = false;
                _this.noiseLength = 9;
                _this.noiseThreshold = 3;
                _this.frameReset = 8;
            })();
        }
        else if (((typeof fs === 'number') || fs === null) && noSpeechDuration === undefined && noiseLength === undefined && noiseThreshold === undefined && frameReset === undefined) {
            var __args = Array.prototype.slice.call(arguments);
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
            (function () {
                Denoiser.windowLength = 256;
                Denoiser.overlapRatio = 0.5;
                _this.fs = fs;
                _this.noSpeechDuration = 0.4;
                _this.noSpeechSegments = (Math.floor((_this.noSpeechDuration * fs - Denoiser.windowLength) / (Denoiser.overlapRatio * Denoiser.windowLength) + 1) | 0);
                _this.speechFlag = false;
                _this.noiseFlag = false;
                _this.noiseLength = 9;
                _this.noiseThreshold = 3;
                _this.frameReset = 8;
            })();
        }
        else
            throw new Error('invalid overload');
    }
    Denoiser.prototype.process$double_A_A = function (input) {
        var channels = input.length;
        var signalLength = input[0].length;
        var enhanced = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([channels, signalLength]);
        for (var i = 0; i < channels; i++) {
            enhanced[i] = this.process$double_A(input[i]);
        }
        ;
        return enhanced;
    };
    /**
     * Process function for multi-channel inputs
     * @param  {Array} input Multi channel signal
     * @return   {Array} enhanced Multi channel enhanced signal
     */
    Denoiser.prototype.process = function (input) {
        if (((input != null && input instanceof Array && (input.length == 0 || input[0] == null || input[0] instanceof Array)) || input === null)) {
            return this.process$double_A_A(input);
        }
        else if (((input != null && input instanceof Array && (input.length == 0 || input[0] == null || (typeof input[0] === 'number'))) || input === null)) {
            return this.process$double_A(input);
        }
        else
            throw new Error('invalid overload');
    };
    Denoiser.prototype.process$double_A = function (input) {
        var sampledSignalWindowed = this.segmentSignal(input, Denoiser.windowLength, Denoiser.overlapRatio);
        var frames = sampledSignalWindowed[0].length;
        var sampledSignalWindowedComplex = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return undefined;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        var signalFFT = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return undefined;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        var signalFFTMagnitude = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        var signalFFTPhase = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        for (var i = 0; i < frames; i++) {
            for (var k = 0; k < Denoiser.windowLength; k++) {
                sampledSignalWindowedComplex[i][k] = new ComplexNumber(sampledSignalWindowed[k][i]);
            }
            ;
        }
        ;
        for (var i = 0; i < frames; i++) {
            signalFFT[i] = Utils.fft(sampledSignalWindowedComplex[i]);
        }
        ;
        for (var i = 0; i < frames; i++) {
            for (var k = 0; k < Denoiser.windowLength; k++) {
                signalFFTMagnitude[i][k] = signalFFT[i][k].mod();
                signalFFTPhase[i][k] = signalFFT[i][k].getArg();
            }
            ;
        }
        ;
        var noise = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([this.noSpeechSegments, Denoiser.windowLength]);
        var noiseMag = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([this.noSpeechSegments, Denoiser.windowLength]);
        noise = java.util.Arrays.copyOfRange(signalFFTMagnitude, 0, this.noSpeechSegments);
        for (var i = 0; i < this.noSpeechSegments; i++) {
            for (var k = 0; k < Denoiser.windowLength; k++) {
                noiseMag[i][k] = Math.pow(noise[i][k], 2);
            }
            ;
        }
        ;
        var noiseMean = Utils.mean$double_A_A$int(noise, 0);
        var noiseVar = Utils.mean$double_A_A$int(noiseMag, 0);
        var gamma1p5 = Utils.gamma(1.5);
        var gain = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        var gamma = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        var gammaUpdate = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        var xi = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        var nu = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        var alpha = 0.96;
        /* fill */ (function (a, v) { for (var i = 0; i < a.length; i++)
            a[i] = v; })(gain, 1);
        /* fill */ (function (a, v) { for (var i = 0; i < a.length; i++)
            a[i] = v; })(gamma, 1);
        var enhancedSpectrum = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        for (var i = 0; i < frames; i++) {
            if (i < this.noSpeechSegments) {
                this.speechFlag = false;
                this.noiseCounter = 100;
            }
            else {
                this.vad(signalFFTMagnitude[i], noiseMean);
            }
            if (this.speechFlag === false) {
                for (var k = 0; k < Denoiser.windowLength; k++) {
                    noiseMean[k] = (this.noiseLength * noiseMean[k] + signalFFTMagnitude[i][k]) / (this.noiseLength + 1);
                    noiseVar[k] = (this.noiseLength * noiseVar[k] + Math.pow(signalFFTMagnitude[i][k], 2)) / (this.noiseLength + 1);
                }
                ;
            }
            for (var k = 0; k < Denoiser.windowLength; k++) {
                gammaUpdate[k] = Math.pow(signalFFTMagnitude[i][k], 2) / noiseVar[k];
                xi[k] = alpha * Math.pow(gain[k], 2) * gamma[k] + (1 - alpha) * Math.max(gammaUpdate[k] - 1, 0);
                gamma[k] = gammaUpdate[k];
                nu[k] = gamma[k] * xi[k] / (xi[k] + 1);
                gain[k] = (gamma1p5 * Math.sqrt(nu[k])) / gamma[k] * Math.exp(-1 * nu[k] / 2) * ((1 + nu[k]) * Bessel.modBesselFirstZero(nu[k] / 2) + nu[k] * Bessel.modBesselFirstOne(nu[k] / 2));
                if (isNaN(gain[k]) || (function (value) { return Number.NEGATIVE_INFINITY === value || Number.POSITIVE_INFINITY === value; })(gain[k])) {
                    gain[k] = xi[k] / (xi[k] + 1);
                }
                enhancedSpectrum[i][k] = gain[k] * signalFFTMagnitude[i][k];
            }
            ;
        }
        ;
        var enhancedSpectrumComplex = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return undefined;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        for (var i = 0; i < frames; i++) {
            for (var k = 0; k < Denoiser.windowLength; k++) {
                enhancedSpectrumComplex[i][k] = ComplexNumber.exp(new ComplexNumber(0, signalFFTPhase[i][k]));
                enhancedSpectrumComplex[i][k] = enhancedSpectrumComplex[i][k].times(enhancedSpectrum[i][k]);
            }
            ;
        }
        ;
        var enhancedSegments = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return undefined;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([frames, Denoiser.windowLength]);
        var enhancedSegmentsReal = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([Denoiser.windowLength, frames]);
        for (var i = 0; i < frames; i++) {
            enhancedSegments[i] = Utils.ifft(enhancedSpectrumComplex[i]);
        }
        ;
        for (var i = 0; i < frames; i++) {
            for (var k = 0; k < Denoiser.windowLength; k++) {
                enhancedSegmentsReal[k][i] = enhancedSegments[i][k].getRe();
            }
            ;
        }
        ;
        var enhanced = this.overlapAndAdd(enhancedSegmentsReal, Denoiser.overlapRatio);
        return enhanced;
    };
    /**
     * Voice activity detector that predicts wheter the current frame contains speech or not
     * @param {Array} frame  Current frame
     * @param {Array} noise   Current noise estimate
     * @param noiseCounter  Number of previous noise frames
     * @param noiseThreshold User set threshold
     * @param frameReset Number of frames after which speech flag is reset
     * @private
     */
    /*private*/ Denoiser.prototype.vad = function (frame, noise) {
        var spectralDifference = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Denoiser.windowLength);
        for (var i = 0; i < Denoiser.windowLength; i++) {
            spectralDifference[i] = 20 * ((function (x) { return Math.log(x) * Math.LOG10E; })(frame[i]) - (function (x) { return Math.log(x) * Math.LOG10E; })(noise[i]));
            if (spectralDifference[i] < 0) {
                spectralDifference[i] = 0;
            }
        }
        ;
        var diff = Utils.mean$double_A(spectralDifference);
        if (diff < this.noiseThreshold) {
            this.noiseFlag = true;
            this.noiseCounter++;
        }
        else {
            this.noiseFlag = false;
            this.noiseCounter = 0;
        }
        if (this.noiseCounter > this.frameReset) {
            this.speechFlag = false;
        }
        else {
            this.speechFlag = true;
        }
    };
    /**
     * Windows sampled signal using overlapping Hamming windows
     * @param {Array} ss The sampled signal
     * @param {number} ww The window width
     * @param {number} or The overlap ratio
     * @return {Array} seg The overlapping windowed segments
     * @private
     */
    /*private*/ Denoiser.prototype.segmentSignal = function (ss, ww, or) {
        var len = ss.length;
        var d = 1 - or;
        var frames = ((Math.floor(len - ww) / ww / d) | 0);
        var start = 0;
        var stop = 0;
        var window = Utils.hamming(ww);
        var seg = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
            return 0;
        }
        else {
            var array = [];
            for (var i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([ww, frames]);
        for (var i = 0; i < frames; i++) {
            start = ((i * ww * or) | 0);
            stop = start + ww;
            for (var k = 0; k < ww; k++) {
                seg[k][i] = ss[start + k] * window[k];
            }
            ;
        }
        ;
        return seg;
    };
    /**
     * Overlap and add segments to calculate reconstructed signal
     * @param  {Array} segments 2D array of overlapping signal segments
     * @param  {number} or overlap ratio
     * @return   {Array} reconstructedSignal Speech signal post speech denoising
     * @private
     */
    /*private*/ Denoiser.prototype.overlapAndAdd = function (segments, or) {
        var ww = segments.length;
        var frames = segments[0].length;
        var start = 0;
        var stop = 0;
        var signalLength = ((ww * (1 - or) * (frames - 1) + ww) | 0);
        var reconstructedSignal = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(signalLength);
        for (var i = 0; i < frames; i++) {
            start = ((i * ww * or) | 0);
            stop = start + ww;
            for (var k = 0; k < ww; k++) {
                reconstructedSignal[start + k] = reconstructedSignal[start + k] + segments[k][i];
            }
            ;
        }
        ;
        return reconstructedSignal;
    };
    Denoiser.main = function (args) {
    };
    return Denoiser;
}());
Denoiser.windowLength = 0;
Denoiser.overlapRatio = 0;
Denoiser["__class"] = "Denoiser";
Denoiser["__interfaces"] = ["AudioProcessor"];
Denoiser.main(null);
