import * as core from '@actions/core';
import { getAZConnection, getTags, updateAZItems } from './lib.js';

export async function orchestrate(commits, token, org, project, state, reopenItems) {
  try {
    const tags = getTags(commits);
    const connection = getAZConnection(token, org);
    const client = await connection.getWorkItemTrackingApi();
    const messages = await updateAZItems(tags, state, project, client, reopenItems);
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
