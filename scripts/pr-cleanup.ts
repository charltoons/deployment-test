import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';

async function execute(){
  console.log('token', process.env.GITHUB_TOKEN)
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN)

  const prNumber = github.context.issue.number
  const environmentName = `pr-${prNumber}`
  console.log(`Removing environment ${environmentName}`)

  // Does environment exist?
  const environment = await octokit.graphql(`
    query { 
      repository(name: $repoName, owner: $repoOwner) { 
        environment(name: $environemtnName){
          id
          name
        }
      }
    }
  `, {
    repoName: github.context.repo.repo,
    repoOwner: github.context.repo.owner,
    environmentName
  });

  console.log(JSON.stringify(environment))
  core.notice(`Removed environment ${environmentName}`)
}

execute()