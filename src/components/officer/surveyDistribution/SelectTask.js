import { HTMLSelect } from '@blueprintjs/core';
import React from 'react'

export const SelectTask = ({selectedSurveys, setSelectedSurveys, setSelectedSurveysTitle, allSurveys}) => {
  return (
    <div>
        <div className='select-display-s'>
          <h3>Profiling Task</h3>
          <div className=' template input-field'>
            <HTMLSelect
              multiple={false}
              value={selectedSurveys}
              onChange={e => {
                setSelectedSurveys(e.target.value);
                console.log(e)
                setSelectedSurveysTitle(e.target.name);
              }
              }
            >
              <option value="" disabled>Select a task</option>
              {allSurveys.map((o) =>
                <option key={o.id} value={o.id} name={o.title}>
                  {o.title}
                </option>)}
            </HTMLSelect>
            <label>
              Select a profiling task
            </label>
          </div>

        </div>
    </div>
  )
}
