/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
/**
 * Constructs a new <code>ComplexNumber</code> object.
 * @param {number} real the real part, Re(z), of the complex number
 * @param {number} imaginary the imaginary part, Im(z), of the complex number
 * @class
 * @author      Abdul Fatir
 */
class ComplexNumber {
    /**
     * Used in <code>format(int)</code> to format the complex number as x+yi
     */
    public static XY : number = 0;

    /**
     * Used in <code>format(int)</code> to format the complex number as R.cis(theta), where theta is arg(z)
     */
    public static RCIS : number = 1;

    /**
     * The real, Re(z), part of the <code>ComplexNumber</code>.
     */
    /*private*/ real : number;

    /**
     * The imaginary, Im(z), part of the <code>ComplexNumber</code>.
     */
    /*private*/ imaginary : number;

    public constructor(real? : any, imaginary? : any) {
        if(((typeof real === 'number') || real === null) && ((typeof imaginary === 'number') || imaginary === null)) {
            let __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (() => {
                this.real = real;
                this.imaginary = imaginary;
            })();
        } else if(((typeof real === 'number') || real === null) && imaginary === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (() => {
                this.real = real;
                this.imaginary = 0;
            })();
        } else if(real === undefined && imaginary === undefined) {
            let __args = Array.prototype.slice.call(arguments);
            this.real = 0;
            this.imaginary = 0;
            this.real = 0;
            this.imaginary = 0;
            (() => {
                this.real = 0.0;
                this.imaginary = 0.0;
            })();
        } else throw new Error('invalid overload');
    }

    /**
     * Adds another <code>ComplexNumber</code> to the current complex number.
     * @param {ComplexNumber} z the complex number to be added to the current complex number
     */
    public add(z : ComplexNumber) {
        this.set(ComplexNumber.add(this, z));
    }

    /**
     * Subtracts another <code>ComplexNumber</code> from the current complex number.
     * @param {ComplexNumber} z the complex number to be subtracted from the current complex number
     */
    public subtract(z : ComplexNumber) {
        this.set(ComplexNumber.subtract(this, z));
    }

    /**
     * Multiplies another <code>ComplexNumber</code> to the current complex number.
     * @param {ComplexNumber} z the complex number to be multiplied to the current complex number
     */
    public multiply(z : ComplexNumber) {
        this.set(ComplexNumber.multiply(this, z));
    }

    /**
     * Divides the current <code>ComplexNumber</code> by another <code>ComplexNumber</code>.
     * @param {ComplexNumber} z the divisor
     */
    public divide(z : ComplexNumber) {
        this.set(ComplexNumber.divide(this, z));
    }

    /**
     * Sets the value of current complex number to the passed complex number.
     * @param {ComplexNumber} z the complex number
     */
    public set(z : ComplexNumber) {
        this.real = z.real;
        this.imaginary = z.imaginary;
    }

    /**
     * Adds two <code>ComplexNumber</code>.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 + z2).
     */
    public static add(z1 : ComplexNumber, z2 : ComplexNumber) : ComplexNumber {
        return new ComplexNumber(z1.real + z2.real, z1.imaginary + z2.imaginary);
    }

    /**
     * Subtracts one <code>ComplexNumber</code> from another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 - z2).
     */
    public static subtract(z1 : ComplexNumber, z2 : ComplexNumber) : ComplexNumber {
        return new ComplexNumber(z1.real - z2.real, z1.imaginary - z2.imaginary);
    }

    /**
     * Multiplies one <code>ComplexNumber</code> to another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 * z2).
     */
    public static multiply(z1 : ComplexNumber, z2 : ComplexNumber) : ComplexNumber {
        let _real : number = z1.real * z2.real - z1.imaginary * z2.imaginary;
        let _imaginary : number = z1.real * z2.imaginary + z1.imaginary * z2.real;
        return new ComplexNumber(_real, _imaginary);
    }

    public times(alpha : number) : ComplexNumber {
        return new ComplexNumber(alpha * this.real, alpha * this.imaginary);
    }

