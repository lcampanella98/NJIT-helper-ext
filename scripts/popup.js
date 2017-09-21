
$(function() {
    $("#link-add-classes").click(function() {
        chrome.tabs.executeScript(null, {file: "scripts/addClasses.js"});
        window.close();
    });
    $("#link-remove-classes").click(function() {
        chrome.tabs.executeScript(null, {file: "scripts/removeClasses.js"});
        window.close();
    });
    $("#link-schedule-fullscreen").click(function() {
        chrome.tabs.executeScript(null, {file: "scripts/toggleScheduleFullscreen.js"});
        window.close();
    });
    $("#link-get-movies").click(function(e) {
        var target = $(e.target);
        if (target.is('input')) return;
        var rating = $('#movie-rating').val();
        console.log(rating);
        if (rating === '' || isNaN(rating)) return;
        rating = parseFloat(rating);
        if (rating < 0 || rating > 10) return;
        chrome.runtime.sendMessage({'action': 'movieRating', 'rating': rating}, function () {
            chrome.tabs.executeScript(null, {file: "scripts/getMovies.js"});
            window.close();
        });
    })
});