// Using credentials in JEnkins file
//  1.Define creds in Jenkins GUI
// 2 .credentials("credId") binds the credentails to your env variable
//  3. for that we need Credentials Binding plugin
// def gv 

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
                echo 'Installing application'
                script{
                    
                    sh 'npm install'
                }
            }
        }

        stage('build image ') {
            steps {
                echo 'Building Image'
                script{
                    withCredentials([usernamePassword(credentialsId: 'docker-hub',passwordVariable: 'PASS', usernameVariable: 'USER')]){
                       sh 'docker build -t izuku11/demo-app:notifcations-2.0 .'
                       sh 'echo $PASS | docker login -u $USER --password-stdin'
                       sh 'docker push izuku11/demo-app:notifcations-2.0'
                    }
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
