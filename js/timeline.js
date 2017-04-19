define(["require", "exports", "jquery", "handlebars"], function (require, exports, $, Handlebars) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function timeline(container) {
        var source = container.find("script").html();
        var template = Handlebars.compile(source);
        Handlebars.registerHelper('formatDate', function (input) {
            if (input === null) {
                return "Present";
            }
            else {
                var date = new Date(input);
                var monthNames = [
                    "January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"
                ];
                return monthNames[date.getMonth()] + ' ' + date.getFullYear();
            }
        });
        Handlebars.registerHelper('isEducation', function (input) { return input === "education"; });
        $.ajax({
            url: "../data/experience.json"
        }).done(function (data) {
            var html = template(data);
            container.append(html);
        });
    }
    exports.default = timeline;
});
