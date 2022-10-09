import { HTMLSelect } from '@blueprintjs/core'
import React from 'react'
import {motion} from 'framer-motion'

export const SelectTask = ({selectedSurveys, setSelectedSurveys, setSelectedSurveysTitle, allSurveys}) => {
  return (
    <motion.div
    initial={{opacity: 0, x: '-10vw'}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.5, type: 'spring', stiffness: 100}}
    >
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
    </motion.div>
  )
}
