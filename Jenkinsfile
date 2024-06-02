pipeline {
    agent any
    options {
        // Timeout counter starts AFTER agent is allocated
        timeout(time: 1, unit: 'SECONDS')
    }
    stages {
      
        stage('build') {
            steps {
                echo 'Building application'
            }
        }
        stage('test') {
            steps {
                echo 'Testing app'
            }
        }
        stage('deploy') {
            steps {
                echo 'Deploying app'
            }
        }
      
    }
}
