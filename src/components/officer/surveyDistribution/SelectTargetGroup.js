import { Button, Classes, Icon } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import React from 'react'

export const SelectTargetGroup = ({navigate, renderState}) => {
  return (
    <div>
        <div className='select-display-survey'>
          <h3>Target Groups
          <Tooltip2
                                content={<span>Target group contains a group of teachers that the survey will be sent to. 
                                  <br></br>
                                  Manage your target groups in your admin page,
                                  <br></br>or you can create a new target group by
                                  clicking on the button below
                                </span>}
                                openOnTargetFocus={false}
                                placement="top"
                                usePortal={false}
          >
          <Button className={Classes.MINIMAL} icon={<Icon icon="help" style={{color:'white'}}/>}></Button>
          </Tooltip2>
          </h3>
          <div style={{textAlign: 'center'}}>
            <p>Select a group of teachers that you want to send the survey to </p>
            {renderState()}
            <p> or </p>
            <a href='/groups'>Create a new target group</a>
          </div>

        </div>
    </div>
  )
}
