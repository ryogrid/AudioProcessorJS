/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class WavFile2 {
    public static sourceDataLine : javax.sound.sampled.SourceDataLine = null;

    static BUFFER_SIZE : number = 4096;

    static FMT_CHUNK_ID : number = 544501094;

    static DATA_CHUNK_ID : number = 1635017060;

    static RIFF_CHUNK_ID : number = 1179011410;

    static RIFF_TYPE_ID : number = 1163280727;

    /*private*/ file : java.io.File;

    /*private*/ ioState : WavFile2.IOState;

    /*private*/ bytesPerSample : number;

    /*private*/ numFrames : number;

    /*private*/ oStream : java.io.FileOutputStream;

    /*private*/ iStream : java.io.FileInputStream;

    /*private*/ floatScale : number;

    /*private*/ floatOffset : number;

    /*private*/ wordAlignAdjust : boolean;

    /*private*/ numChannels : number;

    /*private*/ sampleRate : number;

    /*private*/ blockAlign : number;

    /*private*/ validBits : number;

    /*private*/ buffer : number[];

    /*private*/ bufferPointer : number;

    /*private*/ bytesRead : number;

    /*private*/ frameCounter : number;

    constructor() {
        this.file = null;
        this.ioState = null;
        this.bytesPerSample = 0;
        this.numFrames = 0;
        this.oStream = null;
        this.iStream = null;
        this.floatScale = 0;
        this.floatOffset = 0;
        this.wordAlignAdjust = false;
        this.numChannels = 0;
        this.sampleRate = 0;
        this.blockAlign = 0;
        this.validBits = 0;
        this.buffer = null;
        this.bufferPointer = 0;
        this.bytesRead = 0;
        this.frameCounter = 0;
        this.buffer = (s => { let a=[]; while(s-->0) a.push(0); return a; })(WavFile2.BUFFER_SIZE);
    }

    public getNumChannels() : number {
        return this.numChannels;
    }

    public getNumFrames() : number {
        return this.numFrames;
    }

    public getFramesRemaining() : number {
        return this.numFrames - this.frameCounter;
    }

    public getSampleRate() : number {
        return this.sampleRate;
    }

    public getValidBits() : number {
        return this.validBits;
    }

    public static newWavFile(file : java.io.File, numChannels : number, numFrames : number, validBits : number, sampleRate : number) : WavFile2 {
        let wavFile : WavFile2 = new WavFile2();
        wavFile.file = file;
        wavFile.numChannels = numChannels;
        wavFile.numFrames = numFrames;
        wavFile.sampleRate = sampleRate;
        wavFile.bytesPerSample = ((validBits + 7) / 8|0);
        wavFile.blockAlign = wavFile.bytesPerSample * numChannels;
        wavFile.validBits = validBits;
        if(numChannels < 1 || numChannels > 65535) throw new WavFileException("Illegal number of channels, valid range 1 to 65536");
        if(numFrames < 0) throw new WavFileException("Number of frames must be positive");
        if(validBits < 2 || validBits > 65535) throw new WavFileException("Illegal number of valid bits, valid range 2 to 65536");
        if(sampleRate < 0) throw new WavFileException("Sample rate must be positive");
        wavFile.oStream = new java.io.FileOutputStream(file);
        let dataChunkSize : number = wavFile.blockAlign * numFrames;
        let mainChunkSize : number = 4 + 8 + 16 + 8 + dataChunkSize;
        if(dataChunkSize % 2 === 1) {
            mainChunkSize += 1;
            wavFile.wordAlignAdjust = true;
        } else {
            wavFile.wordAlignAdjust = false;
        }
        WavFile2.putLE(WavFile2.RIFF_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile2.putLE(mainChunkSize, wavFile.buffer, 4, 4);
        WavFile2.putLE(WavFile2.RIFF_TYPE_ID, wavFile.buffer, 8, 4);
        wavFile.oStream.write(wavFile.buffer, 0, 12);
        let averageBytesPerSecond : number = sampleRate * wavFile.blockAlign;
        WavFile2.putLE(WavFile2.FMT_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile2.putLE(16, wavFile.buffer, 4, 4);
        WavFile2.putLE(1, wavFile.buffer, 8, 2);
        WavFile2.putLE(numChannels, wavFile.buffer, 10, 2);
        WavFile2.putLE(sampleRate, wavFile.buffer, 12, 4);
        WavFile2.putLE(averageBytesPerSecond, wavFile.buffer, 16, 4);
        WavFile2.putLE(wavFile.blockAlign, wavFile.buffer, 20, 2);
        WavFile2.putLE(validBits, wavFile.buffer, 22, 2);
        wavFile.oStream.write(wavFile.buffer, 0, 24);
        WavFile2.putLE(WavFile2.DATA_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile2.putLE(dataChunkSize, wavFile.buffer, 4, 4);
        wavFile.oStream.write(wavFile.buffer, 0, 8);
        if(wavFile.validBits > 8) {
            wavFile.floatOffset = 0;
            wavFile.floatScale = Number.MAX_VALUE >> (64 - wavFile.validBits);
        } else {
            wavFile.floatOffset = 1;
            wavFile.floatScale = 0.5 * ((1 << wavFile.validBits) - 1);
        }
        wavFile.bufferPointer = 0;
        wavFile.bytesRead = 0;
        wavFile.frameCounter = 0;
        wavFile.ioState = WavFile2.IOState.WRITING;
        return wavFile;
    }

    public static openWavFile(file : java.io.File) : WavFile2 {
        let wavFile : WavFile2 = new WavFile2();
        wavFile.file = file;
        wavFile.iStream = new java.io.FileInputStream(file);
        let bytesRead : number = wavFile.iStream.read(wavFile.buffer, 0, 12);
        if(bytesRead !== 12) throw new WavFileException("Not enough wav file bytes for header");
        let riffChunkID : number = WavFile2.getLE(wavFile.buffer, 0, 4);
        let chunkSize : number = WavFile2.getLE(wavFile.buffer, 4, 4);
        let riffTypeID : number = WavFile2.getLE(wavFile.buffer, 8, 4);
        if(riffChunkID !== WavFile2.RIFF_CHUNK_ID) throw new WavFileException("Invalid Wav Header data, incorrect riff chunk ID");
        if(riffTypeID !== WavFile2.RIFF_TYPE_ID) throw new WavFileException("Invalid Wav Header data, incorrect riff type ID");
        if(file.length() !== chunkSize + 8) {
            throw new WavFileException("Header chunk size (" + chunkSize + ") does not match file size (" + file.length() + ")");
        }
        let foundFormat : boolean = false;
        let foundData : boolean = false;
        while((true)) {
            bytesRead = wavFile.iStream.read(wavFile.buffer, 0, 8);
            if(bytesRead === -1) throw new WavFileException("Reached end of file without finding format chunk");
            if(bytesRead !== 8) throw new WavFileException("Could not read chunk header");
            let chunkID : number = WavFile2.getLE(wavFile.buffer, 0, 4);
            chunkSize = WavFile2.getLE(wavFile.buffer, 4, 4);
            let numChunkBytes : number = (chunkSize % 2 === 1)?chunkSize + 1:chunkSize;
            if(chunkID === WavFile2.FMT_CHUNK_ID) {
                foundFormat = true;
                bytesRead = wavFile.iStream.read(wavFile.buffer, 0, 16);
                let compressionCode : number = (<number>WavFile2.getLE(wavFile.buffer, 0, 2)|0);
                if(compressionCode !== 1) throw new WavFileException("Compression Code " + compressionCode + " not supported");
                wavFile.numChannels = (<number>WavFile2.getLE(wavFile.buffer, 2, 2)|0);
                wavFile.sampleRate = WavFile2.getLE(wavFile.buffer, 4, 4);
                wavFile.blockAlign = (<number>WavFile2.getLE(wavFile.buffer, 12, 2)|0);
                wavFile.validBits = (<number>WavFile2.getLE(wavFile.buffer, 14, 2)|0);
                if(wavFile.numChannels === 0) throw new WavFileException("Number of channels specified in header is equal to zero");
                if(wavFile.blockAlign === 0) throw new WavFileException("Block Align specified in header is equal to zero");
                if(wavFile.validBits < 2) throw new WavFileException("Valid Bits specified in header is less than 2");
                if(wavFile.validBits > 64) throw new WavFileException("Valid Bits specified in header is greater than 64, this is greater than a long can hold");
                wavFile.bytesPerSample = ((wavFile.validBits + 7) / 8|0);
                if(wavFile.bytesPerSample * wavFile.numChannels !== wavFile.blockAlign) throw new WavFileException("Block Align does not agree with bytes required for validBits and number of channels");
                numChunkBytes -= 16;
                if(numChunkBytes > 0) wavFile.iStream.skip(numChunkBytes);
            } else if(chunkID === WavFile2.DATA_CHUNK_ID) {
                if(foundFormat === false) throw new WavFileException("Data chunk found before Format chunk");
                if(chunkSize % wavFile.blockAlign !== 0) throw new WavFileException("Data Chunk size is not multiple of Block Align");
                wavFile.numFrames = Math.floor(chunkSize / wavFile.blockAlign);
                foundData = true;
                break;
            } else {
                wavFile.iStream.skip(numChunkBytes);
            }
        };
        if(foundData === false) throw new WavFileException("Did not find a data chunk");
        if(wavFile.validBits > 8) {
            wavFile.floatOffset = 0;
            wavFile.floatScale = 1 << (wavFile.validBits - 1);
        } else {
            wavFile.floatOffset = -1;
            wavFile.floatScale = 0.5 * ((1 << wavFile.validBits) - 1);
        }
        wavFile.bufferPointer = 0;
        wavFile.bytesRead = 0;
        wavFile.frameCounter = 0;
        wavFile.ioState = WavFile2.IOState.READING;
        return wavFile;
    }

    static getLE(buffer : number[], pos : number, numBytes : number) : number {
        numBytes--;
        pos += numBytes;
        let val : number = buffer[pos] & 255;
        for(let b : number = 0; b < numBytes; b++) val = (val << 8) + (buffer[--pos] & 255);
        return val;
    }

    static putLE(val : number, buffer : number[], pos : number, numBytes : number) {
        for(let b : number = 0; b < numBytes; b++) {
            buffer[pos] = (<number>(val & 255)|0);
            val >>= 8;
            pos++;
        };
    }

    writeSample(val : number) {
        for(let b : number = 0; b < this.bytesPerSample; b++) {
            if(this.bufferPointer === WavFile2.BUFFER_SIZE) {
                this.oStream.write(this.buffer, 0, WavFile2.BUFFER_SIZE);
                this.bufferPointer = 0;
            }
            this.buffer[this.bufferPointer] = (<number>(val & 255)|0);
            val >>= 8;
            this.bufferPointer++;
        };
    }

    readSample() : number {
        let val : number = 0;
        for(let b : number = 0; b < this.bytesPerSample; b++) {
            if(this.bufferPointer === this.bytesRead) {
                let read : number = this.iStream.read(this.buffer, 0, WavFile2.BUFFER_SIZE);
                if(read === -1) throw new WavFileException("Not enough data available");
                this.bytesRead = read;
                this.bufferPointer = 0;
            }
            let v : number = this.buffer[this.bufferPointer];
            if(b < this.bytesPerSample - 1 || this.bytesPerSample === 1) v &= 255;
            val += v << (b * 8);
            this.bufferPointer++;
        };
        return val;
    }

    public readFrames$int_A$int(sampleBuffer : number[], numFramesToRead : number) : number {
        return this.readFrames$int_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$int_A$int$int(sampleBuffer : number[], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = (<number>this.readSample()|0);
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public readFrames(sampleBuffer? : any, offset? : any, numFramesToRead? : any) : any {
        if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$int_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$int_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$long_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$long_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$double_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return <any>this.readFrames$double_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$int_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$int_A_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$long_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$long_A_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$double_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return <any>this.readFrames$double_A_A$int(sampleBuffer, offset);
        } else throw new Error('invalid overload');
    }

    public readFrames$int_A_A$int(sampleBuffer : number[][], numFramesToRead : number) : number {
        return this.readFrames$int_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$int_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) sampleBuffer[c][offset] = (<number>this.readSample()|0);
            offset++;
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public writeFrames$int_A$int(sampleBuffer : number[], numFramesToWrite : number) : number {
        return this.writeFrames$int_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$int_A$int$int(sampleBuffer : number[], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                this.writeSample(sampleBuffer[offset]);
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public writeFrames(sampleBuffer? : any, offset? : any, numFramesToWrite? : any) : any {
        if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$int_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$int_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$long_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$long_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$double_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return <any>this.writeFrames$double_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$int_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$int_A_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$long_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$long_A_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||(typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$double_A$int(sampleBuffer, offset);
        } else if(((sampleBuffer != null && sampleBuffer instanceof <any>Array && (sampleBuffer.length==0 || sampleBuffer[0] == null ||sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return <any>this.writeFrames$double_A_A$int(sampleBuffer, offset);
        } else throw new Error('invalid overload');
    }

    public writeFrames$int_A_A$int(sampleBuffer : number[][], numFramesToWrite : number) : number {
        return this.writeFrames$int_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$int_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) this.writeSample(sampleBuffer[c][offset]);
            offset++;
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public readFrames$long_A$int(sampleBuffer : number[], numFramesToRead : number) : number {
        return this.readFrames$long_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$long_A$int$int(sampleBuffer : number[], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = this.readSample();
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public readFrames$long_A_A$int(sampleBuffer : number[][], numFramesToRead : number) : number {
        return this.readFrames$long_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$long_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) sampleBuffer[c][offset] = this.readSample();
            offset++;
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public writeFrames$long_A$int(sampleBuffer : number[], numFramesToWrite : number) : number {
        return this.writeFrames$long_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$long_A$int$int(sampleBuffer : number[], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                this.writeSample(sampleBuffer[offset]);
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public writeFrames$long_A_A$int(sampleBuffer : number[][], numFramesToWrite : number) : number {
        return this.writeFrames$long_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$long_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) this.writeSample(sampleBuffer[c][offset]);
            offset++;
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public readFrames$double_A$int(sampleBuffer : number[], numFramesToRead : number) : number {
        return this.readFrames$double_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$double_A$int$int(sampleBuffer : number[], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = this.floatOffset + <number>this.readSample() / this.floatScale;
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public readFrames$double_A_A$int(sampleBuffer : number[][], numFramesToRead : number) : number {
        return this.readFrames$double_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    }

    public readFrames$double_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToRead : number) : number {
        if(this.ioState !== WavFile2.IOState.READING) throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToRead; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) sampleBuffer[c][offset] = this.floatOffset + <number>this.readSample() / this.floatScale;
            offset++;
            this.frameCounter++;
        };
        return numFramesToRead;
    }

    public writeFrames$double_A$int(sampleBuffer : number[], numFramesToWrite : number) : number {
        return this.writeFrames$double_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$double_A$int$int(sampleBuffer : number[], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) {
                this.writeSample(Math.floor(<number>(this.floatScale * (this.floatOffset + sampleBuffer[offset]))));
                offset++;
            };
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public writeFrames$double_A_A$int(sampleBuffer : number[][], numFramesToWrite : number) : number {
        return this.writeFrames$double_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    }

    public writeFrames$double_A_A$int$int(sampleBuffer : number[][], offset : number, numFramesToWrite : number) : number {
        if(this.ioState !== WavFile2.IOState.WRITING) throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.io.IOException','java.lang.Object','java.lang.Exception'] });
        for(let f : number = 0; f < numFramesToWrite; f++) {
            if(this.frameCounter === this.numFrames) return f;
            for(let c : number = 0; c < this.numChannels; c++) this.writeSample(Math.floor(<number>(this.floatScale * (this.floatOffset + sampleBuffer[c][offset]))));
            offset++;
            this.frameCounter++;
        };
        return numFramesToWrite;
    }

    public close() {
        if(this.iStream != null) {
            this.iStream.close();
            this.iStream = null;
        }
        if(this.oStream != null) {
            if(this.bufferPointer > 0) this.oStream.write(this.buffer, 0, this.bufferPointer);
            if(this.wordAlignAdjust) this.oStream.write(0);
            this.oStream.close();
            this.oStream = null;
        }
        this.ioState = WavFile2.IOState.CLOSED;
    }

    public display$() {
        this.display$java_io_PrintStream(java.lang.System.out);
    }

    public display$java_io_PrintStream(out : java.io.PrintStream) {
        out.printf("File: %s\n", this.file);
        out.printf("Channels: %d, Frames: %d\n", this.numChannels, this.numFrames);
        out.printf("IO State: %s\n", this.ioState);
        out.printf("Sample Rate: %d, Block Align: %d\n", this.sampleRate, this.blockAlign);
        out.printf("Valid Bits: %d, Bytes per sample: %d\n", this.validBits, this.bytesPerSample);
    }

    public display(out? : any) : any {
        if(((out != null && out instanceof <any>java.io.PrintStream) || out === null)) {
            return <any>this.display$java_io_PrintStream(out);
        } else if(out === undefined) {
            return <any>this.display$();
        } else throw new Error('invalid overload');
    }

    public static main(args : string[]) {
        if(args.length < 1) {
            console.error("Must supply filename");
            java.lang.System.exit(1);
        }
        try {
            for(let index122=0; index122 < args.length; index122++) {
                let filename = args[index122];
                {
                    let readWavFile : WavFile2 = WavFile2.openWavFile(new java.io.File(filename));
                    readWavFile.display();
                    let numFrames : number = readWavFile.getNumFrames();
                    let numChannels : number = readWavFile.getNumChannels();
                    let validBits : number = readWavFile.getValidBits();
                    let sampleRate : number = readWavFile.getSampleRate();
                    let writeWavFile : WavFile2 = WavFile2.newWavFile(new java.io.File("out.wav"), numChannels, numFrames, validBits, sampleRate);
                    let BUF_SIZE : number = 5001;
                    let buffer : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(BUF_SIZE * numChannels);
                    let framesRead : number = 0;
                    let framesWritten : number = 0;
                    do {
                        framesRead = readWavFile.readFrames$double_A$int(buffer, BUF_SIZE);
                        framesWritten = writeWavFile.writeFrames$double_A$int(buffer, BUF_SIZE);
                        java.lang.System.out.printf("%d %d\n", framesRead, framesWritten);
                    } while((framesRead !== 0));
                    readWavFile.close();
                    writeWavFile.close();
                }
            }
            let writeWavFile : WavFile2 = WavFile2.newWavFile(new java.io.File("out2.wav"), 1, 10, 23, 44100);
            let buffer : number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            writeWavFile.writeFrames$double_A$int(buffer, 10);
            writeWavFile.close();
        } catch(e) {
            console.error(e);
            console.error(e.message, e);
        };
    }
}
WavFile2["__class"] = "WavFile2";


namespace WavFile2 {

    export enum IOState {
        READING, WRITING, CLOSED
    }
}




WavFile2.main(null);
