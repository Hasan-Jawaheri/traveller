
function millis_to_str(m) {
    var minute = 60 * 1000;
    var hour = 60 * minute;
    var day = 24 * hour;

    var days = 0;
    var hours = 0;
    var minutes = 0;

    if (m > day) {
        days = Math.floor(m / day);
        m = m % day;
    }
    if (m > hour) {
        hours = Math.floor(m / hour);
        m = m % hour;
    }
    if (m > minute) {
        minutes = Math.floor(m / minute);
        m = m % minute;
    }
    return ((days > 0 ? days + "d  " : " ") + (hours > 0 ? hours + "h " : " ") + (minutes > 0 ? minutes + "m " : " ")).trim();
}

var dashboard_item = new function() {
    this.get = function(airport, stay_time, is_initial) {
        var time_str = stay_time;
        if (is_initial === true)
            time_str = "Origin (departing in " + millis_to_str(stay_time - (new Date()).getTime()) + ")";
        else if (is_initial === false)
            time_str = "Destination (arriving in " + millis_to_str(stay_time - (new Date()).getTime()) + ")";
        else
            time_str = "Staying for " + millis_to_str(stay_time);

        var item = $(`
            <div class="dashboard-item-container row">
                <div class="col-xs-12">
                    <span>` + airport + `</span>
                    <p>` + time_str + `</p>
                </div>
            </div>
        `);
        item.click(function() {
            app.load_page(airport_page, {
                airport: app.airports[airport]
            })
        });
        return item;
    };
}

var dashboard_page = new function() {
    this.get_head = function(args) {
        return $(`
            <div class="col-xs-12">
            <h1>My Dashboard</h1>
            </div>
        `);
    };

    this.get_body = function(args) {
        var body = $(`
            <div id="dashboard-container" class="col-xs-12">
            </div>
        `);
        var initial = {
            airport: args[0].airport_from,
            ends: args[0].departure_time,
        };
        var transits = [];
        var final = {
            airport: args[args.length-1].airport_to,
            ends: args[args.length-1].arrival_time.getTime() + 2 * 24 * 60 * 60 * 1000,
        };
        for (var i = 1; i < args.length; i++) {
            transits.push({
                airport: args[i].airport_from,
                ends: args[i].departure_time.getTime() - args[i-1].arrival_time.getTime(),
            });
        }

        body.append(dashboard_item.get(initial.airport, initial.ends, true));
        for (var f = 0; f < transits.length; f++) {
            body.append(dashboard_item.get(transits[f].airport, transits[f].ends));
        }
        body.append(dashboard_item.get(final.airport, final.ends, false));

        return body;
    };
};