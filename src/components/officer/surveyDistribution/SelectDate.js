import React from 'react'

export const SelectDate = ({scheduledDate, setScheduledDate}) => {
  return (
    <div>
        <div className='select-display-s'>
          <h3>Schedule date</h3>
          <input required className='question' type="date"
                 placeholder='Enter your title here..'
                 value={scheduledDate}
                 onInput={e => setScheduledDate(e.target.value)}/>
        </div>
    </div>
  )
}
