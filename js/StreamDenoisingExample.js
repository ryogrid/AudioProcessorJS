/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var StreamDenoisingExample = (function () {
    function StreamDenoisingExample() {
    }
    StreamDenoisingExample.main = function (args) {
        try {
            var filename = "asakai60.wav";
            var pos = filename.lastIndexOf(".");
            var justName = pos > 0 ? filename.substring(0, pos) : filename;
            var linearStream = javax.sound.sampled.AudioSystem.getAudioInputStream(new java.io.File(filename));
            var linearFormat = linearStream.getFormat();
            console.info(linearFormat);
            var info = new javax.sound.sampled.DataLine.Info("javax.sound.sampled.SourceDataLine", linearFormat);
            WavFile2.sourceDataLine = javax.sound.sampled.AudioSystem.getLine(info);
            WavFile2.sourceDataLine.open(linearFormat);
            WavFile2.sourceDataLine.start();
            var wavFile = WavFile2.openWavFile(new java.io.File(filename));
            wavFile.display();
            var fs = (wavFile.getSampleRate() | 0);
            var validBits = wavFile.getValidBits();
            var numChannels = wavFile.getNumChannels();
            var numFrames = (wavFile.getNumFrames() | 0);
            var samples = numFrames * numChannels;
            var splitFrames = 256;
            var buffer = (function (s) { var a = []; while (s-- > 0)
                a.push(0); return a; })(samples);
            var buffer2 = (function (s) { var a = []; while (s-- > 0)
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
            } }; return allocate(dims); })([numChannels, splitFrames]);
            var framesRead = void 0;
            framesRead = wavFile.readFrames$double_A$int(buffer, numFrames);
            wavFile.close();
            var enhancedSingle = void 0;
            var enhanced = void 0;
            var output = WavFile.newWavFile(new java.io.File(justName + "_enhanced3.wav"), numChannels, numFrames, validBits, fs);
            var denoiser = new Denoiser(fs, 0.4, 9, 2, 8);
            if (numChannels === 1) {
                enhancedSingle = denoiser.process$double_A(buffer);
                output.writeFrames$double_A$int(enhancedSingle, enhancedSingle.length);
            }
            else {
                for (var j = 0; j < numFrames; j += splitFrames) {
                    for (var i = j; i < j + splitFrames; i++) {
                        for (var k = 0; k < numChannels; k++) {
                            splitChannel[k][i - j] = buffer[i * numChannels + k];
                        }
                        ;
                    }
                    ;
                    enhanced = denoiser.process$double_A_A(splitChannel);
                    for (var i = 0; i < enhanced[0].length; i++) {
                        for (var k = 0; k < numChannels; k++) {
                            buffer2[i * numChannels + k] = (enhanced[k][i] | 0);
                        }
                        ;
                    }
                    ;
                    output.writeFrames$double_A$int(buffer2, buffer2.length);
                }
                ;
            }
        }
        catch (e) {
            console.error(e.message, e);
        }
        ;
    };
    return StreamDenoisingExample;
}());
StreamDenoisingExample["__class"] = "StreamDenoisingExample";
StreamDenoisingExample.main(null);
