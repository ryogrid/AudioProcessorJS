/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var SpeechEnhancementTest = (function () {
    function SpeechEnhancementTest() {
    }
    SpeechEnhancementTest.main = function (args) {
        try {
            var filename = "asakai60.wav";
            var pos = filename.lastIndexOf(".");
            var justName = pos > 0 ? filename.substring(0, pos) : filename;
            var wavFile = WavFile.openWavFile(new java.io.File(filename));
            wavFile.display();
            var fs = (wavFile.getSampleRate() | 0);
            var validBits = wavFile.getValidBits();
            var numChannels = wavFile.getNumChannels();
            var numFrames = (wavFile.getNumFrames() | 0);
            var samples = numFrames * numChannels;
            var buffer = (function (s) { var a = []; while (s-- > 0)
                a.push(0); return a; })(samples);
            var splitChannel = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
                return 0;
            }
            else {
                var array = [];
                for (var i = 0; i < dims[0]; i++) {
                    array.push(allocate(dims.slice(1)));
                }
                return array;
            } }; return allocate(dims); })([numChannels, numFrames]);
            var framesRead = void 0;
            framesRead = wavFile.readFrames$double_A$int(buffer, numFrames);
            wavFile.close();
            var enhancedSingle = void 0;
            var enhanced = void 0;
            var output = WavFile.newWavFile(new java.io.File(justName + "_enhanced.wav"), numChannels, numFrames, validBits, fs);
            var denoiser = new Denoiser(fs, 0.4, 9, 2, 8);
            if (numChannels === 1) {
                enhancedSingle = denoiser.process$double_A(buffer);
                output.writeFrames$double_A$int(enhancedSingle, enhancedSingle.length);
            }
            else {
                for (var i = 0; i < numFrames; i++) {
                    for (var k = 0; k < numChannels; k++) {
                        splitChannel[k][i] = buffer[i * numChannels + k];
                    }
                    ;
                }
                ;
                enhanced = denoiser.process$double_A_A(splitChannel);
                for (var i = 0; i < enhanced[0].length; i++) {
                    for (var k = 0; k < numChannels; k++) {
                        buffer[i * numChannels + k] = enhanced[k][i];
                    }
                    ;
                }
                ;
                output.writeFrames$double_A$int(buffer, buffer.length);
            }
        }
        catch (e) {
            console.info(e);
        }
        ;
    };
    return SpeechEnhancementTest;
}());
SpeechEnhancementTest["__class"] = "SpeechEnhancementTest";
SpeechEnhancementTest.main(null);
