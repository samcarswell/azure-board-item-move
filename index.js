import * as core from '@actions/core';
import * as github from '@actions/github';
import { orchestrate } from './run.js';
import { throwIfNotPushEvent } from './lib.js';

async function run() {
  throwIfNotPushEvent(github.context.eventName);
  const token = core.getInput('ado_token');
  const org = core.getInput('ado_org');
  const project = core.getInput('ado_project');
  const state = core.getInput('state');
  await orchestrate(github.context.event.commits, token, org, project, state);
}

run();
