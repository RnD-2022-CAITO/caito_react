import React, { useState } from 'react'
import { StepFive } from './officerComponents/StepFive';
import { StepFour } from './officerComponents/StepFour';
import { StepOne } from './officerComponents/StepOne'
import { StepThree } from './officerComponents/StepThree';
import { StepTwo } from './officerComponents/StepTwo';

export const OfficerAbout = () => {
  const [step, toggleStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne step={step} toggleStep={toggleStep} />
      case 2:
        return <StepTwo step={step} toggleStep={toggleStep} />
      case 3:
        return <StepThree step={step} toggleStep={toggleStep} />
      case 4:
        return <StepFour step={step} toggleStep={toggleStep} />
      case 5:
        return <StepFive step={step} toggleStep={toggleStep} />
      default:
        return <StepOne step={step} toggleStep={toggleStep} />
    }
  }
  
  return (
    <>
        {renderStep()}
    </>
  )
}
