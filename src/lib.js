import * as azdev from 'azure-devops-node-api';

const AZ_TAG_REGEX = /(AB#)[0-9]+/g;
const ADO_URL = 'https://dev.azure.com';
export const WORK_ITEM_STATE = 'System.State';
export const STATE_CLOSED = 'Closed';

export const throwIfNotPushEvent = (eventName) => {
  if (eventName !== 'push') {
    throw new TypeError(`Action is only compatible for push events. Received: ${eventName}`);
  }
};

export const getTags = (commits) => Array.from(
  new Set(commits.flatMap((commit) => commit.match(AZ_TAG_REGEX))),
).filter(Boolean);

const getIdFromTag = (tag) => tag.split('#')[1].trim();

const failedUpdate = (message) => ({ success: false, message });
const successfulUpdate = (message) => ({ success: true, message });

export const validateWorkItem = (workItem, newState, tag, reopenItems) => {
  if (!workItem) return failedUpdate(`Error finding item with tag ${tag}`);
  if (workItem.fields[WORK_ITEM_STATE] === newState) {
    return successfulUpdate(`Item ${tag} is already assigned to state ${newState}`);
  }

  if (!reopenItems && workItem.fields[WORK_ITEM_STATE] === STATE_CLOSED) {
    return successfulUpdate(`Item ${tag} has already been assigned to ${STATE_CLOSED} state`);
  }
  return null;
};

export const updateAZItems = async (tags, newState, project, client, reopenItems) => {
  const document = [
    {
      op: 'add',
      path: `/fields/${WORK_ITEM_STATE}`,
      value: newState,
    },
  ];

  return Promise.all(tags.map(async (tag) => {
    const id = getIdFromTag(tag);
    const workItem = await client.getWorkItem(id);
    const validationMessage = validateWorkItem(workItem, newState, tag, reopenItems);
    if (validationMessage !== null) return validationMessage;
    
    try {
      const updatedWorkItem = await client.updateWorkItem([], document, id, project, false);
      if (updatedWorkItem.fields[WORK_ITEM_STATE] !== newState) {
        failedUpdate(`Item ${tag} unable to be updated`);
      }
    } catch (e) {
      if (
          e.statusCode === 400 && 
          e.result.message === `The field 'State' contains the value '${newState}' that is not in the ` 
            + 'list of supported values'
      ) {
        return successfulUpdate(`Skipping item ${tag}. State ${newState} not supported for this item type`)
      }
      return failedUpdate(e.result.message)
    }

    return successfulUpdate(`Item ${tag} successfully updated`);
  }));
};

export const getAZConnection = (token, adoOrg) => {
  const authHandler = azdev.getPersonalAccessTokenHandler(token);
  return new azdev.WebApi(`${ADO_URL}/${adoOrg}`, authHandler);
};