    /**
     * Divides one <code>ComplexNumber</code> by another.
     * @param {ComplexNumber} z1 the first <code>ComplexNumber</code>.
     * @param {ComplexNumber} z2 the second <code>ComplexNumber</code>.
     * @return {ComplexNumber} the resultant <code>ComplexNumber</code> (z1 / z2).
     */
    public static divide(z1 : ComplexNumber, z2 : ComplexNumber) : ComplexNumber {
        let output : ComplexNumber = ComplexNumber.multiply(z1, z2.conjugate());
        let div : number = Math.pow(z2.mod(), 2);
        return new ComplexNumber(output.real / div, output.imaginary / div);
    }

    /**
     * The complex conjugate of the current complex number.
     * @return {ComplexNumber} a <code>ComplexNumber</code> object which is the conjugate of the current complex number
     */
    public conjugate() : ComplexNumber {
        return new ComplexNumber(this.real, -this.imaginary);
    }

    /**
     * The modulus, magnitude or the absolute value of current complex number.
     * @return {number} the magnitude or modulus of current complex number
     */
    public mod() : number {
        return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2));
    }

    /**
     * The square of the current complex number.
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the square of the current complex number.
     */
    public square() : ComplexNumber {
        let _real : number = this.real * this.real - this.imaginary * this.imaginary;
        let _imaginary : number = 2 * this.real * this.imaginary;
        return new ComplexNumber(_real, _imaginary);
    }

    /**
     * @return {string} the complex number in x + yi format
     */
    public toString() : string {
        let re : string = this.real + "";
        let im : string = "";
        if(this.imaginary < 0) im = this.imaginary + "i"; else im = "+" + this.imaginary + "i";
        return re + im;
    }

    /**
     * Calculates the exponential of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z The input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is e^(input z)
     */
    public static exp(z : ComplexNumber) : ComplexNumber {
        let a : number = z.real;
        let b : number = z.imaginary;
        let r : number = Math.exp(a);
        a = r * Math.cos(b);
        b = r * Math.sin(b);
        return new ComplexNumber(a, b);
    }

    /**
     * Calculates the <code>ComplexNumber</code> to the passed integer power.
     * @param {ComplexNumber} z The input complex number
     * @param {number} power The power.
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is (z)^power
     */
    public static pow(z : ComplexNumber, power : number) : ComplexNumber {
        let output : ComplexNumber = new ComplexNumber(z.getRe(), z.getIm());
        for(let i : number = 1; i < power; i++) {
            let _real : number = output.real * z.real - output.imaginary * z.imaginary;
            let _imaginary : number = output.real * z.imaginary + output.imaginary * z.real;
            output = new ComplexNumber(_real, _imaginary);
        };
        return output;
    }

    /**
     * Calculates the sine of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the sine of z.
     */
    public static sin(z : ComplexNumber) : ComplexNumber {
        let x : number = Math.exp(z.imaginary);
        let x_inv : number = 1 / x;
        let r : number = Math.sin(z.real) * (x + x_inv) / 2;
        let i : number = Math.cos(z.real) * (x - x_inv) / 2;
        return new ComplexNumber(r, i);
    }

    /**
     * Calculates the cosine of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the cosine of z.
     */
    public static cos(z : ComplexNumber) : ComplexNumber {
        let x : number = Math.exp(z.imaginary);
        let x_inv : number = 1 / x;
        let r : number = Math.cos(z.real) * (x + x_inv) / 2;
        let i : number = -Math.sin(z.real) * (x - x_inv) / 2;
        return new ComplexNumber(r, i);
    }

    /**
     * Calculates the tangent of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the tangent of z.
     */
    public static tan(z : ComplexNumber) : ComplexNumber {
        return ComplexNumber.divide(ComplexNumber.sin(z), ComplexNumber.cos(z));
    }

    /**
     * Calculates the co-tangent of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the co-tangent of z.
     */
    public static cot(z : ComplexNumber) : ComplexNumber {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.tan(z));
    }

    /**
     * Calculates the secant of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the secant of z.
     */
    public static sec(z : ComplexNumber) : ComplexNumber {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.cos(z));
    }

    /**
     * Calculates the co-secant of the <code>ComplexNumber</code>
     * @param {ComplexNumber} z the input complex number
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is the co-secant of z.
     */
    public static cosec(z : ComplexNumber) : ComplexNumber {
        return ComplexNumber.divide(new ComplexNumber(1, 0), ComplexNumber.sin(z));
    }

    /**
     * The real part of <code>ComplexNumber</code>
     * @return {number} the real part of the complex number
     */
    public getRe() : number {
        return this.real;
    }

    /**
     * The imaginary part of <code>ComplexNumber</code>
     * @return {number} the imaginary part of the complex number
     */
    public getIm() : number {
        return this.imaginary;
    }

    /**
     * The argument/phase of the current complex number.
     * @return {number} arg(z) - the argument of current complex number
     */
    public getArg() : number {
        return Math.atan2(this.imaginary, this.real);
    }

    /**
     * Parses the <code>String</code> as a <code>ComplexNumber</code> of type x+yi.
     * @param {string} s the input complex number as string
     * @return {ComplexNumber} a <code>ComplexNumber</code> which is represented by the string.
     */
    public static parseComplex(s : string) : ComplexNumber {
        s = /* replaceAll */s.replace(new RegExp(" ", 'g'),"");
        let parsed : ComplexNumber = null;
        if(/* contains */s.indexOf(/* valueOf */new String("+").toString()) != -1 || (/* contains */s.indexOf(/* valueOf */new String("-").toString()) != -1 && s.lastIndexOf('-') > 0)) {
            let re : string = "";
            let im : string = "";
            s = /* replaceAll */s.replace(new RegExp("i", 'g'),"");
            s = /* replaceAll */s.replace(new RegExp("I", 'g'),"");
            if(s.indexOf('+') > 0) {
                re = s.substring(0, s.indexOf('+'));
                im = s.substring(s.indexOf('+') + 1, s.length);
                parsed = new ComplexNumber(/* parseDouble */parseFloat(re), /* parseDouble */parseFloat(im));
            } else if(s.lastIndexOf('-') > 0) {
                re = s.substring(0, s.lastIndexOf('-'));
                im = s.substring(s.lastIndexOf('-') + 1, s.length);
                parsed = new ComplexNumber(/* parseDouble */parseFloat(re), -/* parseDouble */parseFloat(im));
            }
        } else {
            if(/* endsWith */((str, searchString) => { let pos = str.length - searchString.length; let lastIndex = str.indexOf(searchString, pos); return lastIndex !== -1 && lastIndex === pos; })(s, "i") || /* endsWith */((str, searchString) => { let pos = str.length - searchString.length; let lastIndex = str.indexOf(searchString, pos); return lastIndex !== -1 && lastIndex === pos; })(s, "I")) {
                s = /* replaceAll */s.replace(new RegExp("i", 'g'),"");
                s = /* replaceAll */s.replace(new RegExp("I", 'g'),"");
                parsed = new ComplexNumber(0, /* parseDouble */parseFloat(s));
            } else {
                parsed = new ComplexNumber(/* parseDouble */parseFloat(s), 0);
            }
        }
        return parsed;
    }

    /**
     * Checks if the passed <code>ComplexNumber</code> is equal to the current.
     * @param {*} z the complex number to be checked
     * @return {boolean} true if they are equal, false otherwise
     */
    public equals(z : any) : boolean {
        if(!(z != null && z instanceof <any>ComplexNumber)) return false;
        let a : ComplexNumber = <ComplexNumber>z;
        return (this.real === a.real) && (this.imaginary === a.imaginary);
    }

    /**
     * The inverse/reciprocal of the complex number.
     * @return {ComplexNumber} the reciprocal of current complex number.
     */
    public inverse() : ComplexNumber {
        return ComplexNumber.divide(new ComplexNumber(1, 0), this);
    }

    /**
     * Formats the Complex number as x+yi or r.cis(theta)
     * @param {number} format_id the format ID <code>ComplexNumber.XY</code> or <code>ComplexNumber.RCIS</code>.
     * @return {string} a string representation of the complex number
     * @throws IllegalArgumentException if the format_id does not match.
     */
    public format(format_id : number) : string {
        let out : string = "";
        if(format_id === ComplexNumber.XY) out = this.toString(); else if(format_id === ComplexNumber.RCIS) {
            out = this.mod() + " cis(" + this.getArg() + ")";
        } else {
            throw Object.defineProperty(new Error("Unknown Complex Number format."), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.IllegalArgumentException','java.lang.Exception'] });
        }
        return out;
    }

    public static main(args : string[]) {
    }
}
ComplexNumber["__class"] = "ComplexNumber";




ComplexNumber.main(null);
