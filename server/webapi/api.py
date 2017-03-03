from django.shortcuts import HttpResponse, HttpResponseRedirect
from django.conf import settings
import requests, json, time

def get_nearby(r):
    try:
        airport = r.GET["airport"]
        duration = r.GET["duration"]
    except: pass
#        return HttpResponse("invalid request")

    places = []
    params_dict = {
        "key": settings.PLACES_API_KEY,
        "location": "25.2605946,51.6137665",
        "radius": "50000",
        "type": "lodging",
    }

    s = requests.session()
    while True:
        params = ""
        for key in params_dict:
            params += "&" + key + "=" + params_dict[key]

        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + params[1:]

        response = s.get(url).json()
        if response["status"] == "ZERO_RESULTS":
            break
        elif response["status"] == "OVER_QUERY_LIMIT":
            return HttpResponse(json.dumps({"result": "Query limit"}), content_type="application/json")
        elif response["status"] == "INVALID_REQUEST":
            return HttpResponse(json.dumps({"result": "Requesting too fast"}), content_type="application/json")
        elif response["status"] == "REQUEST_DENIED":
            return HttpResponse(json.dumps({"result": "Invalid key"}), content_type="application/json")

        places += response["results"]

        if "next_page_token" not in response:
            break
        params_dict = {
            "key": settings.PLACES_API_KEY,
            "pagetoken": response["next_page_token"]
        }
        time.sleep(3)

    reorganized = {}
    for p in places:
        photos = p.get("photos", [])
        if "types" not in p or len(p["types"]) == 0:
            p["types"] = ["others"]

        for key in p["types"]:
            obj = {
                "name": p["name"],
                "photos": photos,
                "types": p["types"],
            }
            if key in reorganized:
                reorganized[key].append(obj)
            else:
                reorganized[key] = [obj]

    return HttpResponse(json.dumps({
        "result": "OK",
        "places": places,
    }), content_type="application/json")
