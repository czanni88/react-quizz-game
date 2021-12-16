import { useState, useEffect } from 'react';
import quizzDataBaseSource from '../quizzDataBase/quizzDataBase';

// ----------DATABASE-----------
const quizzDataBase = Object.values(quizzDataBaseSource); // returns an ARRAY of Objects.

//--------GLOBAL VARIABLES--------
let correctAnswers = []; // No need of useState since no change happens.

const QuizzGame = () => {
  // --------STATES MANAGEMENT----------
  const [questionIndex, setquestionIndex] = useState(0); // Tracks the current question.
  const [checkBoxState, setCheckBoxState] = useState(); // Tracks if the option (checkBox) was selected or not.
  const [playerResult, setPlayerResult] = useState(); // Final result after comparing to the correct answers.
  const [nextButtonDisable, setNextButtonDisable] = useState(false);
  const [previousButtonDisable, setPreviousButtonDisable] = useState(true);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [reset, setReset] = useState(false);
  const [isSubmited, setIsSubmited] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // ------USE_EFFECT------------
  useEffect(() => {
    correctAnswers = quizzDataBase[questionIndex].solutions;

    // For every question we have several answer option. We need a state to updated every time an option is checked <input onChange={handleChange}>. We compare that state with the correctAnswers (above). Here we create a new initial state for every new question.
    const checkBoxStateInitialization = {};
    for (let i = 0; i < quizzDataBase[questionIndex].options.length; i++) {
      checkBoxStateInitialization[i] = false;
    }
    setCheckBoxState(checkBoxStateInitialization);

    // Check and manage Submit button
    setSubmitButtonDisable(false);
    if (isSubmited.includes(questionIndex)) {
      setSubmitButtonDisable(true);
    }
  }, [questionIndex]);

  // Probably the weirdeste solution to clean "checked boxes" but it works
  useEffect(() => {
    setReset(false);
  }, [reset]);

  //-----FUNCTIONS--------

  const handleChange = (e) => {
    setCheckBoxState({ ...checkBoxState, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    if (!Object.values(checkBoxState).includes(true)) {
      alert('please chose at least one option');
    } else {
      setShowResult(true);
      let checked = [...isSubmited];
      checked.push(questionIndex);
      setIsSubmited(checked);
      setSubmitButtonDisable(true);
      // setTimeout(handleNextQuestion, 5000); // That creates a BUG. If the player submits and click next by itselfs and start selecting the next question answers before 5000 goes by, at the end of the time, it will reset the checked boxes.
    }

    if (questionIndex + 1 === quizzDataBase.length) {
      // Display final result and finish the game
      alert('Display final result and finish the game');
    }

    // Answers validation process
    let result = [];
    let points = 0;
    let wrongAnswers = 0;

    if (Object.values(checkBoxState).includes(true)) {
      for (const property in checkBoxState) {
        if (
          checkBoxState[property] &&
          correctAnswers.includes(Number(property))
        ) {
          result.push('🧞🏆');
          points += 1;
        } else if (
          checkBoxState[property] &&
          !correctAnswers.includes(Number(property))
        ) {
          result.push('💥💀');
        } else if (
          !checkBoxState[property] &&
          correctAnswers.includes(Number(property))
        ) {
          result.push('👈🧐'); // That is the correct.
          wrongAnswers = correctAnswers.length - points;
        } else {
          result.push(''); // When you should not select and it has not been selected
        }
      }
    }

    setPlayerResult(result);
    setCorrect(points + correct);
    setMistakes(wrongAnswers + mistakes);
  };

  const handleNextQuestion = (e) => {
    // Probably the weirdest solution to clean "checked boxes" but it works. Somehow I notice that it works when the element unmonts..... then I mount again with useEffect.... I want to understand that better.
    if (Object.values(checkBoxState).includes(true) && !showResult) {
      alert('please submit your answer');
    } else {
      setReset(true);
      setShowResult(false);
      const nextIndex = questionIndex + 1;
      setquestionIndex(nextIndex);
      setPreviousButtonDisable(false);
      if (questionIndex + 2 === quizzDataBase.length) {
        setNextButtonDisable(true);
      }
    }
  };

  const handlePreviousQuestion = (e) => {
    if (Object.values(checkBoxState).includes(true) && !showResult) {
      alert('please submit your answer');
    } else {
      setReset(true);
      setShowResult(false);
      if (questionIndex >= 1) {
        const nextIndex = questionIndex - 1;
        setquestionIndex(nextIndex);
        setNextButtonDisable(false);
      }
      if (questionIndex === 1) {
        setPreviousButtonDisable(true);
      }
    }
  };

  const totalAmountOfAnswers = () => {
    let arrOfAnswers = 0;
    quizzDataBase.map((obj) => {
      arrOfAnswers += obj.solutions.length;
    });
    return arrOfAnswers;
  };

  return (
    <>
      <div>
        <p>
          Question {questionIndex + 1}/{quizzDataBase.length}
        </p>
        <p>
          Score: {correct * 10}/{totalAmountOfAnswers() * 10}
        </p>
        <p>Right answers: {correct}</p>
        <p>Wrong answers: {mistakes}</p>
      </div>
      <div className='questionsContainer'>
        <h2>{quizzDataBase[questionIndex].question}</h2>
        {quizzDataBase[questionIndex].code && (
          <h3>{quizzDataBase[questionIndex].code}</h3>
        )}
        <div className='formAndButtons'>
          <div>
            <p>
              This question has {correctAnswers.length < 2 ? 'only' : ''}{' '}
              {correctAnswers.length} correct option
              {correctAnswers.length < 2 ? '' : 's'}
            </p>
          </div>
          {!reset && (
            <form>
              {quizzDataBase[questionIndex].options.map((option, index) => {
                return (
                  <div key={index} className='input'>
                    <div>
                      <label htmlFor={index}>{option.text}</label>
                    </div>
                    {!showResult && (
                      <div>
                        {!submitButtonDisable && (
                          <input
                            name={index}
                            id={index}
                            type='checkbox'
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    )}
                    {showResult && (
                      <div>
                        {/* PlayerResult array has the same length as quizzDataBase[questionIndex].options!! I did replace the checkbox <input> with the Emoji <span>*/}
                        <span>{playerResult[index]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </form>
          )}
          {submitButtonDisable && (
            <p style={{ color: 'red' }}>Your answer has been submited</p>
          )}
          <div>
            <button onClick={handleSubmit} disabled={submitButtonDisable}>
              Submit
            </button>
            <button
              onClick={handlePreviousQuestion}
              disabled={previousButtonDisable}
            >
              Previous
            </button>
            <button onClick={handleNextQuestion} disabled={nextButtonDisable}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default QuizzGame;
