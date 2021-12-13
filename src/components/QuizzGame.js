import { useState, useEffect } from 'react';
import quizzDataBaseSource from '../quizzDataBase/quizzDataBase';

// ----------DataBase-----------
const quizzDataBase = Object.values(quizzDataBaseSource); // returns an ARRAY of Objects.
console.log(quizzDataBase);

const QuizzGame = () => {
  // --------States Management----------
  const [questionIndex, setquestionIndex] = useState(0); // Tracks the current question.
  const [checkBoxState, setCheckBoxState] = useState(); // Tracks if the option (checkBox) was selected or not.
  const [answerResult, setAnswerResult] = useState(false); // Renders the <element> with the result of the chosen answer (correct, partially correct or wrong).
  const [pontuation, setPontuation] = useState(0);

  //-----Functions--------

  const handleChange = (e) => {
    setCheckBoxState({ ...checkBoxState, [e.target.name]: e.target.checked });
  };

  // ------useEffect------------
  // Initiates every time a question starts. Eevery question has a diferent length of answer options. Sets each answer option checkBoxes to "false" and creates the dataBase of correct answers.
  useEffect(() => {
    const correctAnswers = quizzDataBase[questionIndex].solutions; // Returns an Array
    const checkBoxStateInitialization = {};

    for (let i = 0; i < quizzDataBase[questionIndex].options.length; i++) {
      checkBoxStateInitialization[i] = false;
    }
    setCheckBoxState(checkBoxStateInitialization);

    console.log(
      'Running onMount and onUpdate',
      quizzDataBase[questionIndex].options,
      checkBoxStateInitialization,
      correctAnswers
    );
  }, [questionIndex]);

  return (
    <div>
      <h2>{quizzDataBase[questionIndex].question}</h2>
      {quizzDataBase[questionIndex].code && (
        <h2>{quizzDataBase[questionIndex].code}</h2>
      )}
      <div>
        <form>
          {quizzDataBase[questionIndex].options.map((option, index) => {
            return (
              <div key={index}>
                <input
                  type='checkbox'
                  name={index}
                  id={index}
                  onChange={handleChange}
                />
                <label htmlFor={index}>{option.text}</label>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};
export default QuizzGame;
