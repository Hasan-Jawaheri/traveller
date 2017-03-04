
var requester = new function() {
    this.key = "AIzaSyBsxSgXFkRkgkNwSw2A3i2I0WlqwVc1mwc";

    this.cached_requests = {};

    this.requests_queue = [];

    this.make_url = function(args) {
        var api = "nearbysearch/json";
        if ("api" in args) {
            api = args.api;
            delete args.api;
        }
        var url = "https://maps.googleapis.com/maps/api/place/" + api + "?key=" + this.key;
        for (var key in args)
            url += "&" + key + "=" + args[key];
        return url;
    }

    this.send_request = function(args, on_data, on_done) {
        var me = this;
        var url = this.make_url(args);
        $.get(url, {}, function(r) {
            me.cached_requests[url] = true;
            if (r.status == "OK") {
                if (r.next_page_token)
                    me.queue_request({pagetoken: r.next_page_token}, on_data, on_done);
                if (on_data)
                    on_data(r.results);
            }
            if (on_done)
                on_done(r);
        })
    };

    this.begin_queue = function() {
        var me = this;
        var process_queue = function() {
            if (me.requests_queue.length > 0) {
                var args = me.requests_queue[0];
                me.send_request(args.args, args.on_data, args.on_done);
                me.requests_queue = me.requests_queue.slice(1);
                setTimeout(process_queue, 3000);
            } else
                setTimeout(process_queue, 500);
        };

        setTimeout(process_queue, 1);
    };

    this.queue_request = function(args, on_data, on_done, urgent) {
        if (this.make_url(args) in this.cached_requests)
            return;

        var obj = {
            args: args,
            on_data: on_data,
            on_done: on_done,
        };

        if (urgent)
            this.requests_queue.unshift(obj);
        else
            this.requests_queue.push(obj);
    };
};

var app = new function() {
    this.airports = {};
    this.flights = [{
        airport_from: "Hamad International Airport",
        airport_to: "Dubai International Airport",
        departure_time: new Date((new Date()).getTime() + 60 * 60000),
        arrival_time: new Date((new Date()).getTime() + 180 * 60000),
    }, {
        airport_from: "Dubai International Airport",
        airport_to: "Heathrow Airport",
        departure_time: new Date((new Date()).getTime() + (180 + 360) * 60000),
        arrival_time: new Date((new Date()).getTime() + (180 + 2000) * 60000),
    }];
    this.current_page = undefined;

    this.run = function() {
        this.get_airports();

        requester.begin_queue();

        this.load_page(airport_page, {});
    };

    this.load_page = function(page, args) {
        $("#top-bar").html("");
        $("#top-bar").append(page.get_head(args));
        $("#view-content").html("");
        $("#view-content").append(page.get_body(args));
        this.current_page = page;
    };

    this.get_current_airport = function() {
        var now = new Date();
        var cur_airport = this.airports[this.flights[0].airport_from];
        for (var i = 0; i < this.flights.length; i++) {
            if (now.getTime() >= this.flights[i].departure_time.getTime()) {
                cur_airport = this.airports[this.flights[i].airport_to];
            }
        }
        return cur_airport;
    };

    this.get_stay_duration_minutes = function(ap_name) {
        if (ap_name == this.flights[0].airport_from)
            return 2 * 60;
        if (ap_name == this.flights[this.flights.length-1].airport_to)
            return 48 * 60;

        for (var i = 1; i < this.flights.length; i++) {
            if (ap_name == this.flights[i].airport_from) {
                var duration_ms = this.flights[i].departure_time.getTime() - this.flights[i-1].arrival_time.getTime();
                return duration_ms / (1000*60);
            }
        }

        return 0;
    };

    this.set_tab = function(tab_idx) {
        $(".bottom-tab").removeClass('active');
        $($(".bottom-tab")[tab_idx]).addClass('active');
        if (tab_idx == 0) {
            this.load_page(dashboard_page, this.flights);
        } else if (tab_idx == 1) {
            this.load_page(airport_page, {
                airport: this.get_current_airport(),
            });
        } else if (tab_idx == 2) {

        } else {

        }
    };

    this.get_airports = function() {
        var me = this;
        var on_airport_loaded = function(airport) {
            me.airports[airport.name] = airport;
            if (me.current_page) {
                if (me.current_page.on_airports_update) {
                    me.current_page.on_airports_update();
                }
            }
            me.populate_airport(airport.name);
        };

        setTimeout(function() {
            on_airport_loaded({
                name: "Hamad International Airport",
                location: "25.2605946,51.6137665",
                photos: ["http://botschaft-katar.de/en/wp-content/uploads/sites/2/2014/08/HIA-Passenger-Terminal-At-Sunset_Low-Res.jpg"],
                places: []
            });
        }, 1);

        setTimeout(function() {
            on_airport_loaded({
                name: "Dubai International Airport",
                location: "25.2531745,55.3634841",
                photos: ["http://vizts.com/wp-content/uploads/2016/01/dubai-international-airport-in-dubai.jpg"],
                places: []
            });
        }, 1);

        setTimeout(function() {
            on_airport_loaded({
                name: "Heathrow Airport",
                location: "51.4700223,-0.4542955",
                photos: ["http://cdn.londonandpartners.com/visit/london-organisations/heathrow-airport/59517-640x360-heathrow-exterior-aircraft_640.jpg"],
                places: []
            });
        }, 1);
    }

    this.on_airport_new_data = function(airport_name, r) {
        for (var i = 0; i < r.length; i++) {
            var exists = false;
            for (var j = 0; j < this.airports[airport_name].places.length; j++)
                if (this.airports[airport_name].places[j].name == r[i].name)
                    exists = true;
            if (!exists)
                this.airports[airport_name].places.push(r[i]);
        }
        if (this.current_page) {
            if (this.current_page.on_places_update) {
                this.current_page.on_places_update(airport_name);
            }
        }
    }

    this.populate_airport = function(airport_name) {
        var me = this;
        requester.queue_request({
            location: this.airports[airport_name].location,
            radius: "1000",
        }, function(r) {
            me.on_airport_new_data(airport_name, r);
        });
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
