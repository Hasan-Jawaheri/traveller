
var item_page = new function() {
    this.get_head = function(args) {
        return $(`
            <div class="col-xs-12" style="color: white; font-size: 50pt; padding: 20px; padding-left: 50px;">
                <span>` + args.name + `</span>
            </div>
        `);
    };

    this.get_body = function(args) {
        var obj = $(`
        `);

        return obj;
    };
};
