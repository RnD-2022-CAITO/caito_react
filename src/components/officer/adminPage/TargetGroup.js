import { Button, Classes, Icon } from '@blueprintjs/core'
import React from 'react'

export const TargetGroup = ({ openTargetGroupDialog, groups, openTargetGroup, targetGroupDetails, renderTargetGroupDetail }) => {
  return (
    <div className='admin-item admin-actions'>
      <h3>Your target group
        <Button className={Classes.MINIMAL}
          icon={<Icon icon="help" style={{ color: 'var(--primary)' }} />}
          onClick={openTargetGroupDialog}
        ></Button>
      </h3>
      <h5>Click on a group to view their details</h5>
      <div className='target-group'>
        {groups.map(group => {
          return <Button
            style={{ margin: '10px' }} key={group.id}
            onClick={() => openTargetGroup(group)}
          >{group.name}
          </Button>
        })}
      </div>
      {targetGroupDetails !== null && renderTargetGroupDetail}
    </div>
  )
}
