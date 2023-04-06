function Question(questionText, questionNo) {
  this.questionText = questionText;
  this.questionNo = questionNo;
}

const q1 = new Question(
  "In the 'Star Trek' universe, what is the name of the ship's computer that responds to voice commands?",
  1
);
const q2 = new Question(
  "What is the name of the fictional robot in Isaac Asimov's 'I, Robot' series that was programmed with the Three Laws of Robotics?",
  2
);
const q3 = new Question(
  "In the movie 'The Matrix', what is the name of the character played by Keanu Reeves?",
  3
);
const q4 = new Question(
  "What is the name of the author who wrote 'The War of the Worlds'?",
  4
);
const q5 = new Question(
  "In the 'Star Wars' universe, what is the name of the weapon used by Jedi knights?",
  5
);

function Answer(answerText) {
  this.answerText = answerText;
}

function QuestionAnswerPair(questionObj, multipleOptionsObj, correctAnswerObj) {
  this.questionObj = questionObj;
  this.multipleOptionsObj = multipleOptionsObj;
  this.correctAnswerObj = correctAnswerObj;

  this.checkAnswer = function (userAnswerText) {
    if (correctAnswerObj.answerText === userAnswerText) {
      return true;
    } else {
      return false;
    }
  };
}

const a1 = new Answer("The Enterprise Computer");
const quesAnsPair1 = new QuestionAnswerPair(
  q1,
  [a1, new Answer("HAL 9000"), new Answer("Skynet"), new Answer("V.I.K.I.")],
  a1
);

const a2 = new Answer("Robbie");
const quesAnsPair2 = new QuestionAnswerPair(
  q2,
  [new Answer("Asimo"), a2, new Answer("Bender"), new Answer("Wall-E")],
  a2
);

const a3 = new Answer("Neo");
const quesAnsPair3 = new QuestionAnswerPair(
  q3,
  [
    new Answer("Morpheus"),
    a3,
    new Answer("Trinity"),
    new Answer("Agent Smith"),
  ],
  a3
);

const a4 = new Answer("H.G. Wells");
const quesAnsPair4 = new QuestionAnswerPair(
  q4,
  [
    new Answer("Jules Verne"),
    new Answer("Arthur C. Clarke"),
    a4,
    new Answer("Isaac Asimov"),
  ],
  a4
);

const a5 = new Answer("Lightsaber");
const quesAnsPair5 = new QuestionAnswerPair(
  q5,
  [new Answer("Blaster"), new Answer("Phaser"), new Answer("Glaive"), a5],
  a5
);

function ProgressBar(pageIndex, totalNoOfQuestions) {
  this.pageIndex = pageIndex;
  this.totalNoOfQuestions = totalNoOfQuestions;

  this.getProgressText = function () {
    const progressText = `Question ${pageIndex + 1} of ${totalNoOfQuestions}`;
    return progressText;
  };
}

function ResultPage(score, markPercentage) {
  this.score = score;
  this.markPercentage = markPercentage;

  this.getContent = function () {
    const content = `Your score : ${score}. Mark percentage is ${markPercentage} %`;
    return content;
  };

  this.display = function () {
    const content = this.getContent();

    const htmlFragment = `
      <h1>Result<h1>
      <h3 id='score'>${content}</h3>
      `;

    const quizElement = document.getElementById("quiz");
    quizElement.innerHTML = htmlFragment;
  };
}

function QuizPage(pageIndex, quesAnsPair, qaPairArray) {
  this.pageIndex = pageIndex;
  this.quesAnsPair = quesAnsPair;
  this.qaPairArray = qaPairArray;

  this.display = function () {
    const questionElement = document.getElementById("question");
    questionElement.innerHTML = quesAnsPair.questionObj.questionText;

    for (
      let index = 0;
      index < quesAnsPair.multipleOptionsObj.length;
      index++
    ) {
      const answerObj = quesAnsPair.multipleOptionsObj[index];
      const choiceID = "choice" + index;
      const answerChoiceElement = document.getElementById(choiceID);
      answerChoiceElement.innerHTML = answerObj.answerText;
    }

    const progressElement = document.getElementById("progress");

    const progressBarObj = new ProgressBar(this.pageIndex, qaPairArray.length);
    progressElement.innerHTML = progressBarObj.getProgressText();
  };
}

function QuizApplication(quesAnsPairArr) {
  this.quesAnsPairArray = quesAnsPairArr;
  this.score = 0;
  this.pageIndex = 0;

  this.start = function () {
    this.registerListeners();
    this.displayQuizPage();
  };

  this.registerListeners = function () {
    const currentQuizAppObject = this;

    const buttonsCount =
      quesAnsPairArr[this.pageIndex].multipleOptionsObj.length;

    for (let index = 0; index < buttonsCount; index++) {
      const buttonId = `btn${index}`;
      const buttonElement = document.getElementById(buttonId);
      this.associateEventListener(buttonElement, currentQuizAppObject);
    }
  };

  this.associateEventListener = function (buttonElement, currentQuizAppObject) {
    buttonElement.onclick = function (event) {
      currentQuizAppObject.handleUserAnswerSelection(event);
    };
  };

  this.handleUserAnswerSelection = function (event) {
    const target = event.currentTarget;
    const userAnswerText = target.children[0].innerText;
    const qaPair = quesAnsPairArr[this.pageIndex];

    const outcome = qaPair.checkAnswer(userAnswerText);
    if (outcome) {
      this.incrementScore();
    }
    this.nextPage();
  };

  this.getScore = function () {
    return this.score;
  };

  this.incrementScore = function () {
    this.score++;
  };

  this.getMarkPercentage = function () {
    const percentage = (this.getScore() / this.quesAnsPairArray.length) * 100;
    return percentage;
  };

  this.nextPage = function () {
    if (this.pageIndex == this.quesAnsPairArray.length - 1) {
      const resultPage = new ResultPage(
        this.getScore(),
        this.getMarkPercentage()
      );
      resultPage.display();
    } else {
      this.initPage();
    }
  };

  this.initPage = function () {
    this.pageIndex = this.pageIndex + 1;
    this.registerListeners();
    this.displayQuizPage();
  };

  this.displayQuizPage = function () {
    const quesansPair = this.quesAnsPairArray[this.pageIndex];
    const quizPage = new QuizPage(
      this.pageIndex,
      quesansPair,
      this.quesAnsPairArray
    );
    quizPage.display();
  };
}

const quizApplication = new QuizApplication([
  quesAnsPair1,
  quesAnsPair2,
  quesAnsPair3,
  quesAnsPair4,
  quesAnsPair5,
]);
quizApplication.start();
