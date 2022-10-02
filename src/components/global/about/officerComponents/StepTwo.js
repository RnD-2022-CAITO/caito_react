import { Icon } from '@blueprintjs/core'
import React from 'react'
import {motion} from 'framer-motion'
import styles from './Steps.module.css'

export const StepTwo = ({step, toggleStep}) => {
  return (
    <motion.div
        initial={{opacity: 1, x: '50vw'}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.5}}
    >
    <div className={styles.container}>
      <h1 className={styles.title}>Collect data through <span style={{color:'var(--caito-blue)'}}>profiling tasks</span></h1>
      
      <p className={styles.description}>With enlight, you can create tasks, or forms, to collect the 
        neccessary data needed from the teachers for the workforce planning process.
        <br></br>
        <br></br>
        Click on the 
        <Icon icon="add" style={{ padding:'5px',color:'var(--caito-blue)'}}/> 
        button on the navigation bar to start creating your first task.
      </p>
    </div>
    <div style={{textAlign:'center'}}>
      <button onClick={() => toggleStep(step + 1)}>
        Next
      </button>
    </div>
    <br></br>
    <br></br>
    <br></br>

    </motion.div>
  )
}
