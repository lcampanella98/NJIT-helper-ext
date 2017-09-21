var NJITCrummyUIHelperResLifeMoviesScope = new function () {

    this.execute = function() {
        var scrollOffset = window.innerHeight;
        var self = this;
        var checkAndPage = function () {
            var loadingCats = document.getElementsByClassName('movieGrid-loading');
            var docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
            if (loadingCats.length > 0) {
                var newScrollY = window.scrollY + scrollOffset;
                if (newScrollY >= docHeight) {
                    newScrollY = docHeight;
                    scrollOffset = -window.innerHeight;
                } else if (newScrollY < 0) {
                    newScrollY = 0;
                    scrollOffset = window.innerHeight;
                }
                window.scrollTo(window.scrollX, newScrollY);
            } else {
                clearInterval(interval);
                self.sendMovies();
                return true;
            }
        };
        if (!checkAndPage()) {
            var interval = setInterval(checkAndPage, 200);
        }
    };

    this.sendMovies = function () {
        var moviesByCategory = [];
        var filmCategories = document.getElementsByClassName('filmCategory');
        for (var i = 0; i < filmCategories.length; i++) {
            var catName = filmCategories[i].getElementsByClassName('category-title')[0].childNodes[0].textContent.trim();
            var movies = [];
            var moviesElements = filmCategories[i].getElementsByClassName('movieTitle');
            for (var j = 0; j < moviesElements.length; j++) {
                var movieName = moviesElements[j].getElementsByTagName('span')[0].getAttribute('title').trim();
                movies.push({name: movieName});
            }
            var cat = {name: catName, movies: movies};
            moviesByCategory.push(cat);
        }
        chrome.runtime.sendMessage({action: "getMovies", categories: moviesByCategory});
    };
};

NJITCrummyUIHelperResLifeMoviesScope.execute();
