var dashboard_page = new function() {
    this.get_head = function(args) {
        return $(`
            <div class="col-xs-12">
            <h1>My Dashboard</h1>
            </div>
        `);
    };

    this.get_body = function(args) {
        this.body = ``;
        this.flights = [
            {
                airport_from : "Hamad Internation Airport",
                airport_to : "Dubai International Airport",
                departure_time: new Date(),
                arrival_time: new Date((new Date()).getTime() + 60 * 60000),
                flight_no: "Z300"

            },
            {
                airport_from: "Dubai International Airport",
                airport_to: "London International Airport",
                departure_time: new Date((new Date()).getTime() + 270 * 60000),
                arrival_time: new Date((new Date()).getTime() + 560 * 60000),
                flight_no: "Z301"
            }

        ];

        for(var i = 0; i < this.flights.length; i++) {
                this.body = this.body + `
                <div class="container">
                    <div class="row">
                        <div class="btn btn-default">heqweda</div>
                        <div class="col-sm-4">
                            <div class="row">Departure</div>
                            <div class="row"> From: ` + this.flights[i].airport_from + `</div>
                            <div class="row">` + this.flights[i].departure_time.getHours() + `:` + this.flights[i].departure_time.getMinutes() + `</div>
                            <div class="row"></div>
                        </div>
                        <div class="col-sm-4">
                            <div class="row" style="text-align: center;"> Flight No. : ` + this.flights[i].flight_no + `</div>
                            <div class="row"></div>
                            <div class="row"><img src="../images/plane.png" /></div>
                            <div class="row"></div>
                        </div>
                        <div class="col-sm-4">
                            <div class="row">Arrival</div>
                            <div class="row"> To: ` + this.flights[i].airport_to + `</div>
                            <div class="row">` + this.flights[i].arrival_time.getHours() + `:` + this.flights[i].arrival_time.getMinutes() + `</div>
                            <div class="row"></div>
                        </div>
                    </div>
                </div>`;
        }

        return $(this.body);
    };
};