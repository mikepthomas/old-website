/* 
 * Copyright (c) 2017, Mike Thomas
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
import Backbone = require("backbone");
import Handlebars = require("handlebars");

export class Timeline extends Backbone.View<Backbone.Model> {

    private template: HandlebarsTemplateDelegate;

    initialize() {
        // Register Handlebars helpers
        Handlebars.registerHelper('formatDate', (input: string) => {
            if (input === null) {
                return "Present";
            } else {
                let date = new Date(input);
                let monthNames = [
                    "January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"
                ];
                return monthNames[date.getMonth()] + ' ' + date.getFullYear();
            }
        });
        Handlebars.registerHelper('isEducation', (input: string) => input === "education");

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
        return this;
    }
}
