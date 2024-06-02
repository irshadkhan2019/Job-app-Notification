// Using credentials in JEnkins file
//  1.Define creds in Jenkins GUI
// 2 .credentials("credId") binds the credentails to your env variable
//  3. for that we need Credentials Binding plugin

pipeline {
    agent any
  // access build tools for ur project
    tools {
        nodejs 'my-nodejs'
    }
  // parameters used to provided some external configuration to ur build to change behaviour
  // eg .build that deploys app to staging server and u want to select version of app that u want to deploy
    parameters {
        string(name:'VERSION-NAME',defaultValue:'',description:'version to deploy on prod')
        choice(name:'VERSION',choices: ['1.1.0','1.3.0'],description:'select choices')
        booleanParam(name:'executeTests',defaultValue: true,description:'bool param')
    }
  // params are suitable usage with exapressionss
   // define own env var so that they are availbe below in all stages
   environment {
     NEW_VERSION = '1.3.0'
     // use cfedentials
     SERVER_CREDENTIALS = credentials('docker-hub')
   }
    stages {
      
        stage('build') {
            steps {
                echo 'Building application'
                echo "Version is ${NEW_VERSION}"
            }
        }
        stage('test') {
            when {
              expression{
                  params.executeTests == true
              }
            }
          // if xecute test param is true then execute below step
            steps {
                echo 'Testing app'
            }
        }
        stage('deploy') {
            steps {
                echo 'Deploying app'
              // TO make creds available only to this stahe build not all
                withCredentails([
                  usernamePassword(credentails:'docker-hub',usernameVariable: USER,passwordVariable: PWD)
                ]){
                  echo "Local creds inside stage build"
                  // sh "script ${USER} ${PWD}"
                }
                echo "deploying with cred ${SERVER_CREDENTIALS}"
                echo "deploying version ${params.VERSION}"
            }
        }
      
    }
}
