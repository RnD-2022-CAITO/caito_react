import React, { useState } from 'react'
import { useUserData } from '../global/auth/UserData';
import { useNavigate } from 'react-router-dom';
import targetGroup from '../../assets/targetGroup.svg';
import survey from '../../assets/survey.svg';
import schedule from '../../assets/schedule.svg'
import './index.css'
import { TargetGroupDialog } from './dialogs/TargetGroupDialog';
import { Button, Classes } from '@blueprintjs/core';
import { Footer } from '../global/Footer';

export const LandingOfficer = () => {
    const {userData} = useUserData();

    //Open dialog
    const [isOpen, setIsOpen] = useState(false);
    const openDialog = () => setIsOpen(!isOpen);

    const navigate = useNavigate();

    return (
        <>
            <section className='instruction-banner'>
                <h3>Want to know more on how enlight works?</h3>
                <button>Click here</button>
            </section>
            <section className='container-hero'>
                <div className='hero'>
                    <h1>Welcome, <span style={{color:'var(--caito-purple)'}}>{userData.firstName} {userData.lastName}</span> </h1>
                    <p>Let's get started by creating a new profiling task.</p>
                    <button onClick={()=>navigate('/survey-making')}>Create a new Profiling task</button>
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
                    <div className='grid-item-right'>
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={schedule} alt='survey'
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className='wrapper-hero'>
                <div className='container-dark'>
                    <div className='grid-item-left'>
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={survey} alt='survey'
                            />
                        </div>
                    </div>
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
                    <div className='grid-item-right'>
                        <div style={{textAlign:'center'}}> 
                            <img className='img' src={targetGroup} alt='target group'
                            />
                        </div>
                    </div>
                </div>
            </section>
            <TargetGroupDialog isOpen={isOpen} openDialog={openDialog} />

            <Footer />
        </>
  )
}
