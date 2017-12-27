var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var WavFileException = (function (_super) {
    __extends(WavFileException, _super);
    function WavFileException(message, cause) {
        var _this = this;
        if (((typeof message === 'string') || message === null) && ((cause != null && (cause["__classes"] && cause["__classes"].indexOf("java.lang.Throwable") >= 0) || cause != null && cause instanceof Error) || cause === null)) {
            var __args = Array.prototype.slice.call(arguments);
            _this = _super.call(this, message) || this;
            _this.message = message;
            Object.setPrototypeOf(_this, WavFileException.prototype);
        }
        else if (((typeof message === 'string') || message === null) && cause === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            _this = _super.call(this, message) || this;
            _this.message = message;
            Object.setPrototypeOf(_this, WavFileException.prototype);
        }
        else if (((message != null && (message["__classes"] && message["__classes"].indexOf("java.lang.Throwable") >= 0) || message != null && message instanceof Error) || message === null) && cause === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            var cause_1 = __args[0];
            _this = _super.call(this, cause_1) || this;
            _this.message = cause_1;
            Object.setPrototypeOf(_this, WavFileException.prototype);
        }
        else if (message === undefined && cause === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            _this = _super.call(this) || this;
            Object.setPrototypeOf(_this, WavFileException.prototype);
        }
        else
            throw new Error('invalid overload');
        return _this;
    }
    return WavFileException;
}(Error));
WavFileException["__class"] = "WavFileException";
WavFileException["__interfaces"] = ["java.io.Serializable"];
