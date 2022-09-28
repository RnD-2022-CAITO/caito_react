import React, { useState } from 'react'
import { useUserData } from '../global/auth/UserData';
import { useNavigate } from 'react-router-dom';
import targetGroup from '../../assets/targetGroup.svg';
import survey from '../../assets/survey.svg';
import schedule from '../../assets/schedule.svg'
import { TargetGroupDialog } from './dialogs/TargetGroupDialog';
import { Classes } from '@blueprintjs/core';
import { Footer } from '../global/Footer';
import {motion} from 'framer-motion';

import './index.css'


export const LandingOfficer = () => {
    const {userData} = useUserData();

    //Open dialog
    const [isOpen, setIsOpen] = useState(false);
    const openDialog = () => setIsOpen(!isOpen);

    const navigate = useNavigate();

    return (
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        >
            <motion.section 
            initial={{opacity: 0, y: '-10vh'}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1, delay: 1}}
            className='instruction-banner'>
                <h3>Want to know more on how enlight works?</h3>
                <button onClick={()=>navigate('/about')} >Click here</button>
            </motion.section>
            <section className='container-hero'>
                <div className='hero'>
                    <h1>Welcome,  
                        <span style={{color:'var(--caito-purple)', fontWeight:'bold', letterSpacing:'-8px'}}>
                            {userData.firstName} {userData.lastName}</span> 
                    </h1>
                    <motion.div
                    initial={{opacity: 0, y: '10vh'}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1, delay: 0.5}}
                    >
                    <p>Let's get started by creating a new profiling task.</p>
                    <button onClick={()=>navigate('/survey-making')}>Create a new Profiling task</button>
                    </motion.div>

                </div>
            </section>

            <section className='wrapper-hero explore'>
                <h1>Explore enlight</h1>
                <p>enlight offers a wide variety of features to make your data collecting process easier.</p>
            </section>

            <section className='wrapper-hero'>
                <div className='container-dark'>
                    <div className='grid-item-left'>
                        <h1>Schedule your tasks</h1>
                        <p>Don't forget to send an invitation to the targeted teachers to fill in your tasks</p>
                        <button onClick={()=>navigate('/survey-distribution')}>Distribute Task</button>

                    </div>
                    <motion.div className='grid-item-right'
                    initial={{opacity: 0, y: '-10vh'}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 4, type: 'spring', stiffness: 70}}
                    >
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={schedule} alt='survey'
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className='wrapper-hero'>
                <div className='container-dark'>
                    <motion.div className='grid-item-left'
                    initial={{opacity: 0, y: '-10vh'}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 4, type: 'spring', stiffness: 70}}>
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={survey} alt='survey'
                            />
                        </div>
                    </motion.div>
                    <div className='grid-item-right'>
                        <h1>View your profiling tasks</h1>
                        <p>Keep track of all the tasks you have or have not sent out here</p>
                        <button onClick={()=>navigate('/task-overview')}>View Tasks</button>
                    </div>
                </div>
            </section>

            <section className='wrapper-hero'>
                <div className='container-dark'>
                    <div className='grid-item-left'>
                        <h1>Customise "My Target Groups"</h1>
                        <p>Manage your target group to make the task distribution process much easier.</p>
                        <button onClick={()=>navigate('/admin')}>View Groups</button>
                        <p className={Classes.MINIMAL}
                        style={{textAlign:'center', padding:'10px', color:'var(--secondary-color)', cursor:'pointer'}}
                        onClick={openDialog}
                        >What is a target group?</p>
                    </div>
                    <motion.div className='grid-item-right'
                    initial={{opacity: 0, y: '10vh'}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 4, type: 'spring', stiffness: 70}}>
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={targetGroup} alt='target group'
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
            <TargetGroupDialog isOpen={isOpen} openDialog={openDialog} />

            <Footer />
        </motion.div>
  )
}
