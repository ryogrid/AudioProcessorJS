/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var WavFile = (function () {
    function WavFile() {
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
        this.buffer = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(WavFile.BUFFER_SIZE);
    }
    WavFile.prototype.getNumChannels = function () {
        return this.numChannels;
    };
    WavFile.prototype.getNumFrames = function () {
        return this.numFrames;
    };
    WavFile.prototype.getFramesRemaining = function () {
        return this.numFrames - this.frameCounter;
    };
    WavFile.prototype.getSampleRate = function () {
        return this.sampleRate;
    };
    WavFile.prototype.getValidBits = function () {
        return this.validBits;
    };
    WavFile.newWavFile = function (file, numChannels, numFrames, validBits, sampleRate) {
        var wavFile = new WavFile();
        wavFile.file = file;
        wavFile.numChannels = numChannels;
        wavFile.numFrames = numFrames;
        wavFile.sampleRate = sampleRate;
        wavFile.bytesPerSample = ((validBits + 7) / 8 | 0);
        wavFile.blockAlign = wavFile.bytesPerSample * numChannels;
        wavFile.validBits = validBits;
        if (numChannels < 1 || numChannels > 65535)
            throw new WavFileException("Illegal number of channels, valid range 1 to 65536");
        if (numFrames < 0)
            throw new WavFileException("Number of frames must be positive");
        if (validBits < 2 || validBits > 65535)
            throw new WavFileException("Illegal number of valid bits, valid range 2 to 65536");
        if (sampleRate < 0)
            throw new WavFileException("Sample rate must be positive");
        wavFile.oStream = new java.io.FileOutputStream(file);
        var dataChunkSize = wavFile.blockAlign * numFrames;
        var mainChunkSize = 4 + 8 + 16 + 8 + dataChunkSize;
        if (dataChunkSize % 2 === 1) {
            mainChunkSize += 1;
            wavFile.wordAlignAdjust = true;
        }
        else {
            wavFile.wordAlignAdjust = false;
        }
        WavFile.putLE(WavFile.RIFF_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile.putLE(mainChunkSize, wavFile.buffer, 4, 4);
        WavFile.putLE(WavFile.RIFF_TYPE_ID, wavFile.buffer, 8, 4);
        wavFile.oStream.write(wavFile.buffer, 0, 12);
        var averageBytesPerSecond = sampleRate * wavFile.blockAlign;
        WavFile.putLE(WavFile.FMT_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile.putLE(16, wavFile.buffer, 4, 4);
        WavFile.putLE(1, wavFile.buffer, 8, 2);
        WavFile.putLE(numChannels, wavFile.buffer, 10, 2);
        WavFile.putLE(sampleRate, wavFile.buffer, 12, 4);
        WavFile.putLE(averageBytesPerSecond, wavFile.buffer, 16, 4);
        WavFile.putLE(wavFile.blockAlign, wavFile.buffer, 20, 2);
        WavFile.putLE(validBits, wavFile.buffer, 22, 2);
        wavFile.oStream.write(wavFile.buffer, 0, 24);
        WavFile.putLE(WavFile.DATA_CHUNK_ID, wavFile.buffer, 0, 4);
        WavFile.putLE(dataChunkSize, wavFile.buffer, 4, 4);
        wavFile.oStream.write(wavFile.buffer, 0, 8);
        if (wavFile.validBits > 8) {
            wavFile.floatOffset = 0;
            wavFile.floatScale = Number.MAX_VALUE >> (64 - wavFile.validBits);
        }
        else {
            wavFile.floatOffset = 1;
            wavFile.floatScale = 0.5 * ((1 << wavFile.validBits) - 1);
        }
        wavFile.bufferPointer = 0;
        wavFile.bytesRead = 0;
        wavFile.frameCounter = 0;
        wavFile.ioState = WavFile.IOState.WRITING;
        return wavFile;
    };
    WavFile.openWavFile = function (file) {
        var wavFile = new WavFile();
        wavFile.file = file;
        wavFile.iStream = new java.io.FileInputStream(file);
        var bytesRead = wavFile.iStream.read(wavFile.buffer, 0, 12);
        if (bytesRead !== 12)
            throw new WavFileException("Not enough wav file bytes for header");
        var riffChunkID = WavFile.getLE(wavFile.buffer, 0, 4);
        var chunkSize = WavFile.getLE(wavFile.buffer, 4, 4);
        var riffTypeID = WavFile.getLE(wavFile.buffer, 8, 4);
        if (riffChunkID !== WavFile.RIFF_CHUNK_ID)
            throw new WavFileException("Invalid Wav Header data, incorrect riff chunk ID");
        if (riffTypeID !== WavFile.RIFF_TYPE_ID)
            throw new WavFileException("Invalid Wav Header data, incorrect riff type ID");
        if (file.length() !== chunkSize + 8) {
            throw new WavFileException("Header chunk size (" + chunkSize + ") does not match file size (" + file.length() + ")");
        }
        var foundFormat = false;
        var foundData = false;
        while ((true)) {
            bytesRead = wavFile.iStream.read(wavFile.buffer, 0, 8);
            if (bytesRead === -1)
                throw new WavFileException("Reached end of file without finding format chunk");
            if (bytesRead !== 8)
                throw new WavFileException("Could not read chunk header");
            var chunkID = WavFile.getLE(wavFile.buffer, 0, 4);
            chunkSize = WavFile.getLE(wavFile.buffer, 4, 4);
            var numChunkBytes = (chunkSize % 2 === 1) ? chunkSize + 1 : chunkSize;
            if (chunkID === WavFile.FMT_CHUNK_ID) {
                foundFormat = true;
                bytesRead = wavFile.iStream.read(wavFile.buffer, 0, 16);
                var compressionCode = (WavFile.getLE(wavFile.buffer, 0, 2) | 0);
                if (compressionCode !== 1)
                    throw new WavFileException("Compression Code " + compressionCode + " not supported");
                wavFile.numChannels = (WavFile.getLE(wavFile.buffer, 2, 2) | 0);
                wavFile.sampleRate = WavFile.getLE(wavFile.buffer, 4, 4);
                wavFile.blockAlign = (WavFile.getLE(wavFile.buffer, 12, 2) | 0);
                wavFile.validBits = (WavFile.getLE(wavFile.buffer, 14, 2) | 0);
                if (wavFile.numChannels === 0)
                    throw new WavFileException("Number of channels specified in header is equal to zero");
                if (wavFile.blockAlign === 0)
                    throw new WavFileException("Block Align specified in header is equal to zero");
                if (wavFile.validBits < 2)
                    throw new WavFileException("Valid Bits specified in header is less than 2");
                if (wavFile.validBits > 64)
                    throw new WavFileException("Valid Bits specified in header is greater than 64, this is greater than a long can hold");
                wavFile.bytesPerSample = ((wavFile.validBits + 7) / 8 | 0);
                if (wavFile.bytesPerSample * wavFile.numChannels !== wavFile.blockAlign)
                    throw new WavFileException("Block Align does not agree with bytes required for validBits and number of channels");
                numChunkBytes -= 16;
                if (numChunkBytes > 0)
                    wavFile.iStream.skip(numChunkBytes);
            }
            else if (chunkID === WavFile.DATA_CHUNK_ID) {
                if (foundFormat === false)
                    throw new WavFileException("Data chunk found before Format chunk");
                if (chunkSize % wavFile.blockAlign !== 0)
                    throw new WavFileException("Data Chunk size is not multiple of Block Align");
                wavFile.numFrames = Math.floor(chunkSize / wavFile.blockAlign);
                foundData = true;
                break;
            }
            else {
                wavFile.iStream.skip(numChunkBytes);
            }
        }
        ;
        if (foundData === false)
            throw new WavFileException("Did not find a data chunk");
        if (wavFile.validBits > 8) {
            wavFile.floatOffset = 0;
            wavFile.floatScale = 1 << (wavFile.validBits - 1);
        }
        else {
            wavFile.floatOffset = -1;
            wavFile.floatScale = 0.5 * ((1 << wavFile.validBits) - 1);
        }
        wavFile.bufferPointer = 0;
        wavFile.bytesRead = 0;
        wavFile.frameCounter = 0;
        wavFile.ioState = WavFile.IOState.READING;
        return wavFile;
    };
    WavFile.getLE = function (buffer, pos, numBytes) {
        numBytes--;
        pos += numBytes;
        var val = buffer[pos] & 255;
        for (var b = 0; b < numBytes; b++)
            val = (val << 8) + (buffer[--pos] & 255);
        return val;
    };
    WavFile.putLE = function (val, buffer, pos, numBytes) {
        for (var b = 0; b < numBytes; b++) {
            buffer[pos] = ((val & 255) | 0);
            val >>= 8;
            pos++;
        }
        ;
    };
    WavFile.prototype.writeSample = function (val) {
        for (var b = 0; b < this.bytesPerSample; b++) {
            if (this.bufferPointer === WavFile.BUFFER_SIZE) {
                this.oStream.write(this.buffer, 0, WavFile.BUFFER_SIZE);
                this.bufferPointer = 0;
            }
            this.buffer[this.bufferPointer] = ((val & 255) | 0);
            val >>= 8;
            this.bufferPointer++;
        }
        ;
    };
    WavFile.prototype.readSample = function () {
        var val = 0;
        for (var b = 0; b < this.bytesPerSample; b++) {
            if (this.bufferPointer === this.bytesRead) {
                var read = this.iStream.read(this.buffer, 0, WavFile.BUFFER_SIZE);
                if (read === -1)
                    throw new WavFileException("Not enough data available");
                this.bytesRead = read;
                this.bufferPointer = 0;
            }
            var v = this.buffer[this.bufferPointer];
            if (b < this.bytesPerSample - 1 || this.bytesPerSample === 1)
                v &= 255;
            val += v << (b * 8);
            this.bufferPointer++;
        }
        ;
        return val;
    };
    WavFile.prototype.readFrames$int_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$int_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$int_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = (this.readSample() | 0);
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.readFrames = function (sampleBuffer, offset, numFramesToRead) {
        if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$int_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$int_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$long_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$long_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$double_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToRead === 'number') || numFramesToRead === null)) {
            return this.readFrames$double_A_A$int$int(sampleBuffer, offset, numFramesToRead);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$int_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$int_A_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$long_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$long_A_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$double_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToRead === undefined) {
            return this.readFrames$double_A_A$int(sampleBuffer, offset);
        }
        else
            throw new Error('invalid overload');
    };
    WavFile.prototype.readFrames$int_A_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$int_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$int_A_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                sampleBuffer[c][offset] = (this.readSample() | 0);
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.writeFrames$int_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$int_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$int_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                this.writeSample(sampleBuffer[offset]);
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.writeFrames = function (sampleBuffer, offset, numFramesToWrite) {
        if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$int_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$int_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$long_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$long_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$double_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && ((typeof numFramesToWrite === 'number') || numFramesToWrite === null)) {
            return this.writeFrames$double_A_A$int$int(sampleBuffer, offset, numFramesToWrite);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$int_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$int_A_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$long_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$long_A_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || (typeof sampleBuffer[0] === 'number'))) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$double_A$int(sampleBuffer, offset);
        }
        else if (((sampleBuffer != null && sampleBuffer instanceof Array && (sampleBuffer.length == 0 || sampleBuffer[0] == null || sampleBuffer[0] instanceof Array)) || sampleBuffer === null) && ((typeof offset === 'number') || offset === null) && numFramesToWrite === undefined) {
            return this.writeFrames$double_A_A$int(sampleBuffer, offset);
        }
        else
            throw new Error('invalid overload');
    };
    WavFile.prototype.writeFrames$int_A_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$int_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$int_A_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                this.writeSample(sampleBuffer[c][offset]);
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.readFrames$long_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$long_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$long_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = this.readSample();
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.readFrames$long_A_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$long_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$long_A_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                sampleBuffer[c][offset] = this.readSample();
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.writeFrames$long_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$long_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$long_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                this.writeSample(sampleBuffer[offset]);
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.writeFrames$long_A_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$long_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$long_A_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                this.writeSample(sampleBuffer[c][offset]);
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.readFrames$double_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$double_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$double_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                sampleBuffer[offset] = this.floatOffset + this.readSample() / this.floatScale;
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.readFrames$double_A_A$int = function (sampleBuffer, numFramesToRead) {
        return this.readFrames$double_A_A$int$int(sampleBuffer, 0, numFramesToRead);
    };
    WavFile.prototype.readFrames$double_A_A$int$int = function (sampleBuffer, offset, numFramesToRead) {
        if (this.ioState !== WavFile.IOState.READING)
            throw Object.defineProperty(new Error("Cannot read from WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToRead; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                sampleBuffer[c][offset] = this.floatOffset + this.readSample() / this.floatScale;
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToRead;
    };
    WavFile.prototype.writeFrames$double_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$double_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$double_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++) {
                this.writeSample(Math.floor((this.floatScale * (this.floatOffset + sampleBuffer[offset]))));
                offset++;
            }
            ;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.writeFrames$double_A_A$int = function (sampleBuffer, numFramesToWrite) {
        return this.writeFrames$double_A_A$int$int(sampleBuffer, 0, numFramesToWrite);
    };
    WavFile.prototype.writeFrames$double_A_A$int$int = function (sampleBuffer, offset, numFramesToWrite) {
        if (this.ioState !== WavFile.IOState.WRITING)
            throw Object.defineProperty(new Error("Cannot write to WavFile instance"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.io.IOException', 'java.lang.Object', 'java.lang.Exception'] });
        for (var f = 0; f < numFramesToWrite; f++) {
            if (this.frameCounter === this.numFrames)
                return f;
            for (var c = 0; c < this.numChannels; c++)
                this.writeSample(Math.floor((this.floatScale * (this.floatOffset + sampleBuffer[c][offset]))));
            offset++;
            this.frameCounter++;
        }
        ;
        return numFramesToWrite;
    };
    WavFile.prototype.close = function () {
        if (this.iStream != null) {
            this.iStream.close();
            this.iStream = null;
        }
        if (this.oStream != null) {
            if (this.bufferPointer > 0)
                this.oStream.write(this.buffer, 0, this.bufferPointer);
            if (this.wordAlignAdjust)
                this.oStream.write(0);
            this.oStream.close();
            this.oStream = null;
        }
        this.ioState = WavFile.IOState.CLOSED;
    };
    WavFile.prototype.display$ = function () {
        this.display$java_io_PrintStream(java.lang.System.out);
    };
    WavFile.prototype.display$java_io_PrintStream = function (out) {
        out.printf("File: %s\n", this.file);
        out.printf("Channels: %d, Frames: %d\n", this.numChannels, this.numFrames);
        out.printf("IO State: %s\n", this.ioState);
        out.printf("Sample Rate: %d, Block Align: %d\n", this.sampleRate, this.blockAlign);
        out.printf("Valid Bits: %d, Bytes per sample: %d\n", this.validBits, this.bytesPerSample);
    };
    WavFile.prototype.display = function (out) {
        if (((out != null && out instanceof java.io.PrintStream) || out === null)) {
            return this.display$java_io_PrintStream(out);
        }
        else if (out === undefined) {
            return this.display$();
        }
        else
            throw new Error('invalid overload');
    };
    WavFile.main = function (args) {
        if (args.length < 1) {
            console.error("Must supply filename");
            java.lang.System.exit(1);
        }
        try {
            for (var index121 = 0; index121 < args.length; index121++) {
                var filename = args[index121];
                {
                    var readWavFile = WavFile.openWavFile(new java.io.File(filename));
                    readWavFile.display();
                    var numFrames = readWavFile.getNumFrames();
                    var numChannels = readWavFile.getNumChannels();
                    var validBits = readWavFile.getValidBits();
                    var sampleRate = readWavFile.getSampleRate();
                    var writeWavFile_1 = WavFile.newWavFile(new java.io.File("out.wav"), numChannels, numFrames, validBits, sampleRate);
                    var BUF_SIZE = 5001;
                    var buffer_1 = (function (s) { var a = []; while (s-- > 0)
                        a.push(0); return a; })(BUF_SIZE * numChannels);
                    var framesRead = 0;
                    var framesWritten = 0;
                    do {
                        framesRead = readWavFile.readFrames$double_A$int(buffer_1, BUF_SIZE);
                        framesWritten = writeWavFile_1.writeFrames$double_A$int(buffer_1, BUF_SIZE);
                        java.lang.System.out.printf("%d %d\n", framesRead, framesWritten);
                    } while ((framesRead !== 0));
                    readWavFile.close();
                    writeWavFile_1.close();
                }
            }
            var writeWavFile = WavFile.newWavFile(new java.io.File("out2.wav"), 1, 10, 23, 44100);
            var buffer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            writeWavFile.writeFrames$double_A$int(buffer, 10);
            writeWavFile.close();
        }
        catch (e) {
            console.error(e);
            console.error(e.message, e);
        }
        ;
    };
    return WavFile;
}());
WavFile.BUFFER_SIZE = 4096;
WavFile.FMT_CHUNK_ID = 544501094;
WavFile.DATA_CHUNK_ID = 1635017060;
WavFile.RIFF_CHUNK_ID = 1179011410;
WavFile.RIFF_TYPE_ID = 1163280727;
WavFile["__class"] = "WavFile";
(function (WavFile) {
    var IOState;
    (function (IOState) {
        IOState[IOState["READING"] = 0] = "READING";
        IOState[IOState["WRITING"] = 1] = "WRITING";
        IOState[IOState["CLOSED"] = 2] = "CLOSED";
    })(IOState = WavFile.IOState || (WavFile.IOState = {}));
})(WavFile || (WavFile = {}));
WavFile.main(null);
