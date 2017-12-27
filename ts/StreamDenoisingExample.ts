/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class StreamDenoisingExample {
    public static main(args : string[]) {
        try {
            let filename : string = "asakai60.wav";
            let pos : number = filename.lastIndexOf(".");
            let justName : string = pos > 0?filename.substring(0, pos):filename;
            let linearStream : javax.sound.sampled.AudioInputStream = javax.sound.sampled.AudioSystem.getAudioInputStream(new java.io.File(filename));
            let linearFormat : javax.sound.sampled.AudioFormat = linearStream.getFormat();
            console.info(linearFormat);
            let info : javax.sound.sampled.DataLine.Info = new javax.sound.sampled.DataLine.Info("javax.sound.sampled.SourceDataLine", linearFormat);
            WavFile2.sourceDataLine = <javax.sound.sampled.SourceDataLine><any>javax.sound.sampled.AudioSystem.getLine(info);
            WavFile2.sourceDataLine.open(linearFormat);
            WavFile2.sourceDataLine.start();
            let wavFile : WavFile2 = WavFile2.openWavFile(new java.io.File(filename));
            wavFile.display();
            let fs : number = (<number>wavFile.getSampleRate()|0);
            let validBits : number = wavFile.getValidBits();
            let numChannels : number = wavFile.getNumChannels();
            let numFrames : number = (<number>wavFile.getNumFrames()|0);
            let samples : number = numFrames * numChannels;
            let splitFrames : number = 256;
            let buffer : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(samples);
            let buffer2 : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(samples);
            let splitChannel : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([numChannels, splitFrames]);
            let framesRead : number;
            framesRead = wavFile.readFrames$double_A$int(buffer, numFrames);
            wavFile.close();
            let enhancedSingle : number[];
            let enhanced : number[][];
            let output : WavFile = WavFile.newWavFile(new java.io.File(justName + "_enhanced3.wav"), numChannels, numFrames, validBits, fs);
            let denoiser : Denoiser = new Denoiser(fs, 0.4, 9, 2, 8);
            if(numChannels === 1) {
                enhancedSingle = denoiser.process$double_A(buffer);
                output.writeFrames$double_A$int(enhancedSingle, enhancedSingle.length);
            } else {
                for(let j : number = 0; j < numFrames; j += splitFrames) {
                    for(let i : number = j; i < j + splitFrames; i++) {
                        for(let k : number = 0; k < numChannels; k++) {
                            splitChannel[k][i - j] = buffer[i * numChannels + k];
                        };
                    };
                    enhanced = denoiser.process$double_A_A(splitChannel);
                    for(let i : number = 0; i < enhanced[0].length; i++) {
                        for(let k : number = 0; k < numChannels; k++) {
                            buffer2[i * numChannels + k] = (<number>enhanced[k][i]|0);
                        };
                    };
                    output.writeFrames$double_A$int(buffer2, buffer2.length);
                };
            }
        } catch(e) {
            console.error(e.message, e);
        };
    }
}
StreamDenoisingExample["__class"] = "StreamDenoisingExample";




StreamDenoisingExample.main(null);
