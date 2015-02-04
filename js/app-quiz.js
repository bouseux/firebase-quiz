(function() {
    var i = 0;

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
        getReadyVisible : ko.observable(true),
        gameInProgress : ko.observable(false),
        currentQuestion : ko.observable(),
        currentQuestionOutlet : ko.observable(),
        currentCorrectOptionOutlet : ko.observable(),
        currentOptions : ko.observableArray(),
        questionList : ko.observableArray(),
        user : {
            username : ko.observable(),
            score : ko.observable(0)
        }
    };

    viewModel.registerUser = function (formElement) {
        viewModel.getReadyVisible(false);

        var db = connection.reference(uri.leaderboardUri).child(viewModel.user.username());

        db.setWithPriority({
            username: viewModel.user.username(),
            score: viewModel.user.score()
        }, viewModel.user.score());

        viewModel.gameInProgress(true);
        nextQuestion();
    };

    viewModel.checkAnswer = function (value) {
        if (value === viewModel.currentQuestion().correctOption) {
            viewModel.user.score(viewModel.user.score() + 1);
            connection.reference(uri.leaderboardUri).child(viewModel.user.username()).on("value", addPointToLeaderboard);
        }
        nextQuestion();
    }

    viewModel.adminNextQuestion = function () {
        nextQuestion();
    }

    function nextQuestion () {
        if (i < viewModel.questionList().length) {
            displaySelectedQuestionAndOptions(i);
            i++;
        } else {
            viewModel.gameInProgress(false);
        }
    };

    function getQuestionsAndOptions (data) {
        var question = data.val();

        viewModel.questionList.push({
            question : {
                question : question.question,
                correctOption : question.correctOption
            },
            options : [
                question.option1,
                question.option2,
                question.option3
            ]
        });
    }

    function displaySelectedQuestionAndOptions (nr) {
        var currentQuestion = viewModel.questionList()[nr].question;
        var currentOptions = viewModel.questionList()[nr].options;

        viewModel.currentOptions(_.shuffle(currentOptions));
        viewModel.currentQuestion(currentQuestion);
        viewModel.currentQuestionOutlet(currentQuestion.question);
        viewModel.currentCorrectOptionOutlet(currentQuestion.correctOption);
    }

    function addPointToLeaderboard (data) {
        var user = data.val();
        var db = connection.reference(uri.leaderboardUri).child(viewModel.user.username());

        db.setWithPriority({
            username: user.username,
            score: viewModel.user.score()
        }, viewModel.user.score());

    }

    connection.reference(uri.questionsUri).on("child_added", getQuestionsAndOptions);

    ko.applyBindings(viewModel);
}());