/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class WavFileException extends Error {
    public constructor(message? : any, cause? : any) {
        if(((typeof message === 'string') || message === null) && ((cause != null && (cause["__classes"] && cause["__classes"].indexOf("java.lang.Throwable") >= 0) || cause != null && cause instanceof <any>Error) || cause === null)) {
            let __args = Array.prototype.slice.call(arguments);
            super(message); this.message=message;
            (<any>Object).setPrototypeOf(this, WavFileException.prototype);
        } else if(((typeof message === 'string') || message === null) && cause === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            super(message); this.message=message;
            (<any>Object).setPrototypeOf(this, WavFileException.prototype);
        } else if(((message != null && (message["__classes"] && message["__classes"].indexOf("java.lang.Throwable") >= 0) || message != null && message instanceof <any>Error) || message === null) && cause === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            let cause : any = __args[0];
            super(cause); this.message=cause;
            (<any>Object).setPrototypeOf(this, WavFileException.prototype);
        } else if(message === undefined && cause === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            super();
            (<any>Object).setPrototypeOf(this, WavFileException.prototype);
        } else throw new Error('invalid overload');
    }
}
WavFileException["__class"] = "WavFileException";
WavFileException["__interfaces"] = ["java.io.Serializable"];




