import * as core from '@actions/core';
import * as github from '@actions/github';
import type { DeleteEnvironmentPayload, Repository } from '@octokit/graphql-schema'

async function execute(){
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN as string)

  // Generate environment name from Pull Request number
  const prNumber = github.context.issue.number
  const environmentName = `pr-${prNumber}`
  console.log(`Removing environment ${environmentName}`)

  // Get environment associated with this PR
  const { repository } = await octokit.graphql<{ repository: Repository }>(`
    query GetEnvironment($repoName: String!, $repoOwner: String!, $environmentName: String!) { 
      repository(name: $repoName, owner: $repoOwner) { 
        environment(name: $environmentName){
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

  // Environment does not exist, we're done
  if (!repository?.environment?.name){
    core.notice(`No environment "${environmentName}" found.`)
    process.exit(0)
  }

  // Delete environment
  await octokit.graphql<{ deleteEnvironment: DeleteEnvironmentPayload }>(`
    mutation DeleteEnvironment($environmentId: ID!) { 
      deleteEnvironment(input: { id: $environmentId}) { 
        clientMutationId
      }
    }
  `, {
    environmentId: repository.environment.id
  });
  core.notice(`Deleted environment ${environmentName}`)
}

execute()