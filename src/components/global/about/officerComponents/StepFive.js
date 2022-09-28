import React from 'react'
import {motion} from 'framer-motion'
import styles from './Steps.module.css'

export const StepFive = ({toggleStep}) => {
  return (
    <>
    <div className={styles.finalStep}>
      <motion.h1
      initial={{opacity: 0, y: '10vh'}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 1, delay: 0, type: 'spring', stiffness: 100, bounce: 0.5}}
      className={styles.title}>Create profiling tasks</motion.h1>
      
      <motion.h1
      initial={{opacity: 0, y: '-10vh'}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 1, delay: 0.5, type: 'spring', stiffness: 100, bounce: 0.5}}
      style={{textAlign:'right', color:'var(--caito-blue)'}}
      className={styles.title}>Send out tasks</motion.h1>

      <motion.h1 
      initial={{opacity: 0, y: '10vh'}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 1, delay: 1, type: 'spring', stiffness: 100, bounce: 0.5}}
      style={{ color:'var(--caito-purple)'}}
      className={styles.title}>Collect data</motion.h1>

      <motion.p 
      style={{textAlign:'center', marginTop:'50px'}}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 3, delay: 1.5}}>
        Simple as that!
      </motion.p>

      <motion.div
      style={{textAlign:'center'}}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 3, delay: 2}} 
      >
        <button onClick={() => toggleStep(1)}>
            Restart the tutorial
        </button>
      </motion.div>

    </div>
    </>
  )
}
