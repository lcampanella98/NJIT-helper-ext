
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
    })
});