import { Snackbar } from '@mui/material'
import type { AlertColor, AlertProps } from '@mui/material/Alert'
import MuiAlert from '@mui/material/Alert'
import React from 'react'

export const SimpleAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export interface SimpleToastProps {
  message: string
  isOpen: boolean
  onClose: () => void
  intent?: AlertColor
}

export const SimpleToast = (props: SimpleToastProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={props.isOpen}
      autoHideDuration={2000}
      onClose={props.onClose}
    >
      <SimpleAlert
        onClose={props.onClose}
        severity={props.intent || 'success'}
        sx={{ width: '100%' }}
      >
        {props.message}
      </SimpleAlert>
    </Snackbar>
  )
}
