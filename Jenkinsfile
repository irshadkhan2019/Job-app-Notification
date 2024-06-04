library identifier: 'Jenkins-shared-library@dev',retriever: modernSCM(
  [$class:'GitSCMSource',
   remote:'https://github.com/irshadkhan2019/Jenkins-shared-library',
   credentialsId: 'github-creds'
  ]
)

pipeline {
    agent any
  // access build tools for ur project
    tools {
        nodejs 'my-nodejs'
    }
  // parameters used to provided some external configuration to ur build to change behaviour
  // eg .build that deploys app to staging server and u want to select version of app that u want to deploy
    parameters {
        string(name:'ACTUAL_KEY',defaultValue:'',description:'key for npmrc')
        choice(name:'VERSION',choices: ['1.1.0','1.3.0'],description:'select choices')
        booleanParam(name:'executeTests',defaultValue: true,description:'bool param')
    }
  // params are suitable usage with exapressionss
   // define own env var so that they are availbe below in all stages
   environment {
     NEW_VERSION = '1.3.0'
   }
    stages {
        
        stage('configure npmrc') {
            steps {
                echo 'npmrc conf '
                script{
                    
                   sh "sed -i 's/Removed/${ACTUAL_KEY}/' './.npmrc'"
                }
            }
        }
        
        stage('install packages') {
            steps {
              
                script{
                    // from global shared library
                    installPackages()
                }
            }
        }

        stage('build image ') {
            steps {
               
                script{
                  // pass param
                    buildImage 'izuku11/demo-app:notifcations-2.0'
                }
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
                echo 'deploy app'
            }
    
            }
        }
      
    }
