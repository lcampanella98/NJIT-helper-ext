var activeClassGroup = null;
var movieRating = null;

function initActiveClassGroup() {
    chrome.storage.sync.get("classGroups", function(items) {
        if (items.hasOwnProperty("classGroups")) {
            var groups = items.classGroups;
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].isActive) {
                    activeClassGroup = groups[i];
                    break;
                }
            }
        }
    });
}

initActiveClassGroup();

chrome.storage.onChanged.addListener(function onChromeStorageChanged(changes, namespace) {
    if (changes.hasOwnProperty("classGroups")) {
        activeClassGroup = null;
        var newGroups = changes["classGroups"].newValue;
        for (var i = 0; i < newGroups.length; i++) {
            if (newGroups[i].isActive) {
                activeClassGroup = newGroups[i];
                break;
            }
        }
    }
    if (changes.hasOwnProperty("movieCategories")) {
        var newCategories = changes["movieCategories"].newValue;
        for (i = 0; i < newCategories.length; i++) {
            var cat = newCategories[i];

        }
    }
});

chrome.runtime.onMessage.addListener(function msgListener(request, sender, sendResponse) {
    if (request.action === "classes") {
        if (activeClassGroup) {
            sendResponse(activeClassGroup.classes);
        }
    }
    else if (request.action === "movieRating") {
        if (request.hasOwnProperty("rating")) {
            movieRating = request["rating"];
            chrome.storage.local.set({"movieRating": movieRating});
        }
    } else if (request.action === "getMovies") {
        console.log('get movies');
        if (request.hasOwnProperty("categories")) {
            var cats = request['categories'];
            //cats = []; // TODO REMOVE THIS WHEN CERTAIN IT WORKS
            //if (request['categories'].length > 0) cats.push(request['categories'][0]);
            chrome.storage.local.set({"movieCategories": cats}, function() {
                chrome.tabs.create({url: 'views/movies.html'});
            });
        }
    }
});
