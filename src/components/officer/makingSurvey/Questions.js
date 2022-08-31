import { HTMLSelect } from '@blueprintjs/core';
import React from 'react'

export const Questions = (props) => {
    const {
        showQuestion, 
        showInputField, 
        questionList, 
        question, 
        setQuestion, 
        questionType,
        setOptionVisible,
        setQuestionType,
        options,
        addCurrentSurvey,
        addQuestion,
        loading,
        refreshForm} = props;
  return (
    <div>
        <div className='select-display-s creator'>
        <h3>Task questions</h3>

        {!showQuestion ?
        <button style={{width:'100%'}} onClick={showInputField}>Add question</button>
        :
        <>

        <div id="created_questions">{questionList}</div>
        <div className='input-field'>
          <input style={{width:"80%"}} required type="text" 
          placeholder='Enter your question here...'
          value={question}
          onInput={e => setQuestion(e.target.value)} />
          <label>
            Question
          </label>
        </div>
        <div className='input-field'>
        <HTMLSelect className='select-bp'
          value={questionType}        
          onChange={e => 
              {
                setQuestionType(e.target.value); 
                if(e.target.value==='radio' || e.target.value ==='checkbox'){
                  setOptionVisible(true);
                }else{
                  setOptionVisible(false);
                }
              }
          }
        >
          <option value="" disabled>Select an answer type</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
        </HTMLSelect>

        <label>
          Type of Answer: &nbsp;
        </label>
        </div>
        <label>
          {options}
        </label>
        <div className='survey-buttons'>          
            <button className='survey-sub-btns' onClick={() => addQuestion()}> {question === '' ? 'Create question' : 'Save question'}</button>
        </div>

        </>}
      </div>

      <div className='select-display-s create-btns'> 
          <button style={{backgroundColor:'var(--warning)'}} onClick={refreshForm}>Discard</button>
          <button  disabled={loading} onClick={()=> addCurrentSurvey()}>Create task</button>
      </div>
    </div>
  )
}
