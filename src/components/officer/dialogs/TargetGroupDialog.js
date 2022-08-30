import React from 'react'
import { Classes, Dialog } from '@blueprintjs/core'

export const TargetGroupDialog = ({isOpen, openDialog}) => {
  return (
    <Dialog
    title="What is Target Group?"
    isOpen={isOpen}
    onClose={openDialog}
    >
        <div className={Classes.DIALOG_BODY}>
            <p>"Target Group" is a group of pre-selected teachers that you
              can create so that you can distribute them in groups instead of 
              selecting them individually.
            </p>
        </div>
    </Dialog>
  )
}
