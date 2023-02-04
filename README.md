# Azure Board Item Move

Moves Azure board items into a desired state based on tags in commit messages for a push event.

Eg. The following will move all Azure board items into the state `Development Completed` 
when commits are pushed to the `Development` branch with the corresponding work item tags.

```yml
name: Update work item state when commits are pushed to Development

on:
  push:
    branches: [Development]

jobs:
  alert:
    runs-on: ubuntu-latest
    name: Test workflow
    steps:
    - uses: samcarswell/azure-board-item-move@master
      with:
        ado_token: '${{ secrets.AZURE_DEVOPS_TOKEN }}'
        ado_org: '${{ secrets.ADO_ORG }}'
        ado_project: '${{ secrets.ADO_PROJECT }}'
        state: 'Development Completed'
```