
// Create a variable to reference the database that is set in config
    var database = firebase.database();

    // Initial Values
    var assetID = 1000;
    var itemBrand = "";
    var modelNumber = "";
    var itemImage = "";
    var itemDescription = "";

    // Form Capture Button Click
    $("#submit-asset-btn").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        itemBrand = $("#item-brand").val().trim();
        modelNumber = $("#model-number").val().trim();
        assetID++;

        eBaySearch(itemBrand, modelNumber);

        //clear inputs
        $("input").val('');
    });

    //eBay API
    function _cb_findItemsByKeywords(response) {
        console.log(response);
        var idx = 0;
        for (idx = 0; idx < response.findItemsByKeywordsResponse[0].searchResult[0].item.length; idx++) {
            var item = response.findItemsByKeywordsResponse[0].searchResult[0].item[idx];
            var imageUrl = item.galleryURL[0];
            var title = item.title;

            // Code for handling the push
            database.ref('assets').push({
                ItemBrand: itemBrand,
                ModelNumber: modelNumber,
                AssetID: assetID,
                ItemImage: imageUrl,
                ItemDescription: title,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });
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

    var eBaySearch = function (itemBrand, modelNumber) {
        var params = {
            "OPERATION-NAME": "findItemsByKeywords",
            "SERVICE-VERSION": "1.0.0",
            "SECURITY-APPNAME": "deidrang-DUcode-PRD-88e35c535-a6b95781",
            "GLOBAL-ID": "EBAY-US",
            "RESPONSE-DATA-FORMAT": "JSON",
            "callback": "_cb_findItemsByKeywords",
            "REST-PAYLOAD": null,
            "keywords": itemBrand + " " + modelNumber, //keywork lookup
            "paginationInput.entriesPerPage": "1", //number if items returned
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
    };

    database.ref('assets').orderByChild("dateAdded").on("child_added", function (childSnapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = childSnapshot.val();

        if (sv.AssetID > assetID) {
            assetID = sv.AssetID;
        }

        $("#list").append('<div class="row" id="' + childSnapshot.key + '"><div class="col-sm-2" ><img class="tableImg" src="' + sv.ItemImage +
            '" /></div><div class="col-sm-6"><h5 class="tableText">' + sv.ItemDescription +
            '</h5></div ><div class="col-sm-2"><h5 class="tableText">' + sv.AssetID +
            '</h5></div><div class="col-sm-2"><h5 class="tableText"><button class="deleteButton" data-key="' + childSnapshot.key + '">Delete</button>' +
            '</h5></div></div>');

        $('.deleteButton').on('click', function () {
            database.ref('assets' + '/' + $(this).attr('data-key')).remove();
        });

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref('assets').on("child_removed", function (oldChildSnapshot) {
        $('#' + oldChildSnapshot.key).remove();
        var oldAssetId = oldChildSnapshot.AssetID;
    });

    $("#logout-button").on("click", function() {
    event.preventDefault();
    // var currentUser = Parse.User.current();
        // if (currentUser) {
        //     Parse.User.logout();
        //     window.location="Sign_In.html";
        // } else {
            window.location = "index.html";
});