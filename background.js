var activeClassGroup = null;

function initActiveGroup() {
    chrome.storage.sync.get("classGroups", function(items) {
        var groups = items.classGroups;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].isActive) {
                activeClassGroup = groups[i];
                break;
            }
        }
    });
}
initActiveGroup();

chrome.storage.onChanged.addListener(function onChromeStorageChanged(changes, namespace) {
    for (var key in changes) {
        if (changes.hasOwnProperty(key) && key === "classGroups") {
            activeClassGroup = null;
            var newGroups = changes[key].newValue;
            for (var i = 0; i < newGroups.length; i++) {
                if (newGroups[i].isActive) {
                    activeClassGroup = newGroups[i];
                    break;
                }
            }
        }
    }
});

chrome.runtime.onMessage.addListener(function msgListener(request, sender, sendResponse) {
    if (request.action === "classes") {
        if (activeClassGroup) {
            sendResponse(activeClassGroup.classes);
        }
    }
});
