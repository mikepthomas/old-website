/* 
 * Copyright (c) 2016-2018, Mike Thomas
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
declare var WOW: any;
import Backbone = require("backbone");
import Handlebars = require("handlebars");
import * as moment from "moment";

export class Timeline extends Backbone.View<Backbone.Model> {

    private template: HandlebarsTemplateDelegate;

    initialize() {
        // Register Handlebars helpers
        Handlebars.registerHelper("dateDiff", (start: Date, end: Date) => {
            if (end === null) {
                end = new Date();
            }

            let startDate = moment(start);
            let endDate = moment(end);

            let out = "";
            let years = endDate.diff(startDate, "year");
            if (years > 0) {
                startDate.add(years, "years");
                out += years + " year";
                if (years > 1) {
                    out += "s";
                }
            }

            let months = endDate.diff(startDate, "months");
            if (months > 0) {
                if (years > 0) {
                    out += ", ";
                }
                out += months + " month";
                if (months > 1) {
                    out += "s";
                }
            }

            return out;
        });
        Handlebars.registerHelper("formatDate", (input: Date) => {
            if (input === null) {
                return "Present";
            } else {
                return moment(input).format("MMMM YYYY");
            }
        });
        Handlebars.registerHelper('isEducationOrPartTime',
                (input: string) => input === "apple" ||
                                   input === "mortar-board" ||
                                   input === "ship");

        // Get the Handlebars template
        let source = this.$el.find("script").html();
        this.template = Handlebars.compile(source);

        // Get the data and render the view
        this.collection.fetch({
            success: () => {
                this.render();
            }
        });
    }

    render() {
        let html = this.template(this.collection.toJSON());
        this.$el.html(html);
        require(["wow"], () => {
            new WOW().init();
        });
        return this;
    }
}
