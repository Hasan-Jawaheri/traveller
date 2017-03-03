
var list_item = new function() {
    this.get = function(desc) {
        console.log(desc);
        var main_photo = "http://www.lightideas.net.au/wp-content/themes/titan/wpsc-noimage.gif";
        if (desc.photos)
            if (desc.photos.length > 0)
                main_photo = desc.photos[0].url;
        return $(`
            <div class="list-item-card row">
                <div class="list-item-photo-container col-xs-3">
                    <img class="list-item-photo" src="` + main_photo + `" />
                </div>
                <div class="col-xs-8">
                    ` + desc.name + `
                </div>
                <div class="col-xs-1" style="position: relative; height: 200px;">
                    <span class="list-item-right glyphicon glyphicon-menu-right"></span>
                </div>
            </div>
        `);
    };
};

var listing_page = new function() {
    this.get_head = function(args) {
        var ap = args.airport;
        return $(`
        `);
    };

    this.get_body = function(args) {
        console.log(args);
        var obj = $(`
            <div id="items-container" class="col-xs-12">
            </div>
        `);

        for (var i = 0; i < args.length; i++) {
            obj.append(list_item.get(args[i]));
        }

        return obj;
    };
};
