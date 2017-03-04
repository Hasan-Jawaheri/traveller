
var menu_item = new function() {
    this.get = function(icon, text) {
        var item = $(`
            <div class="col-xs-6 menu-card-container">
                <div class="menu-card panel-default">
                    <br />
                    <span style="font-size: 60pt">` + icon + `</span>
                    <br />
                    <span>` + text + `</span>
                </div>
            </div>
        `);
        item.find(".menu-card").click(function() {
            app.load_page(listing_page, {
                title: text,
                icon: icon,
                places: airport_page.get_places(text)
            });
        });
        return item;
    }
}

var airport_page = new function() {
    this.categories = {};
    this.current_airport = undefined;
    this.info_body = undefined;

    this.get_head = function(args) {
        var ap = args.airport;
        return $(`
        `);
    };

    this.get_body = function(args) {
        var ap = args.airport;
        this.current_airport = ap;
        this.categories = {};

        var photo = "";
        if (ap && ap.photos)
            photo = ap.photos[0];

        var name = "";
        if (ap && ap.name)
            name = ap.name;

        this.info_body = $(`
            <div class="airport-info-container">
                <img class="airport-photo" src="` + photo + `"></img>
                <div style="position: absolute; width: 100%; top: 20px; font-size: 46pt; text-align: center">
                    <p class="airport-name">` + name +  `<p>
                </div>
            </div>

            <div class="col-xs-12">
                <div id="items-container" class="row">
                </div>
            </div>
        `);

        if (this.current_airport != undefined)
            this.on_places_update(ap.name);

        return this.info_body;
    };

    this.on_airports_update = function() {
        if (this.current_airport == undefined) {
            app.set_tab(1);
        }
    };

    this.on_places_update = function(ap_name) {
        if (ap_name != this.current_airport.name)
            return;
        this.current_airport = app.airports[ap_name];

        var good_names = {
            "restaurant": "Restaurants",
            "food": "Restaurants",
            "bakery": "Restaurants",
            "cafe": "Coffee Shops",
            "clothing_store": "Shopping",
            "shoe_store": "Shopping",
            "electronics_store": "Shopping",
            "pharmacy": "Pharmacies",
            "point_of_interest": "Popular",
            "night_club": "Entertainment",
            "spa": "Entertainment",
            "bank": "Utilities",
            "museum":  "Utilities",
            "mosque": "Utilities",
            "travel_agency": "Utilities",
        };

        if (app.get_stay_duration_minutes(ap_name) > 5 * 60) {
            // add transportation
            good_names = Object.assign(good_names, {
                "car_rental": "Transportation",
                "taxi_stand": "Transportation",
                "bus_station": "Transportation",
                "train_station": "Transportation",
                "parking": "Transportation",
            });
        }

        if (app.get_stay_duration_minutes(ap_name) > 12 * 60) {
            // add hotels
            good_names = Object.assign(good_names, {
                "lodging": "Hotels",
            });
            requester.queue_request({
                location: this.current_airport.location,
                type: "lodging",
                rankby: "distance",
            }, function(r) {
                app.on_airport_new_data(ap_name, r);
            }, undefined, true);
        }

        for (var i = 0; i < this.current_airport.places.length; i++) {
            var place = this.current_airport.places[i];
            var types = place.types;
            for (var t = 0; t < types.length; t++) {
                var type = types[t];
                if (!(type in good_names))
                   continue;
                type = good_names[type];
                if (!(type in this.categories)) {
                    this.categories[type] = [place];
                    this.info_body.append(menu_item.get("<span class='glyphicon glyphicon-star'></span>", type));
                } else {
                    var places_in_cat = this.categories[type];
                    var found = false;
                    for (var j = 0; j < places_in_cat.length && !found; j++)
                        if (places_in_cat[j].name == place.name)
                            found = true;
                    if (!found)
                        this.categories[type].push(place);
                }
            }
        }
    }

    this.get_places = function(text) {
        if (!(text in this.categories))
            return [];
        return this.categories[text];
    }
};
