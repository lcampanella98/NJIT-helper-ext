var DegreeWorksRemoveClassesScope = new function () {
    this.getWhatIfFrameDOM = function() {
        var frBodyContainer = document.getElementsByName("frBodyContainer")[0];
        var frBodyContainerDOM = frBodyContainer.contentDocument || frBodyContainer.contentWindow.document;
        var frBody = frBodyContainerDOM.getElementsByName("frBody")[0];
        return frBody.contentDocument || frBody.contentWindow.document;
    };

    this.removeAllClasses = function() {
        var whatIfDoc = this.getWhatIfFrameDOM();
        if (!whatIfDoc) return;
        var select = whatIfDoc.getElementById('CLASSES');
        var options = select.getElementsByTagName('option');
        var opValues = [];

        for (var i = 0; i < options.length; i++) {
            opValues.push(options[i].value);
        }
        var removeButton;
        var tmpInputs = select.parentNode.parentNode.parentNode.getElementsByTagName('input');
        for (i = 0; i < tmpInputs.length; i++) {
            if (tmpInputs[i].name === "REMOVE") removeButton = tmpInputs[i];
        }
        for (i = 0; i < opValues.length; i++) {
            select.value = opValues[i];
            if (removeButton) removeButton.click();
        }
    };
};

DegreeWorksRemoveClassesScope.removeAllClasses();
