var NJITCrummyUIHelperResLifeMoviesLoadMovieScope = new function () {
    this.loadMovie = function () {
        chrome.storage.local.get("activeMovie", function (items) {
            if (items.hasOwnProperty("activeMovie")) {
                var movTitle = items["activeMovie"];
                var allMovies = document.getElementsByClassName("movieTitle");
                for (var i = 0; i < allMovies.length; i++) {
                    var childSpans = allMovies[i].getElementsByTagName("span");
                    if (childSpans.length > 0) {
                        var curTitle = childSpans[0].getAttribute("title");
                        if (movTitle === curTitle) {
                            console.log(allMovies[i].parentNode.parentNode.getAttribute('href'));
                            var win = window.open(allMovies[i].parentNode.parentNode.getAttribute('href'), "_blank");
                            if (win) {
                                win.focus();
                            }
                            return;
                        }
                    }
                }

            }
        })
    }
};

NJITCrummyUIHelperResLifeMoviesLoadMovieScope.loadMovie();