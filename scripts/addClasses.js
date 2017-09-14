var DegreeWorksChromeExtensionScope = new function () {
    this.init = function() {
        var self = this;
        chrome.runtime.sendMessage({action: "classes"}, function (response) {
            if (response) {
                self.addAllClasses(response);
            }
        });
    };

    this.getWhatIfFrameDOM = function() {
        var frBodyContainer = document.getElementsByName("frBodyContainer")[0];
        var frBodyContainerDOM = frBodyContainer.contentDocument || frBodyContainer.contentWindow.document;
        var frBody = frBodyContainerDOM.getElementsByName("frBody")[0];
        return frBody.contentDocument || frBody.contentWindow.document;
    };

    this.addAllClasses = function (classesList) {
        var i;
        var whatIfDocument = this.getWhatIfFrameDOM();
        if (!whatIfDocument) return;
        var addClassBtn = whatIfDocument.getElementsByName("btnAdd")[0];
        for (i = 0; i < classesList.length; i++) {
            var subject = classesList[i].subject.toUpperCase();
            var number = classesList[i].number;
            if (number.length > 12 || subject.length > 12) {
                continue;
            }
            var dElems = whatIfDocument.getElementsByName("Discipline");
            var nElems = whatIfDocument.getElementsByName("Number");
            if (dElems.length > 0 && nElems.length > 0) {
                dElems[0].value = subject;
                nElems[0].value = number;
            }
            addClassBtn.click();
        }
    };
};

DegreeWorksChromeExtensionScope.init();
