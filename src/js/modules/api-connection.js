import dotenv from 'dotenv'
import fetch from 'node-fetch'
dotenv.config()

/**
 * Fetches issues from GitLab
 * @returns {Promise<[]>} - An array of issues
 */
export async function fetchIssues () {
  const projectPath = encodeURIComponent('1dv528/student/af223ra/maintainer/issue-holder-and-webhooks')
  const issues = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectPath}/issues`, {
    headers: {
      'Private-Token': process.env.GITLAB_API_TOKEN
    }
  }).then(res => res.json())

  console.log('issues fetched')
  return issues || []
}
