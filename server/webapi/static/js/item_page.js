
var item_page = new function() {
    this.get_head = function(args) {
        return $(`
            <div class="col-xs-2" style="padding: 20px; padding-left: 50px;">
                <img src=` + args.icon + ` ></img>
            </div>
            <div class="col-xs-10" style="color: white; font-size: 30pt; padding-top: 40px; padding-left: 50px;">
                <span>` + args.name + `</span>
            </div>
        `);
    };

    this.get_body = function(args) {
        var indicators = "";
        var slides = "";

        var photos = ["http://www.lightideas.net.au/wp-content/themes/titan/wpsc-noimage.gif"]
        if (args.photos && args.photos.length > 0) {
            photos = [];
            for (var i = 0; i < args.photos.length; i++)
                photos.push(requester.make_url({
                    api: "photo",
                    maxwidth: 800,
                    photoreference: args.photos[i].photo_reference,
                }))
        }

        for (var i = 0; i < photos.length; i++) {
            indicators += '<li data-target="#carousel-example-generic" data-slide-to="' + i + '" ' + (i == 0 ? 'class="active"' : '') + '></li>';
            slides += `
                <div class="item ` + (i == 0? "active" : "") + `">
                    <img class="display-image" src="` + photos[i] + `">
                </div>
            `;
        }

        var obj = $(`
                <div id="list-item-carousel" class="carousel slide" data-ride="carousel">
                  <!-- Indicators -->
                  <ol class="carousel-indicators">
                  ` + indicators + `
                  </ol>

                  <!-- Wrapper for slides -->
                  <div class="carousel-inner" role="listbox">
                  ` + slides + `
                  </div>

                  <!-- Controls -->
                  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
        `);

        return obj;
    };
};
