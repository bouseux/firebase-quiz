(function() {
    var uri = {
        questionsUri : 'https://fb-quiz.firebaseio.com/questions/'
    }

    var connection = {
        reference : function (uri) {
            return new Firebase(uri)
        }
    }

    var viewModel = {
        question : {
            question : ko.observable(),
            option1 : ko.observable(),
            option2 : ko.observable(),
            option3 : ko.observable(),
            correctOption : ko.observable()
        }
    };

    viewModel.addQuestionToDb = function (formElement) {
        var db = connection.reference(uri.questionsUri);

        console.log(viewModel.question.option1());

        db.push({
            question: viewModel.question.question(),
            option1 : viewModel.question.option1(),
            option2 : viewModel.question.option2(),
            option3 : viewModel.question.option3(),
            correctOption : viewModel.question.option1()
        });
    }

    ko.applyBindings(viewModel);
}());