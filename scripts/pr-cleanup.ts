import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';

async function execute(){
  const prNumber = github.context.issue
  console.log(prNumber)
}

execute()