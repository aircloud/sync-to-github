import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { SimpleToast } from '../../comps/SimpleToast'
import { CONSTS } from '../../config'
import { GlobalContext } from '../../reducer/context'
import type { UserConfig } from '../../schema'

const getRepoAndOwnerFromGitURL = (url: string) => {
  const matched = /github\.com\/(.*?)\/(.*?)($|\/)/.exec(url)
  const owner = matched?.[1]
  const repo = matched?.[2]

  return { owner, repo }
}

export const SettingPanel = () => {
  const globalContext = useContext(GlobalContext)

  const [accessToken, setAccessToken] = useState(globalContext.state.userConfig?.accessToken || '')
  const [repoURL, setRepoURL] = useState(
    globalContext.state.userConfig?.owner && globalContext.state.userConfig?.repo
      ? `https://github.com/${globalContext.state.userConfig.owner}/${globalContext.state.userConfig.repo}`
      : ``,
  )
  const [pathPrefix, setPathPrefix] = useState(globalContext.state.userConfig?.pathPrefix || '')
  const [branch, setBranch] = useState(globalContext.state.userConfig?.branch || '')

  const [showSuccessToast, setShowSuccessToast] = React.useState(false)

  const handleInfoToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setShowSuccessToast(false)
  }
  const syncSetting = () => {
    const { owner, repo } = getRepoAndOwnerFromGitURL(repoURL)
    const userConfig = {
      owner,
      repo,
      accessToken,
      pathPrefix,
      branch,
    }

    window.localStorage.setItem(CONSTS.USER_INFO_LOCAL_STORAGE, JSON.stringify(userConfig))
    globalContext.dispatch({
      type: 'userConfig',
      value: userConfig as UserConfig,
    })
    setShowSuccessToast(true)
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
      <Typography variant="h6" gutterBottom>
        Repo Settings
      </Typography>
      <div>
        <TextField
          sx={{ width: '100%' }}
          label="AccessToken (Basic)"
          id="filled-size-small"
          helperText={
            <div>
              see:{' '}
              <a
                href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                target="_blank"
                rel="noreferrer"
              >
                create a personal access token
              </a>
            </div>
          }
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          variant="filled"
          size="small"
        />
      </div>
      <div>
        <TextField
          sx={{ width: '100%' }}
          label="Repo URL"
          id="filled-size-small"
          value={repoURL}
          helperText="example: https://github.com/{owner}/{repo}"
          onChange={(e) => setRepoURL(e.target.value)}
          variant="filled"
          size="small"
        />
      </div>
      <div>
        <TextField
          sx={{ width: '100%' }}
          label="Branch"
          id="filled-size-small"
          helperText={`The branch, default is ${CONSTS.USER_INFO_DEFAULT_BRANCH}`}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          variant="filled"
          size="small"
        />
      </div>
      <div>
        <TextField
          sx={{ width: '100%' }}
          label="Path Prefix"
          id="filled-size-small"
          helperText="The directory path for the sync files"
          value={pathPrefix}
          onChange={(e) => setPathPrefix(e.target.value)}
          variant="filled"
          size="small"
        />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={syncSetting}
          sx={{
            marginTop: '15px',
            minWidth: '100px',
          }}
        >
          Update
        </Button>
      </div>

      <SimpleToast
        message={'Update Success!'}
        isOpen={showSuccessToast}
        onClose={handleInfoToastClose}
      />
    </Box>
  )
}
