/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class SpeechEnhancementTest {
    public static main(args : string[]) {
        try {
            let filename : string = "asakai60.wav";
            let pos : number = filename.lastIndexOf(".");
            let justName : string = pos > 0?filename.substring(0, pos):filename;
            let wavFile : WavFile = WavFile.openWavFile(new java.io.File(filename));
            wavFile.display();
            let fs : number = (<number>wavFile.getSampleRate()|0);
            let validBits : number = wavFile.getValidBits();
            let numChannels : number = wavFile.getNumChannels();
            let numFrames : number = (<number>wavFile.getNumFrames()|0);
            let samples : number = numFrames * numChannels;
            let buffer : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(samples);
            let splitChannel : number[][] = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return 0; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([numChannels, numFrames]);
            let framesRead : number;
            framesRead = wavFile.readFrames$double_A$int(buffer, numFrames);
            wavFile.close();
            let enhancedSingle : number[];
            let enhanced : number[][];
            let output : WavFile = WavFile.newWavFile(new java.io.File(justName + "_enhanced.wav"), numChannels, numFrames, validBits, fs);
            let denoiser : Denoiser = new Denoiser(fs, 0.4, 9, 2, 8);
            if(numChannels === 1) {
                enhancedSingle = denoiser.process$double_A(buffer);
                output.writeFrames$double_A$int(enhancedSingle, enhancedSingle.length);
            } else {
                for(let i : number = 0; i < numFrames; i++) {
                    for(let k : number = 0; k < numChannels; k++) {
                        splitChannel[k][i] = buffer[i * numChannels + k];
                    };
                };
                enhanced = denoiser.process$double_A_A(splitChannel);
                for(let i : number = 0; i < enhanced[0].length; i++) {
                    for(let k : number = 0; k < numChannels; k++) {
                        buffer[i * numChannels + k] = enhanced[k][i];
                    };
                };
                output.writeFrames$double_A$int(buffer, buffer.length);
            }
        } catch(e) {
            console.info(e);
        };
    }
}
SpeechEnhancementTest["__class"] = "SpeechEnhancementTest";




SpeechEnhancementTest.main(null);
