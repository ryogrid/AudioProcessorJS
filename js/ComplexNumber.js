/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
/**
 * Constructs a new <code>ComplexNumber</code> object.
 * @param {number} real the real part, Re(z), of the complex number
 * @param {number} imaginary the imaginary part, Im(z), of the complex number
 * @class
 * @author      Abdul Fatir
 */
var ComplexNumber = (function () {
    function ComplexNumber(real, imaginary) {
        var _this = this;
        if (((typeof real === 'number') || real === null) && ((typeof imaginary === 'number') || imaginary === null)) {
            var __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (function () {
                _this.real = real;
                _this.imaginary = imaginary;
            })();
        }
        else if (((typeof real === 'number') || real === null) && imaginary === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (function () {
                _this.real = real;
                _this.imaginary = 0;
            })();
        }
        else if (real === undefined && imaginary === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (function () {
                _this.real = 0.0;
                _this.imaginary = 0.0;
            })();
        }
        else
            throw new Error('invalid overload');
    }
    /**
     * Adds another <code>ComplexNumber</code> to the current complex number.
     * @param {ComplexNumber} z the complex number to be added to the current complex number
     */
    ComplexNumber.prototype.add = function (z) {
        this.set(ComplexNumber.add(this, z));
    };
    /**
     * Subtracts another <code>ComplexNumber</code> from the current complex number.
     * @param {ComplexNumber} z the complex number to be subtracted from the current complex number
     */
    ComplexNumber.prototype.subtract = function (z) {
        this.set(ComplexNumber.subtract(this, z));
    };
    /**
     * Multiplies another <code>ComplexNumber</code> to the current complex number.
     * @param {ComplexNumber} z the complex number to be multiplied to the current complex number
     */
    ComplexNumber.prototype.multiply = function (z) {
        this.set(ComplexNumber.multiply(this, z));
    };
    /**
     * Divides the current <code>ComplexNumber</code> by another <code>ComplexNumber</code>.
     * @param {ComplexNumber} z the divisor
     */
    ComplexNumber.prototype.divide = function (z) {
        this.set(ComplexNumber.divide(this, z));
    };
    /**
     * Sets the value of current complex number to the passed complex number.
     * @param {ComplexNumber} z the complex number
     */
    ComplexNumber.prototype.set = function (z) {
        this.real = z.real;
        this.imaginary = z.imaginary;
    };
    /**
     * Adds two <code>ComplexNumber</code>.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 + z2).
     */
    ComplexNumber.add = function (z1, z2) {
        return new ComplexNumber(z1.real + z2.real, z1.imaginary + z2.imaginary);
    };
    /**
     * Subtracts one <code>ComplexNumber</code> from another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 - z2).
     */
    ComplexNumber.subtract = function (z1, z2) {
        return new ComplexNumber(z1.real - z2.real, z1.imaginary - z2.imaginary);
    };
    /**
     * Multiplies one <code>ComplexNumber</code> to another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 * z2).
     */
    ComplexNumber.multiply = function (z1, z2) {
        var _real = z1.real * z2.real - z1.imaginary * z2.imaginary;
        var _imaginary = z1.real * z2.imaginary + z1.imaginary * z2.real;
        return new ComplexNumber(_real, _imaginary);
    };
    ComplexNumber.prototype.times = function (alpha) {
        return new ComplexNumber(alpha * this.real, alpha * this.imaginary);
    };
    /**
     * Divides one <code>ComplexNumber</code> by another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 / z2).
     */
    ComplexNumber.divide = function (z1, z2) {
        var output = ComplexNumber.multiply(z1, z2.conjugate());
        var div = Math.pow(z2.mod(), 2);
        return new ComplexNumber(output.real / div, output.imaginary / div);
    };
    /**
     * The complex conjugate of the current complex number.
     * @return {ComplexNumber} a <code>ComplexNumber</code> object which is the conjugate of the current complex number
     */
    ComplexNumber.prototype.conjugate = function () {
        return new ComplexNumber(this.real, -this.imaginary);
    };
    /**
     * The modulus, magnitude or the absolute value of current complex number.
     * @return {number} the magnitude or modulus of current complex number
     */
    ComplexNumber.prototype.mod = function () {
        return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2));
    };
    /**
     * The square of the current complex number.
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the square of the current complex number.
     */
    ComplexNumber.prototype.square = function () {
        var _real = this.real * this.real - this.imaginary * this.imaginary;
        var _imaginary = 2 * this.real * this.imaginary;
        return new ComplexNumber(_real, _imaginary);
    };
    /**
     * @return {string} the complex number in x + yi format
     */
    ComplexNumber.prototype.toString = function () {
        var re = this.real + "";
        var im = "";
        if (this.imaginary < 0)
            im = this.imaginary + "i";
        else
            im = "+" + this.imaginary + "i";
        return re + im;
    };
    /**
     * Calculates the exponential of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z The input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is e^(input z)
     */
    ComplexNumber.exp = function (z) {
        var a = z.real;
        var b = z.imaginary;
        var r = Math.exp(a);
        a = r * Math.cos(b);
        b = r * Math.sin(b);
        return new ComplexNumber(a, b);
    };
    /**
     * Calculates the <code>ComplexNumber</code> to the passed integer power.
     * @param {ComplexNumber} z The input complex number
     * @param {number} power The power.
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is (z)^power
     */
    ComplexNumber.pow = function (z, power) {
        var output = new ComplexNumber(z.getRe(), z.getIm());
        for (var i = 1; i < power; i++) {
            var _real = output.real * z.real - output.imaginary * z.imaginary;
            var _imaginary = output.real * z.imaginary + output.imaginary * z.real;
            output = new ComplexNumber(_real, _imaginary);
        }
        ;
        return output;
    };
    /**
     * Calculates the sine of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the sine of z.
     */
    ComplexNumber.sin = function (z) {
        var x = Math.exp(z.imaginary);
        var x_inv = 1 / x;
        var r = Math.sin(z.real) * (x + x_inv) / 2;
        var i = Math.cos(z.real) * (x - x_inv) / 2;
        return new ComplexNumber(r, i);
    };
    /**
     * Calculates the cosine of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the cosine of z.
     */
    ComplexNumber.cos = function (z) {
        var x = Math.exp(z.imaginary);
        var x_inv = 1 / x;
        var r = Math.cos(z.real) * (x + x_inv) / 2;
        var i = -Math.sin(z.real) * (x - x_inv) / 2;
        return new ComplexNumber(r, i);
    };
    /**
     * Calculates the tangent of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the tangent of z.
     */
    ComplexNumber.tan = function (z) {
        return ComplexNumber.divide(ComplexNumber.sin(z), ComplexNumber.cos(z));
    };
    /**
     * Calculates the co-tangent of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the co-tangent of z.
     */
    ComplexNumber.cot = function (z) {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.tan(z));
    };
    /**
     * Calculates the secant of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the secant of z.
     */
    ComplexNumber.sec = function (z) {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.cos(z));
    };
    /**
     * Calculates the co-secant of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the co-secant of z.
     */
    ComplexNumber.cosec = function (z) {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.sin(z));
    };
    /**
     * The real part of <code>ComplexNumber</code>
     * @return {number} the real part of the complex number
     */
    ComplexNumber.prototype.getRe = function () {
        return this.real;
    };
    /**
     * The imaginary part of <code>ComplexNumber</code>
     * @return {number} the imaginary part of the complex number
     */
    ComplexNumber.prototype.getIm = function () {
        return this.imaginary;
    };
    /**
     * The argument/phase of the current complex number.
     * @return {number} arg(z) - the argument of current complex number
     */
    ComplexNumber.prototype.getArg = function () {
        return Math.atan2(this.imaginary, this.real);
    };
    /**
     * Parses the <code>String</code> as a <code>ComplexNumber</code> of type x+yi.
     * @param {string} s the input complex number as string
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is represented by the string.
     */
    ComplexNumber.parseComplex = function (s) {
        s = s.replace(new RegExp(" ", 'g'), "");
        var parsed = null;
        if (s.indexOf(/* valueOf */ new String("+").toString()) != -1 || (s.indexOf(/* valueOf */ new String("-").toString()) != -1 && s.lastIndexOf('-') > 0)) {
            var re = "";
            var im = "";
            s = s.replace(new RegExp("i", 'g'), "");
            s = s.replace(new RegExp("I", 'g'), "");
            if (s.indexOf('+') > 0) {
                re = s.substring(0, s.indexOf('+'));
                im = s.substring(s.indexOf('+') + 1, s.length);
                parsed = new ComplexNumber(/* parseDouble */ parseFloat(re), /* parseDouble */ parseFloat(im));
            }
            else if (s.lastIndexOf('-') > 0) {
                re = s.substring(0, s.lastIndexOf('-'));
                im = s.substring(s.lastIndexOf('-') + 1, s.length);
                parsed = new ComplexNumber(/* parseDouble */ parseFloat(re), -parseFloat(im));
            }
        }
        else {
            if ((function (str, searchString) { var pos = str.length - searchString.length; var lastIndex = str.indexOf(searchString, pos); return lastIndex !== -1 && lastIndex === pos; })(s, "i") || (function (str, searchString) { var pos = str.length - searchString.length; var lastIndex = str.indexOf(searchString, pos); return lastIndex !== -1 && lastIndex === pos; })(s, "I")) {
                s = s.replace(new RegExp("i", 'g'), "");
                s = s.replace(new RegExp("I", 'g'), "");
                parsed = new ComplexNumber(0, /* parseDouble */ parseFloat(s));
            }
            else {
                parsed = new ComplexNumber(/* parseDouble */ parseFloat(s), 0);
            }
        }
        return parsed;
    };
    /**
     * Checks if the passed <code>ComplexNumber</code> is equal to the current.
     * @param {*} z the complex number to be checked
     * @return {boolean} true if they are equal, false otherwise
     */
    ComplexNumber.prototype.equals = function (z) {
        if (!(z != null && z instanceof ComplexNumber))
            return false;
        var a = z;
        return (this.real === a.real) && (this.imaginary === a.imaginary);
    };
    /**
     * The inverse/reciprocal of the complex number.
     * @return {ComplexNumber} the reciprocal of current complex number.
     */
    ComplexNumber.prototype.inverse = function () {
        return ComplexNumber.divide(new ComplexNumber(1, 0), this);
    };
    /**
     * Formats the Complex number as x+yi or r.cis(theta)
     * @param {number} format_id the format ID <code>ComplexNumber.XY</code> or <code>ComplexNumber.RCIS</code>.
     * @return {string} a string representation of the complex number
     * @throws IllegalArgumentException if the format_id does not match.
     */
    ComplexNumber.prototype.format = function (format_id) {
        var out = "";
        if (format_id === ComplexNumber.XY)
            out = this.toString();
        else if (format_id === ComplexNumber.RCIS) {
            out = this.mod() + " cis(" + this.getArg() + ")";
        }
        else {
            throw Object.defineProperty(new Error("Unknown Complex Number format."), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.IllegalArgumentException', 'java.lang.Exception'] });
        }
        return out;
    };
    ComplexNumber.main = function (args) {
    };
    return ComplexNumber;
}());
/**
 * Used in <code>format(int)</code> to format the complex number as x+yi
 */
ComplexNumber.XY = 0;
/**
 * Used in <code>format(int)</code> to format the complex number as R.cis(theta), where theta is arg(z)
 */
ComplexNumber.RCIS = 1;
ComplexNumber["__class"] = "ComplexNumber";
ComplexNumber.main(null);
