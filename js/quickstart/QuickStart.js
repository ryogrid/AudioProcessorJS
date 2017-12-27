/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    /**
     * This class is used within the webapp/index.html file.
     * @class
     */
    var QuickStart = (function () {
        function QuickStart() {
        }
        QuickStart.main = function (args) {
            var l = ([]);
            /* add */ (l.push("Hello") > 0);
            /* add */ (l.push("world") > 0);
            var a = (new Array());
            a.push("Hello", "world");
            $("#target").text(/* toString */ ('[' + l.join(', ') + ']'));
            alert(a.toString());
        };
        return QuickStart;
    }());
    quickstart.QuickStart = QuickStart;
    QuickStart["__class"] = "quickstart.QuickStart";
})(quickstart || (quickstart = {}));
quickstart.QuickStart.main(null);
