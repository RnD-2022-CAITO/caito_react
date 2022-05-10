//main page for the components

//put survey making process here
import React, { useState, useEffect } from 'react';

const OfficerSurvey = () => {
  const [question, setQuestion] = useState("");
  const [question_type, setQuestionType] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [options, setOptions] = useState("");

  useEffect(() => {
    if (optionVisible){
      var thisIsMyCopy = '<p>copy copy copy <strong>strong copy</strong></p>';
      setOptions(thisIsMyCopy);
    } else{
      setOptions("");
    }
  });

  const handleSubmit = () => {
    alert('A name was submitted: ' + question);
  };

  return (
    <div id="survey_div">
      <body id="survey_body">
        <h1>Create a New Survey</h1>
        <p id="created_questions">question is: {question}. radio is {question_type}</p>
        <form id="survey_form" onSubmit={handleSubmit}>
          <label>
            Question:
            <input type="text" onInput={e => setQuestion(e.target.value)} />
            <br></br>
          </label>
          <label>
            Type of Answer:
            <label>
              <input
                type="radio"
                value="text"
                checked={question_type === "text"}
                onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
              />
              Text
            </label>
            <label>
              <input
                type="radio"
                value="number"
                checked={question_type === "number"}
                onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
              />
              Number
            </label>
            <label>
              <input
                type="radio"
                value="checkbox"
                checked={question_type === "checkbox"}
                onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
              />
              Checkbox
            </label>
            <label>
              <input
                type="radio"
                value="radio"
                checked={question_type === "radio"}
                onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
              />
              Radio
            </label>
          </label>
          <label>
            {options}
          </label>
          
          <input type="submit" value="Submit" />
        </form>
      </body>
    </div>
  )
}
export default OfficerSurvey;