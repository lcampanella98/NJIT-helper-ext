angular.module('crummyUI', []).controller('GroupController', ['$scope', function ($scope) {

    chrome.storage.sync.get("classGroups", function (items) {
        $scope.classGroups = items["classGroups"];
        if (!$scope.classGroups) {
            $scope.classGroups = [];
        }
        $scope.$apply();
    });

    $(function() {
        $('[data-toggle=tooltip]').hover(function(){
            $(this).tooltip('show');
        }, function(){
            $(this).tooltip('hide');
        });
    });

    $scope.getNewClassGroup = function getClassGroup(name, classes, active) {
        var isActive = typeof active === 'boolean' ? active : false;
        return {
            "name":name, "classes": classes, "isActive": isActive
        };
    };

    $scope.updateGroupsStorage = function updateGroupsStorage(msg, color, cb) {
        chrome.storage.sync.set({"classGroups": $scope.classGroups}, function () {
            if (typeof cb === 'function') cb();
        });
    };

    $scope.addNewClassGroup = function ($event) { // add a new class group
        var inputName = $('#text-classname');
        var inputClasses = $('#class-textarea');
        var name = inputName.val();
        if (!name) {
            return;
        } else {
            for (var i = 0; i < $scope.classGroups.length; i++) if ($scope.classGroups[i].name === name) return;
        }
        var lines = inputClasses.val().split("\n");
        var classes = [];
        for (i = 0; i < lines.length; i++) {
            var lineSpl = lines[i].split(" ");
            if (lineSpl.length < 2) continue;
            var clsSubject = lineSpl[0];
            var clsNum = lineSpl[1];
            var cls = {"subject": clsSubject, "number": clsNum};
            classes.push(cls);
        }
        var newGroup = $scope.getNewClassGroup(name, classes, false);
        $scope.classGroups.push(newGroup);
        $scope.updateGroupsStorage();
        // $scope.$apply();
        inputName.val('');
        inputClasses.val('');
    };

    $scope.deleteGroup = function ($event, group) { // remove a class group
        var groupName = group.name;
        if ($scope.classGroups) {
            var changed = false;
            for (var i = 0; i < $scope.classGroups.length; i++) {
                if ($scope.classGroups[i].name === groupName) {
                    $scope.classGroups.splice(i, 1);
                    changed = true;
                }
            }
            if (changed) {
                $scope.updateGroupsStorage(); // "Removed!", 'black'
                // $scope.$apply();
            }
        }
    };

    $scope.setGroupActive = function($event, group) { // set a class group active
        var newActiveClass;
        var name = group.name;
        var oldActiveClass;
        for (var i = 0; i < $scope.classGroups.length; i++) {
            if ($scope.classGroups[i].isActive) {
                oldActiveClass = $scope.classGroups[i];
            } else if ($scope.classGroups[i].name === name) {
                newActiveClass = $scope.classGroups[i];
            }
        }
        if (newActiveClass) {
            newActiveClass.isActive = true;
            if (oldActiveClass) oldActiveClass.isActive = false;
            $scope.updateGroupsStorage(); // 'Active class group now ' + name, 'black'
            //$scope.$apply();
        }
    };

    $scope.getNewInfoObj = function(title, crummyInfo, solutionInfo) {
        return { title: title, crummyInfo: crummyInfo, solutionInfo: solutionInfo };
    };

    $scope.infos = [];
    $scope.infos.push($scope.getNewInfoObj(
        'DegreeWorks "What-If"',
        'In DegreeWorks, if you want to use "What-If" to see your degree progress with certain classes, you must enter your classes manually one-by-one.',
        'Here you can create class lists and automatically enter them through the extension\'s action-button.\n' +
        'There is also an action-button option to clear all classes from the input box.'
    ));
    $scope.infos.push($scope.getNewInfoObj(
        'Registration Schedule',
        'When you go to "View Registration Information" in the new registration system, the calendar is so small you can barely see it!',
        'In the action button, select "Toggle Schedule Fullscreen" to expand the schedule window to fullscreen.'
    ));
    $scope.infos.push($scope.getNewInfoObj(
        'ResLife Movies',
        'There are some good movies on the ResLifeMovies site but no way to see or filter by their IMDB ratings.',
        'Go to reslifemovies.njit.edu, click the action button and enter a rating you want to filter by in the ' +
        'ResLifeMovies option. Then click the option and the filtering page will load.'
    ));
}]);

$('form#form-dw-classes').submit(function(event) {
    event.preventDefault();
    return false;
});