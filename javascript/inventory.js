//eBay API
function _cb_findItemsByKeywords(response) {
    console.log(response);
    var idx = 0;
    for (idx = 0; idx < response.findItemsByKeywordsResponse[0].searchResult[0].item.length; idx++) {
        var item = response.findItemsByKeywordsResponse[0].searchResult[0].item[idx];
        var imageUrl = item.galleryURL[0];
        var title = item.title;
  

        $('#tableBody').append('<tr><td><img src="' + imageUrl + '"></td><td>' + title + '</td></tr>');
    }
}

var rawurlencode = function (str) {
    str = (str + '');
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
};

var params = {
    "OPERATION-NAME": "findItemsByKeywords",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": "deidrang-DUcode-PRD-88e35c535-a6b95781",
    "GLOBAL-ID": "EBAY-US",
    "RESPONSE-DATA-FORMAT": "JSON",
    "callback": "_cb_findItemsByKeywords",
    "REST-PAYLOAD": null,
    "keywords": "laptop", //keywork lookup
    "paginationInput.entriesPerPage": "10", //number if items returned
};
var keys = Object.keys(params);
keys.sort();
var list = [];
var i;
for (i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (params[key]) {
        list.push(rawurlencode(key) + '=' + rawurlencode(params[key]));
    } else {
        list.push(rawurlencode(key));
    }
}
var canonical_query_string = list.join('&');

var uri = "/services/search/FindingService/v1";
var endpoint = "svcs.ebay.com";

var request_url = 'http://' + endpoint + uri + '?' + canonical_query_string;

console.log('request_url = ' + request_url);

$.ajax({
    url: request_url,
    type: "GET",
    dataType: "jsonp",
    jsonp: false,
    cache: true,
    crossDomain: true,
});
