module.exports = {
  apps: [{
    name: 'tutorial-pt-2',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-15-111-214.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/tutorial-ssh-key-pair.pem',
      ref: 'origin/master',
      repo: 'https://github.com/Blosserdw/tutorial-pt-2.git',
      path: '/home/ubuntu/server/',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}