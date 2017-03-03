
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
            app.load_page(listing_page, {
            });
        });
        return item;
    }
}

var airport_page = new function() {
    this.get_head = function(args) {
        var ap = args.airport;
        return $(`
        `);
    };

    this.get_body = function(args) {
        var ap = args.airport;
        var items = [
            menu_item.get(`<span class="glyphicon glyphicon-glass"></span>`, "Restaurants"),
            menu_item.get("", "Shops"),
            menu_item.get("", "Duty Free"),
            menu_item.get("", "Duty Free"),
            menu_item.get("", "Duty Free"),
            menu_item.get("", "Duty Free"),
            menu_item.get("", "Duty Free"),
        ];

        var body = $(`
            <div class="airport-info-container">
                <img class="airport-photo" src="` + ap.photo + `"></img>
                <div style="position: absolute; width: 100%; top: 20px; font-size: 46pt; text-align: center">
                    <p class="airport-name">` + ap.name +  `<p>
                </div>
            </div>

            <div class="col-xs-12">
                <div id="items-container" class="row">
                </div>
            </div>
        `);

        for (var i = 0; i < items.length; i++)
            body.find("#items-container").append(items);

        return body;
    };
};
