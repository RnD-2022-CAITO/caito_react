import React from 'react'
import './surveyMaking.css'

export const Title = ({title, setTitle, templateDisplay}) => {
  return (
    < div className='select-display-s creator'>
    <h3>Task details</h3>

    <div className='input-field'>
        <input required  style={{width:'77.25%'}} type="text" 
        placeholder='Enter your title here..'
        value={title}
        onInput={e => setTitle(e.target.value)} />
        <label>
          Task Title
        </label>
    </div>


    <div className='input-field'>
            {templateDisplay}
    </div>
    </div>
  )
}
