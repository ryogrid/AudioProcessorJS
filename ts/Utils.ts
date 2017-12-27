/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
class Utils {
    public constructor() {
    }

    /**
     * Calculates N samples of Hamming window
     * @param {number} N Number of samples
     * @return {Array} samples Array of samples
     */
    public static hamming(N : number) : number[] {
        let samples : number[] = (s => { let a=[]; while(s-->0) a.push(0); return a; })(N);
        for(let k : number = 0; k < N; k++) {
            samples[k] = 0.54 - 0.46 * Math.cos(2 * Math.PI * k / (N - 1));
        };
        return samples;
    }

    /**
     * Performs Cooley–Tukey FFT algorithm and returns array of complex numbers
     * @param  {Array} x Radix-2 length N signal array
     * @return   {Array} X Radix-2 length N signal spectrum
     */
    public static fft(x : ComplexNumber[]) : ComplexNumber[] {
        let N : number = x.length;
        if(N === 1) {
            return [x[0]];
        }
        if(N % 2 !== 0) {
            throw Object.defineProperty(new Error("Sample points N not radix-2"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.Exception'] });
        }
        let xEven : ComplexNumber[] = new Array((N / 2|0));
        let xOdd : ComplexNumber[] = new Array((N / 2|0));
        for(let k : number = 0; k < (N / 2|0); k++) {
            xEven[k] = x[2 * k];
            xOdd[k] = x[2 * k + 1];
        };
        let Ek : ComplexNumber[] = Utils.fft(xEven);
        let Ok : ComplexNumber[] = Utils.fft(xOdd);
        let X : ComplexNumber[] = new Array(N);
        for(let k : number = 0; k < (N / 2|0); k++) {
            let tf : ComplexNumber = ComplexNumber.exp(new ComplexNumber(0, -2 * Math.PI * k / N));
            X[k] = ComplexNumber.add(Ek[k], ComplexNumber.multiply(tf, Ok[k]));
            X[k + (N / 2|0)] = ComplexNumber.subtract(Ek[k], ComplexNumber.multiply(tf, Ok[k]));
        };
        return X;
    }

    /**
     * Perfoms ifft using fft function
     * @param  {Array} X Radix-2 length N signal spectrum
     * @return   {Array} x Radix-2 length N signal array
     */
    public static ifft(X : ComplexNumber[]) : ComplexNumber[] {
        let N : number = X.length;
        let x : ComplexNumber[] = new Array(N);
        for(let k : number = 0; k < N; k++) {
            x[k] = X[k].conjugate();
        };
        x = Utils.fft(x);
        for(let k : number = 0; k < N; k++) {
            x[k] = x[k].conjugate();
            x[k] = x[k].times(1.0 / N);
        };
        return x;
    }

    /**
     * [Lanczos approximation of gamma function
     * @param  {number} x Input value
     * @return  {number} a Value of gamma function at x
     */
    public static gamma(x : number) : number {
        let g : number = 7;
        let p : number[] = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572E-6, 1.5056327351493116E-7];
        if(x < 0.5) {
            return Math.PI / (Math.sin(Math.PI * x) * Utils.gamma(1 - x));
        }
        x -= 1;
        let a : number = p[0];
        let t : number = x + g + 0.5;
        for(let i : number = 1; i < p.length; i++) {
            a += p[i] / (x + i);
        };
        return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
    }

    public static mean$double_A_A$int(data : number[][], axis : number) : number[] {
        let mean : number[];
        let rows : number = data.length;
        let cols : number = data[0].length;
        if(axis !== 1 && axis !== 0) {
            throw Object.defineProperty(new Error("Unknown axis. Choose 0 for columns or 1 for rows"), '__classes', { configurable: true, value: ['java.lang.Throwable','java.lang.Object','java.lang.RuntimeException','java.lang.Exception'] });
        }
        if(axis === 0) {
            mean = (s => { let a=[]; while(s-->0) a.push(0); return a; })(cols);
            for(let c : number = 0; c < cols; c++) {
                let sum : number = 0.0;
                for(let r : number = 0; r < rows; r++) {
                    sum += data[r][c];
                };
                mean[c] = sum / rows;
            };
        } else {
            mean = (s => { let a=[]; while(s-->0) a.push(0); return a; })(rows);
            for(let r : number = 0; r < rows; r++) {
                let sum : number = 0.0;
                for(let c : number = 0; c < cols; c++) {
                    sum += data[r][c];
                };
                mean[r] = sum / cols;
            };
        }
        return mean;
    }

    /**
     * Calculates mean of multidimensional array across axis of choice
     * @param  {Array} data Multidimensional data array
     * @param  {number} axis Axis to calculate mean across
     * @return   {Array} mean Array of mean values
     */
    public static mean(data? : any, axis? : any) : any {
        if(((data != null && data instanceof <any>Array && (data.length==0 || data[0] == null ||data[0] instanceof Array)) || data === null) && ((typeof axis === 'number') || axis === null)) {
            return <any>Utils.mean$double_A_A$int(data, axis);
        } else if(((data != null && data instanceof <any>Array && (data.length==0 || data[0] == null ||(typeof data[0] === 'number'))) || data === null) && axis === undefined) {
            return <any>Utils.mean$double_A(data);
        } else throw new Error('invalid overload');
    }

    public static mean$double_A(data : number[]) : number {
        let sum : number = 0.0;
        for(let i : number = 0; i < data.length; i++) {
            sum += data[i];
        };
        return sum / data.length;
    }

    public static main(args : string[]) {
        let marks : number[][] = [[5, 6, 7, 8, 9], [1, 2, 3, 4, 5], [2, 2, 2, 2, 2]];
        let mean : number[] = Utils.mean$double_A_A$int(marks, 1);
        console.info(java.util.Arrays.deepToString(marks));
        console.info(java.util.Arrays.toString(mean));
    }
}
Utils["__class"] = "Utils";




Utils.main(null);
