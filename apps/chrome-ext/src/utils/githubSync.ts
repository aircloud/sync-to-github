import type { Endpoints } from '@octokit/types'
import { Octokit } from '@octokit-next/core'
import type { SyncPayload } from '../schema'

type CreateOrUpdateResponse = Endpoints[`PUT /repos/{owner}/{repo}/contents/{path}`]['response']

function base64encode(str: string) {
  if (typeof btoa === 'function') {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode(Number(`0x${p1}`))
      }),
    )
  }
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64')
  throw new Error('Can not find window.btoa or Buffer')
}

export const githubCreateFile = async (payload: SyncPayload): Promise<CreateOrUpdateResponse> => {
  const octokit = new Octokit({
    auth: payload.userConfig?.accessToken,
  })

  const fileName = payload.title
  const filePath = `${payload.userConfig.pathPrefix}/${fileName}`

  // Base64 encode the file content
  const encodedContent = base64encode(payload.markdown)

  const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: payload.userConfig.owner,
    repo: payload.userConfig.repo,
    path: filePath,
    message: `add ${fileName}`,
    content: encodedContent,
    sha: payload.sha,
  })

  return res as CreateOrUpdateResponse
}

export const githubUpdateFile = async (payload: SyncPayload) => {
  const octokit = new Octokit({
    auth: payload.userConfig?.accessToken,
  })

  const fileName = payload.title
  const filePath = `${payload.userConfig.pathPrefix}/${fileName}`

  const currentFileInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: payload.userConfig.owner,
    repo: payload.userConfig.repo,
    path: filePath,
  })

  const { sha } = (currentFileInfo as { data: { sha: string } }).data

  const res = await githubCreateFile({
    ...payload,
    sha,
  })

  return res
}
