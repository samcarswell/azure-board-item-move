import * as core from '@actions/core';
import * as github from '@actions/github';
import * as lib from './lib';

async function run() {
  try {
    const token = core.getInput('ado_token');
    const org = core.getInput('ado_org');
    const project = core.getInput('ado_project');
    const state = core.getInput('state');

    lib.throwIfNotPushEvent(github.context.eventName);
    const tags = lib.getTags(github.context.event.commits);
    const connection = lib.getAZConnection(token, org);
    const client = await connection.getWorkItemTrackingApi();
    const messages = await lib.updateAZItems(tags, state, project, client);
    messages.forEach((x) => {
      if (x.success) {
        core.info(x.message);
      } else {
        core.error(x.message);
      }
    });
    if (messages.some((x) => !x.success)) {
      core.setFailed('Some items were unable to be updated');
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();
