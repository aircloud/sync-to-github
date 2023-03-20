import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Box,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import React, { useReducer, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { SettingPanel } from './biz-comps/SettingPanel'
import { SyncPanel } from './biz-comps/SyncPanel'
import { CONSTS } from './config'
import { GlobalContext } from './reducer/context'
import { getDefaultGlobalState, globalReducer } from './reducer/reducer'
import type { IGlobalDispatch, UserConfig } from './schema/reducer'

const theme = createTheme({
  palette: {
    primary: {
      main: '#10a37f',
    },
    secondary: {
      main: '#8f99a8',
    },
  },
})

export const App = () => {
  const [showSettingPanel, setShowSettingPanel] = useState(false)
  const [state, actualDispatch] = useReducer(globalReducer, getDefaultGlobalState())

  const dispatch: IGlobalDispatch = (info) => {
    actualDispatch([info])
  }

  const toggleSettingPanel = () => {
    setShowSettingPanel(!showSettingPanel)
  }

  useEffectOnce(() => {
    const cacheUserConfigStr = window.localStorage.getItem(CONSTS.USER_INFO_LOCAL_STORAGE)

    if (cacheUserConfigStr) {
      const cacheUserConfig = JSON.parse(cacheUserConfigStr) as UserConfig
      dispatch({
        type: 'userConfig',
        value: cacheUserConfig,
      })
    }
  })

  return (
    // eslint-disable-next-line
    <GlobalContext.Provider value={{ state, dispatch, batchDispatch: actualDispatch }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="relative">
            <Toolbar sx={{ minHeight: 46 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Sync To Github
              </Typography>
              <IconButton
                color="inherit"
                aria-label="add an alarm"
                sx={
                  showSettingPanel
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      }
                    : {}
                }
                onClick={toggleSettingPanel}
              >
                <SettingsIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          {!showSettingPanel && <SyncPanel />}
          {showSettingPanel && <SettingPanel />}
        </Box>
      </ThemeProvider>
    </GlobalContext.Provider>
  )
}
