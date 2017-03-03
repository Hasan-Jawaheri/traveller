
var app = new function() {
    this.current_airport = undefined;

    this.run = function() {
        this.current_airport = {
            name: "Hamad International Airport",
            photo: "http://botschaft-katar.de/en/wp-content/uploads/sites/2/2014/08/HIA-Passenger-Terminal-At-Sunset_Low-Res.jpg",
            from_time: new Date(),
            to_time: new Date((new Date()).getTime() + 180 * 60000),
        };

        this.load_page(airport_page, {
            airport: this.current_airport
        });
    };

    this.load_page = function(page, args) {
        $("#top-bar").html("");
        $("#top-bar").append(page.get_head(args));
        $("#view-content").html("");
        $("#view-content").append(page.get_body(args));
    };

    this.set_tab = function(tab_idx) {
        $(".bottom-tab").removeClass('active');
        $($(".bottom-tab")[tab_idx]).addClass('active');
        if (tab_idx == 0) {

        } else if (tab_idx == 1) {
            this.load_page(airport_page, {
                airport: this.current_airport,
            });
        }
    };

    this.getInfo = function() {
        setTimeout(function() {
            this.current_airport = {
                name: "Hamad Int'l Airport",
                photo: "i-am-a-photo",
            }
        }, 1);
    };
};

$(document).ready(function() {
    app.run();
});
