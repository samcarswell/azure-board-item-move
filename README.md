```yml
name: Update work item state when commits are pushed to master

on:
   push:
    branches: [master]

jobs:
  alert:
    runs-on: ubuntu-latest
    name: Test workflow
    steps:       
    - uses: samcarswell/azure-board-item-move@master
      env: 
        ado_token: '${{ secrets.AZURE_DEVOPS_TOKEN }}'
        ado_org: '${{ secrets.ADO_ORG }}'
        ado_project: '${{ secrets.ADO_PROJECT }}'
        state: 'Done'
```