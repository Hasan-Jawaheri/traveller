
var menu_item = new function() {
    this.get = function(icon, text) {
        var item = $(`
            <div class="col-xs-6 menu-card-container">
                <div class="menu-card panel panel-default">
                    <br />
                    ` + icon + `
                    <br />
                    <span>` + text + `</span>
                </div>
            </div>
        `);
        item.find(".menu-card").click(function() {
            app.load_page(listing_page, airport_page.get_places(text));
        });
        return item;
    }
}

var airport_page = new function() {
    this.categories = {};
    this.current_airport = undefined;

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
        if (ap.photos)
            photo = ap.photos[0];

        var body = $(`
            <div class="airport-info-container">
                <img class="airport-photo" src="` + ap.photos[0] + `"></img>
                <div style="position: absolute; width: 100%; top: 20px; font-size: 46pt; text-align: center">
                    <p class="airport-name">` + ap.name +  `<p>
                </div>
            </div>

            <div class="col-xs-12">
                <div id="items-container" class="row">
                </div>
            </div>
        `);

        var me = this;
        setTimeout(function() {
            me.on_places_update(ap.name);
        }, 200);

        return body;
    };

    this.on_places_update = function(ap_name) {
        if (ap_name != this.current_airport.name)
            return;
        this.current_airport = app.airports[ap_name];

        for (var i = 0; i < this.current_airport.places.length; i++) {
            var place = this.current_airport.places[i];
            var types = place.types;
            for (var t = 0; t < types.length; t++) {
                if (!(types[t] in this.categories)) {
                    this.categories[types[t]] = [place];
                    $("#items-container").append(menu_item.get("", types[t]));
                } else {
                    var places_in_cat = this.categories[types[t]];
                    var found = false;
                    for (var j = 0; j < places_in_cat.length && !found; j++)
                        if (places_in_cat[j].name == place.name)
                            found = true;
                    if (!found)
                        this.categories[types[t]].push(place);
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
