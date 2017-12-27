/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var Bessel = (function () {
    function Bessel() {
    }
    /**
     * Evaluates a Chebyshev series.
     * @param {number} x value at which to evaluate series
     * @param {Array} series the coefficients of the series
     * @return {number}
     */
    Bessel.chebyshev = function (x, series) {
        var twox;
        var b0 = 0.0;
        var b1 = 0.0;
        var b2 = 0.0;
        twox = 2 * x;
        for (var i = series.length - 1; i > -1; i--) {
            b2 = b1;
            b1 = b0;
            b0 = twox * b1 - b2 + series[i];
        }
        ;
        return 0.5 * (b0 - b2);
    };
    /**
     * Modified Bessel function of first kind, order zero.
     * Based on the NETLIB Fortran function besi0 written by W. Fullerton.
     * @param {number} x
     * @return {number}
     */
    Bessel.modBesselFirstZero = function (x) {
        var y = Math.abs(x);
        if (y > 3.0)
            return Math.exp(y) * Bessel.expModBesselFirstZero(x);
        else
            return 2.75 + Bessel.chebyshev(y * y / 4.5 - 1.0, Bessel.bi0cs_$LI$());
    };
    /**
     * Exponential scaled modified Bessel function of first kind, order zero.
     * Based on the NETLIB Fortran function besi0e written by W. Fullerton.
     * @param {number} x
     * @return {number}
     * @private
     */
    /*private*/ Bessel.expModBesselFirstZero = function (x) {
        var y = Math.abs(x);
        if (y > 3.0) {
            if (y > 8.0)
                return (0.375 + Bessel.chebyshev(16.0 / y - 1.0, Bessel.ai02cs_$LI$())) / Math.sqrt(y);
            else
                return (0.375 + Bessel.chebyshev((48.0 / y - 11.0) / 5.0, Bessel.ai0cs_$LI$())) / Math.sqrt(y);
        }
        else
            return Math.exp(-y) * (2.75 + Bessel.chebyshev(y * y / 4.5 - 1.0, Bessel.bi0cs_$LI$()));
    };
    /**
     * Modified Bessel function of first kind, order one.
     * Based on the NETLIB Fortran function besi0 written by W. Fullerton.
     * @param {number} x
     * @return {number}
     */
    Bessel.modBesselFirstOne = function (x) {
        var y = Math.abs(x);
        if (y > 3.0)
            return Math.exp(y) * Bessel.expModBesselFirstOne(x);
        else if (y === 0.0)
            return 0.0;
        else
            return x * (0.875 + Bessel.chebyshev(y * y / 4.5 - 1.0, Bessel.bi1cs_$LI$()));
    };
    /**
     * Exponential scaled modified Bessel function of first kind, order one.
     * Based on the NETLIB Fortran function besi1e written by W. Fullerton.
     * @param {number} x
     * @return {number}
     * @private
     */
    /*private*/ Bessel.expModBesselFirstOne = function (x) {
        var y = Math.abs(x);
        if (y > 3.0) {
            if (y > 8.0)
                return x / y * (0.375 + Bessel.chebyshev(16.0 / y - 1.0, Bessel.ai12cs_$LI$())) / Math.sqrt(y);
            else
                return x / y * (0.375 + Bessel.chebyshev((48.0 / y - 11.0) / 5.0, Bessel.ai1cs_$LI$())) / Math.sqrt(y);
        }
        else if (y === 0.0)
            return 0.0;
        else
            return Math.exp(-y) * x * (0.875 + Bessel.chebyshev(y * y / 4.5 - 1.0, Bessel.bi1cs_$LI$()));
    };
    Bessel.ai0cs_$LI$ = function () { if (Bessel.ai0cs == null)
        Bessel.ai0cs = [0.07575994494023797, 0.00759138081082334, 4.1531313389237E-4, 1.070076463439E-5, -7.90117997921E-6, -7.8261435014E-7, 2.7838499429E-7, 8.2524726E-9, -1.204463945E-8, 1.55964859E-9, 2.2925563E-10, -1.1916228E-10, 1.757854E-11, 1.12822E-12, -1.14684E-12, 2.7155E-13, -2.415E-14, -6.08E-15, 3.14E-15, -7.1E-16, 7.0E-17]; return Bessel.ai0cs; };
    ;
    Bessel.ai02cs_$LI$ = function () { if (Bessel.ai02cs == null)
        Bessel.ai02cs = [0.05449041101410882, 0.00336911647825569, 6.889758346918E-5, 2.89137052082E-6, 2.0489185893E-7, 2.266668991E-8, 3.39623203E-9, 4.9406022E-10, 1.188914E-11, -3.149915E-11, -1.32158E-11, -1.79419E-12, 7.1801E-13, 3.8529E-13, 1.539E-14, -4.151E-14, -9.54E-15, 3.82E-15, 1.76E-15, -3.4E-16, -2.7E-16, 3.0E-17]; return Bessel.ai02cs; };
    ;
    Bessel.ai1cs_$LI$ = function () { if (Bessel.ai1cs == null)
        Bessel.ai1cs = [-0.02846744181881479, -0.01922953231443221, -6.1151858579437E-4, -2.06997125335E-5, 8.58561914581E-6, 1.04949824671E-6, -2.9183389184E-7, -1.559378146E-8, 1.318012367E-8, -1.44842341E-9, -2.9085122E-10, 1.2663889E-10, -1.664947E-11, -1.66665E-12, 1.2426E-12, -2.7315E-13, 2.023E-14, 7.3E-15, -3.33E-15, 7.1E-16, -6.0E-17]; return Bessel.ai1cs; };
    ;
    Bessel.ai12cs_$LI$ = function () { if (Bessel.ai12cs == null)
        Bessel.ai12cs = [0.02857623501828014, -0.00976109749136147, -1.1058893876263E-4, -3.88256480887E-6, -2.5122362377E-7, -2.631468847E-8, -3.83538039E-9, -5.5897433E-10, -1.897495E-11, 3.252602E-11, 1.41258E-11, 2.03564E-12, -7.1985E-13, -4.0836E-13, -2.101E-14, 4.273E-14, 1.041E-14, -3.82E-15, -1.86E-15, 3.3E-16, 2.8E-16, -3.0E-17]; return Bessel.ai12cs; };
    ;
    Bessel.bi0cs_$LI$ = function () { if (Bessel.bi0cs == null)
        Bessel.bi0cs = [-0.07660547252839145, 1.9273379539938083, 0.22826445869203013, 0.013048914667072904, 4.344270900816487E-4, 9.42265768600193E-6, 1.4340062895106E-7, 1.61384906966E-9, 1.396650044E-11, 9.579451E-14, 5.3339E-16, 2.45E-18]; return Bessel.bi0cs; };
    ;
    Bessel.bi1cs_$LI$ = function () { if (Bessel.bi1cs == null)
        Bessel.bi1cs = [-0.001971713261099859, 0.4073488766754648, 0.03483899429995946, 0.001545394556300123, 4.1888521098377E-5, 7.64902676483E-7, 1.0042493924E-8, 9.9322077E-11, 7.6638E-13, 4.741E-15, 2.4E-17]; return Bessel.bi1cs; };
    ;
    Bessel.main = function (args) {
        var y = Bessel.modBesselFirstZero(1);
        var z = Bessel.modBesselFirstOne(1);
        console.info(y);
        console.info(z);
    };
    return Bessel;
}());
Bessel["__class"] = "Bessel";
Bessel.bi1cs_$LI$();
Bessel.bi0cs_$LI$();
Bessel.ai12cs_$LI$();
Bessel.ai1cs_$LI$();
Bessel.ai02cs_$LI$();
Bessel.ai0cs_$LI$();
Bessel.main(null);
