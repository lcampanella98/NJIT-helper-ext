angular.module('movies', []).controller('MovieController', ['$scope', function ($scope) {

    $scope.allMovies = {};
    $scope.movieRequests = [];
    $scope.sortBy = 'NAME';
    $scope.movieStackPointer = 0;
    $scope.searchString = '';
    $scope.getMinMovieRating = function (cb) {
        chrome.storage.local.get('movieRating', function (items) {
            if (items.hasOwnProperty("movieRating")) {
                $scope.minRating = items["movieRating"];
            }
            cb();
        });
    };

    $scope.getAllMovies = function (cb) {
        // chrome.storage.local.set({"allMovies": []}, function () {
        //     cb();
        // });
        chrome.storage.local.get("allMovies", function (items) {
            if (items.hasOwnProperty("allMovies")) {
                $scope.allMovies = items["allMovies"];
            }
            cb();
        });
    };

    $scope.getMovieCategories = function () {
        chrome.storage.local.get('movieCategories', function (items) {
            if (items.hasOwnProperty("movieCategories")) {
                $scope.cats = items["movieCategories"];
                $scope.getAllMovies(function () {
                    $scope.getMinMovieRating(function () {
                        $("#rating-slider").slider( "option", "value", $scope.minRating );
                        for (var i = 0; i < $scope.cats.length; i++) {
                            var cat = $scope.cats[i];
                            for (var j = 0; j < cat.movies.length; j++) {
                                $scope.getCategoryMovieData(i, j);
                            }
                        }
                        $scope.performAjaxRequests();
                        $scope.updateLoadingSpinner();
                        $scope.updateSortedArrays();
                        $scope.$apply();
                    })
                });
            }
        });
    };

    $scope.onMovieClick = function ($event) {
        var target = $($event.currentTarget);
        var movName = target.find(".movie-name").text();
        chrome.storage.local.set({"activeMovie": movName}, function () {
            chrome.tabs.query({}, function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].url === "https://reslifecinema-njit-edu.swankmp.net/#/browse") {
                        chrome.tabs.update(result[i].id, {selected:true}, function () {
                            chrome.tabs.executeScript(null, {file: "scripts/loadMovie.js"});
                        });
                    }
                }
            })
        });
    };

    $scope.performAjaxRequests = function () {
        var delay = 1000 * 10 / 40;
        $scope.movieStackPointer = $scope.movieRequests.length;

        var sendRequest = function (sp) {
            var movInfo = $scope.movieRequests[sp];
            var movie = $scope.cats[movInfo.catIndex].movies[movInfo.movieIndex];
            var url = "https://api.themoviedb.org/3/search/multi?api_key=8740f9611fc29d1761e57380cec9767c&language=en-US&query=" + encodeURIComponent(movie.name) + "&page=1&include_adult=false";
            $.ajax({
                url: url,
                type: 'GET',
                success: function (dataObj) {
                    var numResults = dataObj["total_results"];
                    var resultIndex = 0, mediaType;
                    while (resultIndex < numResults &&
                    !((mediaType = dataObj.results[resultIndex]["media_type"]) === 'movie'
                        || mediaType === 'tv')) resultIndex++;
                    var rating = null;
                    if (resultIndex < numResults) {
                        rating = dataObj.results[0].vote_average; // TODO get dataObj Rating Property
                    }
                    var newMovie = {name: movie.name, rating: rating};
                    $scope.addMovieToStorage(newMovie);
                    $scope.cats[movInfo.catIndex].movies[movInfo.movieIndex] = $scope.allMovies[newMovie.name];

                },
                complete: function(req, stat) {
                    if (stat === 'success') {
                        if (sp % 3 === 0 || sp <= 0) {
                            $scope.updateSortedArrays();
                            $scope.updateLoadingSpinner();
                            $scope.$apply();
                        }
                    } else {
                        sendRequest(sp);
                    }
                },
                error: function (err) {}
            });
        };

        var loadNextMovies = function() {
            if ($scope.movieStackPointer > 0) sendRequest(--$scope.movieStackPointer);
            else {
                clearInterval(interval);
            }
        };
        loadNextMovies();
        var interval = setInterval(loadNextMovies, delay);

    };

    $scope.updateSortedArrays = function () {
        $scope.catsByName = $scope.getSortedCats('NAME');
        $scope.catsByRating = $scope.getSortedCats('RATING');
        $scope.useSortBy($scope.sortBy);
    };

    $scope.useSortBy = function (sortBy) {
        $scope.sortBy = sortBy.toUpperCase();
        if ($scope.sortBy === 'RATING') {
            $scope.catsToUse = $scope.catsByRating;
        } else {
            $scope.catsToUse = $scope.catsByName;
        }
    };

    var compareMoviesByNameAsc = function(m1, m2) {
        if (!m1.hasOwnProperty('name')) return m2.hasOwnProperty('name') ? 1 : 0;
        if (m1.name > m2.name) return 1;
        if (m1.name < m2.name) return -1;
        return 0;
    };

    var compareMoviesByRatingDesc = function(m1, m2) {
        if (!m1.hasOwnProperty('rating') || m1.rating === null) return (!m2.hasOwnProperty('rating') || m2.rating === null) ? 0 : 1;
        if (m1.rating > m2.rating) return -1;
        if (m1.rating < m2.rating) return 1;
        return 0;
    };

    $scope.getSortedCats = function (sortBy) {
        var cmpFn;
        if (sortBy.toUpperCase() === 'NAME') {
            cmpFn = compareMoviesByNameAsc;
        } else if (sortBy.toUpperCase() === 'RATING') {
            cmpFn = compareMoviesByRatingDesc;
        } else return null;
        var sorted = [];
        var cat, sortedCat, movies;
        for(var i = 0; i < $scope.cats.length; i++) {
            cat = $scope.cats[i];
            sortedCat = {name: cat.name};
            movies = cat.movies.slice();
            movies.sort(cmpFn);
            sortedCat.movies = movies;
            sorted.push(sortedCat);
        }
        return sorted;
    };

    $scope.addMovieToStorage = function(movie, cb) {
        $scope.allMovies[movie.name] = movie;
        chrome.storage.local.set({"allMovies": $scope.allMovies}, cb);
    };

    $scope.getCategoryMovieData = function(catIndex, movieIndex) {
        var movie = $scope.cats[catIndex].movies[movieIndex];
        if ($scope.allMovies.hasOwnProperty(movie.name)) {
            $scope.cats[catIndex].movies[movieIndex] = $scope.allMovies[movie.name];
        } else {
            // otherwise send API request
            $scope.movieRequests.splice(0, 0, {catIndex: catIndex, movieIndex: movieIndex});
        }
    };

    $scope.shouldDisplayMovie = function (movie) {
        if (!(movie.hasOwnProperty("rating") && (movie.rating >= $scope.minRating || movie.rating === null))) return false;
        if ($scope.searchString === '') return true;
        return movie.name.toUpperCase().includes($scope.searchString.toUpperCase());
    };

    $scope.catHasValidMovie = function(cat) {
        for (var i = 0; i < cat.movies.length; i++) {
            if ($scope.shouldDisplayMovie(cat.movies[i])) return true;
        }
        return false;
    };

    $scope.getRatingColor = function(movie) {
        var red, green, blue;
        var max = 244;
        var min = 66;
        if (movie.hasOwnProperty('rating') && movie.rating !== null) {
            // red (0.0) is (max, min, min)
            // green (min, max, min)
            // in between is (max, max, min)
            var range = (max - min) * 2;
            var numVals = Math.pow(movie.rating / 10.0, 1.7) * range;
            red = max;
            green = min;
            blue = min;
            green += numVals;
            if (green > max) {
                red -= green - max;
                green = max;
            }
        } else {
            red = (max + min) / 2;
            green = min;
            blue = (max + min) / 2;
        }
        return 'rgb(' + Math.round(red) + ',' + Math.round(green) + ',' + Math.round(blue) + ')';
    };

    $scope.getRatingText = function (movie) {
        return movie.rating === null ? '??' : movie.rating.toFixed(1);
    };

    $scope.updateLoadingSpinner = function() {
        var spinTarget = document.getElementById('load-progress-spinner');
        if (spinTarget && (!$scope.hasOwnProperty('spinner') || !$scope.spinner)) {
            var loadSpinnerOpts = {
                lines: 8 // The number of lines to draw
                , length: 3 // The length of each line
                , width: 2 // The line thickness
                , radius: 6 // The radius of the inner circle
                , opacity: 0.25 // Opacity of the lines
                , speed: 1 // Rounds per second
                , top: '50%' // Top position relative to parent
                , left: '10px' // Left position relative to parent
                , position: 'absolute' // Element positioning
            };
            $scope.spinner = new Spinner(loadSpinnerOpts).spin(spinTarget);
        }
        if (!spinTarget && $scope.hasOwnProperty('spinner') && $scope.spinner) {
            $scope.spinner.stop();
            $scope.spinner = null;
        }
    };

    $scope.getMovieCategories();
    $scope.updateLoadingSpinner();

    $('#rating-slider').slider({
        max: 10.0,
        min: 0.0,
        step: 0.1,
        slide: function (event, ui) {
            $scope.minRating = ui.value;
            $scope.$apply();
        }
    });

}]);