import { Icon } from '@blueprintjs/core';
import React from 'react';
import {motion} from 'framer-motion';
import styles from './Steps.module.css';

export const StepThree = ({step, toggleStep}) => {
  return (
    <motion.div
        initial={{opacity: 1, x: '50vw'}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.5}}
    >
    <div className={styles.container}>
      <h1 className={styles.title}>Send out task</h1>
      
      <p className={styles.description}>
        After creating a task, you can send it out to a group of teachers,
        called "Target Group", to collect the data needed. Remember to name 
        your target group with a descriptive name, so you can easily identify
        the group later.
        <br></br>
        <br></br>
        Click on the 
        <Icon icon="send-message" style={{ padding:'5px',color:'var(--caito-blue)'}}/> 
        button on the navigation bar to start creating your first task.
      </p>
    </div>
    <div style={{textAlign:'center'}}>
      <button onClick={() => toggleStep(step + 1)}>
        Next
      </button>
    </div>
    </motion.div>
  )
}
