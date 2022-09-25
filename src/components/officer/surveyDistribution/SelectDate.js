import React from 'react'
import {motion} from 'framer-motion'

export const SelectDate = ({scheduledDate, setScheduledDate}) => {
  return (
    <motion.div
    initial={{opacity: 0, x: '-10vw'}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.5, type: 'spring', stiffness: 100}}
    >
        <div className='select-display-s'>
          <h3>Schedule date</h3>
          <input required className='question' type="date"
                 aria-label="date-input"
                 placeholder='Enter your title here..'
                 value={scheduledDate}
                 onInput={e => setScheduledDate(e.target.value)}/>
        </div>
    </motion.div>
  )
}
