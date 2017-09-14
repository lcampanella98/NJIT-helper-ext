var RegistrationInfoToggleScheduleFullscreenScope = new function() {
    this.calendarId = "lookupSchedule-calendar";
    this.isFullScreen = function() {
        var bodyChildren = document.body.childNodes;
        for (var i = 0; i < bodyChildren.length; i++) {
            var c = bodyChildren[i];
            if (c.id === this.calendarId) {
                return true;
            }
        }
        return false;
    };

    this.toggle = function() {
        if (this.isFullScreen()) {
            this.makeNotFullscreen();
        }
        else {
            this.makeFullscreen();
        }
    };

    this.makeNotFullscreen = function() {
        var container = document.getElementById(this.calendarId);
        if (!container) return;
        var parent = container.parentNode;
        parent.removeChild(container);
        var bodyChildren = document.body.childNodes;
        for (var i = 0; i < bodyChildren.length; i++) {
            var c = bodyChildren[i];
            this.restoreOldStyleProp(c, 'display');
        }
        var oldParent = document.getElementById('tabs-lookupSchedule');
        oldParent.insertBefore(container, oldParent.lastElementChild);
        this.restoreOldStyleProp(container, 'display');
        this.restoreOldStyleProp(container, 'width');
        this.restoreOldStyleProp(container, 'height');
        this.restoreOldStyleProp(container, 'top');
        var tempEl = container.lastElementChild;
        this.restoreOldStyleProp(tempEl, 'height');
        tempEl = tempEl.lastElementChild;
        this.restoreOldStyleProp(tempEl, 'height');
        tempEl = tempEl.childNodes[5];
        this.restoreOldStyleProp(tempEl, 'height');
        tempEl = tempEl.lastElementChild;
        this.restoreOldStyleProp(tempEl, 'height');
        tempEl = tempEl.lastElementChild;
        this.restoreOldStyleProp(tempEl, 'height');
        tempEl = tempEl.lastElementChild;
        this.restoreOldStyleProp(tempEl, 'height');
        var table = tempEl.childNodes[0];
        var div = tempEl.childNodes[1].firstElementChild;
        this.restoreOldStyleProp(table, 'height');
        this.restoreOldStyleProp(div, 'height');
        var cells = table.getElementsByTagName('tbody')[0].firstElementChild.childNodes;
        for (i = 0; i < cells.length; i++) {
            c = cells[i];
            if (c.firstElementChild && c.firstElementChild.style) {
                this.restoreOldStyleProp(c.firstElementChild, 'height');
            }
            else if (c.style) {
                this.restoreOldStyleProp(c, 'height');
            }
        }
        var scheduleListView = document.getElementById('scheduleListViewWrapper');
        this.restoreOldStyleProp(scheduleListView, 'height');
    };
    this.oldPropSuffix = '_dw_old';
    this.saveOldStyleProp = function(obj, name) {
        if (obj.style) {
            obj[name + this.oldPropSuffix] = obj.style[name];
        }
    };

    this.restoreOldStyleProp = function(obj, name) {
        if (obj.style && obj.hasOwnProperty(name + this.oldPropSuffix)){
            obj.style[name] = obj[name + this.oldPropSuffix];
        }
    };

    this.makeFullscreen = function() {
        var container = document.getElementById(this.calendarId);
        if (!container) return;
        var parent = container.parentNode;
        parent.removeChild(container);
        var bodyChildren = document.body.childNodes;
        for (var i = 0; i < bodyChildren.length; i++) {
            var c = bodyChildren[i];
            if (c.style) {
                this.saveOldStyleProp(c, 'display');
                c.style.display = 'none';
            }
        }
        var newHeight = (window.innerHeight) + 'px';
        document.body.appendChild(container);
        this.saveOldStyleProp(container, 'display');
        container.style.display = 'block';
        this.saveOldStyleProp(container, 'width');
        container.style.width = '100%';
        this.saveOldStyleProp(container, 'height');
        container.style.height = newHeight;
        this.saveOldStyleProp(container, 'top');
        container.style.top = '0px';
        var tempEl = container.lastElementChild;
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        tempEl = tempEl.lastElementChild;
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        tempEl = tempEl.childNodes[5];
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        tempEl = tempEl.lastElementChild;
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        tempEl = tempEl.lastElementChild;
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        tempEl = tempEl.lastElementChild;
        this.saveOldStyleProp(tempEl, 'height');
        tempEl.style.height = newHeight;
        var table = tempEl.childNodes[0];
        var div = tempEl.childNodes[1].firstElementChild;
        this.saveOldStyleProp(table, 'height');
        table.style.height = newHeight;
        this.saveOldStyleProp(div, 'height');
        div.style.height = (window.innerHeight - 50) + 'px';
        var cells = table.getElementsByTagName('tbody')[0].firstElementChild.childNodes;
        for (i = 0; i < cells.length; i++) {
            c = cells[i];
            if (c.firstElementChild && c.firstElementChild.style) {
                this.saveOldStyleProp(c.firstElementChild, 'height');
                c.firstElementChild.style.height = newHeight;
            }
            else if (c.style) {
                this.saveOldStyleProp(c, 'height');
                c.style.height = newHeight;
            }
        }
        var scheduleListView = document.getElementById('scheduleListViewWrapper');
        this.saveOldStyleProp(scheduleListView, 'height');
        scheduleListView.style.height = (window.innerHeight - 50) + 'px';
    };

};

RegistrationInfoToggleScheduleFullscreenScope.toggle();
