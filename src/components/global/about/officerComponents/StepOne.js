import React from 'react'
import {motion} from 'framer-motion'
import styles from './StepOne.module.css'

export const StepOne = ({step, toggleStep}) => {
  return (
    <motion.div className={styles.container}
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    transition={{ duration: 1 }}
    >
        <h1 className={styles.title}>Welcome to enlight</h1>
        <motion.button
            initial={{opacity:0, y: '-10vh'}}
            animate={
              {
                opacity:1, 
                y: '0',
                transition:{duration: 0.3, type: 'spring', bounce: 0.3, delay: 0.3}
              }
            }
            whileHover={{scale: 1.1}}
            onClick={() => toggleStep(step + 1)}
        >
            Click here to start the tutorial
        </motion.button>
    </motion.div>
  )
}
