import DoneIcon from '@mui/icons-material/Done'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import type { AxiosError } from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { SimpleToast } from '../../comps/SimpleToast'
import { CONSTS } from '../../config'
import { GlobalContext } from '../../reducer/context'
import { githubCreateFile, githubUpdateFile } from '../../utils'
import { sendMessageToContentScript } from '../../utils/message'

export const SyncPanel = () => {
  const globalContext = useContext(GlobalContext)

  const [fileName, setFileName] = useState('')
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(Boolean)
  const [syncErrorText, setSyncErrorText] = useState('')
  const ResolveUpdate = useRef<((value: boolean) => void) | null>(null)
  const [showInfoToast, setShowInfoToast] = React.useState(false)

  const handleInfoToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setShowInfoToast(false)
  }

  const sync = async () => {
    if (
      !globalContext.state.userConfig ||
      !globalContext.state.userConfig.accessToken ||
      !globalContext.state.userConfig.owner ||
      !globalContext.state.userConfig.repo
    ) {
      setShowInfoToast(true)
      return
    }

    if (!fileName) {
      setSyncErrorText(`${fileName || 'FileName is required'}`)
      return
    }

    setSyncLoading(true)
    setSyncSuccess(false)

    const res = await sendMessageToContentScript({
      command: 'CONVERT',
    })

    if (!res) {
      setSyncErrorText(`This site has not been added`)
      return
    }

    if (!res.result.success) {
      setSyncErrorText(`${res.result.error || 'Request Error'}`)
      return
    }

    try {
      await githubCreateFile({
        userConfig: globalContext.state.userConfig,
        markdown: res.result.content || '',
        title: fileName,
      })
      setSyncSuccess(true)
      setSyncLoading(false)
    } catch (e) {
      if ((e as AxiosError).status === 422 && (e as AxiosError).message.includes('sha')) {
        const confirmPromise = new Promise<boolean>((rs) => {
          ResolveUpdate.current = rs
        })
        setShowUpdateDialog(true)

        const ifUpdate = await confirmPromise
        if (!ifUpdate) {
          setSyncLoading(false)
          return
        }
        try {
          await githubUpdateFile({
            userConfig: globalContext.state.userConfig,
            markdown: res.result.content || '',
            title: fileName,
          })
          setSyncSuccess(true)
          setSyncLoading(false)
        } catch (updateError) {
          setSyncErrorText((updateError as Error).message)
        }
      } else {
        setSyncErrorText((e as Error).message)
      }
    }
  }

  useEffectOnce(() => {
    sendMessageToContentScript({
      command: 'GET_TITLE',
    }).then((res) => {
      if (res.result.success) {
        setFileName(res.result.content || '')
      }
    })
  })

  const getFilePath = (name: string) => {
    if (!globalContext.state.userConfig) return ''
    const { userConfig } = globalContext.state
    return `https://github.com/${userConfig.owner}/${userConfig.repo}/tree/${
      CONSTS.USER_INFO_DEFAULT_BRANCH
    }/${userConfig.pathPrefix}/${encodeURIComponent(name)}`
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        padding: '15px',
      }}
    >
      <Box>
        <TextField
          sx={{ width: '100%' }}
          id="filled-multiline-static"
          label="File Name"
          multiline
          rows={3}
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value)
          }}
          variant="filled"
          margin="none"
        />
      </Box>
      {syncSuccess && (
        <Typography
          color="primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '15px',
            flexGrow: 1,
          }}
        >
          <DoneIcon />
          &nbsp;Sync To Github Success
        </Typography>
      )}
      {syncErrorText && (
        <Typography
          color="error"
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '15px',
            flexGrow: 1,
          }}
        >
          Sync Error: {syncErrorText}
        </Typography>
      )}
      <div>
        <LoadingButton
          loading={syncLoading}
          variant="contained"
          onClick={sync}
          sx={{
            marginTop: '15px',
            minWidth: '100px',
          }}
        >
          Sync
        </LoadingButton>
      </div>

      <SimpleToast
        message="Please set Access Token and Repo information first"
        isOpen={showInfoToast}
        onClose={handleInfoToastClose}
        intent="warning"
      />
      <Dialog
        open={showUpdateDialog}
        onClose={() => {
          setShowUpdateDialog(true)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">File With Same Name Detected</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to overwrite:
            <br />
            <a target="_blank" href={getFilePath(fileName)} rel="noreferrer">
              {fileName}
            </a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setShowUpdateDialog(false)
              if (ResolveUpdate.current) ResolveUpdate.current(false)
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              if (ResolveUpdate.current) ResolveUpdate.current(true)
              setShowUpdateDialog(false)
            }}
            autoFocus
          >
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
