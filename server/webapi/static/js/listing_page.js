
var list_item = new function() {
    this.get = function(desc) {
        return $(`
            <div class="list-item-card">
                ` + desc.name + `
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
        var items_list = [{
            name: "Tea time",
            photos: [{
                url: "https://b.zmtcdn.com/data/pictures/9/6200619/4003a1f24360a29da64822f23faa7561.jpg?fit=around%7C200%3A200&crop=200%3A200%3B*%2C*"
            }],
            rating: 3.5,
        }, {
            name: "Tea time 2",
            photos: [{
                url: "https://b.zmtcdn.com/data/pictures/9/6200619/4003a1f24360a29da64822f23faa7561.jpg?fit=around%7C200%3A200&crop=200%3A200%3B*%2C*"
            }],
            rating: 3.5,
        }];
        var obj = $(`
            <div id="items-container">
            </div>
        `);

        for (var i = 0; i < items_list.length; i++) {
            console.log(obj.find("#items-container"));
            obj.find("#items-container").append(list_item.get(items_list[i]));
            console.log(obj.find("#items-container"));
        }

        return obj;
    };
};
