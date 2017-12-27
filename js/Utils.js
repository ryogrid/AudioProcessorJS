/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var Utils = (function () {
    function Utils() {
    }
    /**
     * Calculates N samples of Hamming window
     * @param {number} N Number of samples
     * @return {Array} samples Array of samples
     */
    Utils.hamming = function (N) {
        var samples = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(N);
        for (var k = 0; k < N; k++) {
            samples[k] = 0.54 - 0.46 * Math.cos(2 * Math.PI * k / (N - 1));
        }
        ;
        return samples;
    };
    /**
     * Performs Cooley–Tukey FFT algorithm and returns array of complex numbers
     * @param  {Array} x Radix-2 length N signal array
     * @return   {Array} X Radix-2 length N signal spectrum
     */
    Utils.fft = function (x) {
        var N = x.length;
        if (N === 1) {
            return [x[0]];
        }
        if (N % 2 !== 0) {
            throw Object.defineProperty(new Error("Sample points N not radix-2"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
        var xEven = new Array((N / 2 | 0));
        var xOdd = new Array((N / 2 | 0));
        for (var k = 0; k < (N / 2 | 0); k++) {
            xEven[k] = x[2 * k];
            xOdd[k] = x[2 * k + 1];
        }
        ;
        var Ek = Utils.fft(xEven);
        var Ok = Utils.fft(xOdd);
        var X = new Array(N);
        for (var k = 0; k < (N / 2 | 0); k++) {
            var tf = ComplexNumber.exp(new ComplexNumber(0, -2 * Math.PI * k / N));
            X[k] = ComplexNumber.add(Ek[k], ComplexNumber.multiply(tf, Ok[k]));
            X[k + (N / 2 | 0)] = ComplexNumber.subtract(Ek[k], ComplexNumber.multiply(tf, Ok[k]));
        }
        ;
        return X;
    };
    /**
     * Perfoms ifft using fft function
     * @param  {Array} X Radix-2 length N signal spectrum
     * @return   {Array} x Radix-2 length N signal array
     */
    Utils.ifft = function (X) {
        var N = X.length;
        var x = new Array(N);
        for (var k = 0; k < N; k++) {
            x[k] = X[k].conjugate();
        }
        ;
        x = Utils.fft(x);
        for (var k = 0; k < N; k++) {
            x[k] = x[k].conjugate();
            x[k] = x[k].times(1.0 / N);
        }
        ;
        return x;
    };
    /**
     * [Lanczos approximation of gamma function
     * @param  {number} x Input value
     * @return  {number} a Value of gamma function at x
     */
    Utils.gamma = function (x) {
        var g = 7;
        var p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572E-6, 1.5056327351493116E-7];
        if (x < 0.5) {
            return Math.PI / (Math.sin(Math.PI * x) * Utils.gamma(1 - x));
        }
        x -= 1;
        var a = p[0];
        var t = x + g + 0.5;
        for (var i = 1; i < p.length; i++) {
            a += p[i] / (x + i);
        }
        ;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
    };
    Utils.mean$double_A_A$int = function (data, axis) {
        var mean;
        var rows = data.length;
        var cols = data[0].length;
        if (axis !== 1 && axis !== 0) {
            throw Object.defineProperty(new Error("Unknown axis. Choose 0 for columns or 1 for rows"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.RuntimeException', 'java.lang.Exception'] });
        }
        if (axis === 0) {
            mean = (function (s) { var a = []; while (s-- > 0)
                a.push(0); return a; })(cols);
            for (var c = 0; c < cols; c++) {
                var sum = 0.0;
                for (var r = 0; r < rows; r++) {
                    sum += data[r][c];
                }
                ;
                mean[c] = sum / rows;
            }
            ;
        }
        else {
            mean = (function (s) { var a = []; while (s-- > 0)
                a.push(0); return a; })(rows);
            for (var r = 0; r < rows; r++) {
                var sum = 0.0;
                for (var c = 0; c < cols; c++) {
                    sum += data[r][c];
                }
                ;
                mean[r] = sum / cols;
            }
            ;
        }
        return mean;
    };
    /**
     * Calculates mean of multidimensional array across axis of choice
     * @param  {Array} data Multidimensional data array
     * @param  {number} axis Axis to calculate mean across
     * @return   {Array} mean Array of mean values
     */
    Utils.mean = function (data, axis) {
        if (((data != null && data instanceof Array && (data.length == 0 || data[0] == null || data[0] instanceof Array)) || data === null) && ((typeof axis === 'number') || axis === null)) {
            return Utils.mean$double_A_A$int(data, axis);
        }
        else if (((data != null && data instanceof Array && (data.length == 0 || data[0] == null || (typeof data[0] === 'number'))) || data === null) && axis === undefined) {
            return Utils.mean$double_A(data);
        }
        else
            throw new Error('invalid overload');
    };
    Utils.mean$double_A = function (data) {
        var sum = 0.0;
        for (var i = 0; i < data.length; i++) {
            sum += data[i];
        }
        ;
        return sum / data.length;
    };
    Utils.main = function (args) {
        var marks = [[5, 6, 7, 8, 9], [1, 2, 3, 4, 5], [2, 2, 2, 2, 2]];
        var mean = Utils.mean$double_A_A$int(marks, 1);
        console.info(java.util.Arrays.deepToString(marks));
        console.info(java.util.Arrays.toString(mean));
    };
    return Utils;
}());
Utils["__class"] = "Utils";
Utils.main(null);
