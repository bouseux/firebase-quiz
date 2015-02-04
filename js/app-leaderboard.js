(function() {
    var users = [];

    var uri = {
        mainUri : 'https://pauline-party-quiz.firebaseio.com/',
        questionsUri : 'https://pauline-party-quiz.firebaseio.com/questions/',
        leaderboardUri : 'https://pauline-party-quiz.firebaseio.com/leaderboard'
    }

    var connection = {
        reference : function (uri) {
            return new Firebase(uri)
        }
    }

    var viewModel = {
        leaderboard : ko.observableArray()
    };

    function createLeaderboard (data) {
        users.push(data.val());

        viewModel.leaderboard(sortedLeaderboard(users));
    }

    function updateLeaderboard (data) {
        var user = data.val();

        var foundUser = ko.utils.arrayFirst(viewModel.leaderboard(), function(value) {
            return value.username === user.username;
        });

        viewModel.leaderboard.remove(foundUser);
        viewModel.leaderboard.push(user);
        viewModel.leaderboard(sortedLeaderboard(viewModel.leaderboard()));
    }

    function sortedLeaderboard (valueToSort) {
        var sortedArray = _.sortBy(valueToSort, function(value) {
            return value.score;
        });

        return sortedArray.reverse();
    }

    connection.reference(uri.leaderboardUri).on("child_added", createLeaderboard);
    connection.reference(uri.leaderboardUri).on("child_changed", updateLeaderboard);

    ko.applyBindings(viewModel);
}());
