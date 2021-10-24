import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';

async function execute(){
  const prNumber = github.context.issue.number
  const environment = `pr-${prNumber}`
  console.log(`Removing environment ${environment}`)
  core.notice(`Removed environment ${environment}`)
}

execute()