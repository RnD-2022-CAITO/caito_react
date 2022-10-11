import React from 'react';
import {motion} from 'framer-motion';
import styles from './Steps.module.css';

export const StepFour = ({ step, toggleStep}) => {
  return (
    <motion.div
        initial={{opacity: 1, x: '50vw'}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.5}}
    >
    <div className={styles.container}>
      <h1 className={styles.title}>Collect Data</h1>
      
      <p className={styles.description}>
        You can start your data collecting process once the teachers have
        completed the tasks. You can view the data collected from the teachers
        in the "Task overview" tab.
      </p>
    </div>
    <div style={{textAlign:'center'}}>
      <button onClick={() => toggleStep(step+1)}>
        Next
      </button>
    </div>
    </motion.div>
  )
}
