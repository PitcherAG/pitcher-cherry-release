import inquirer from 'inquirer';
import { execSync } from 'node:child_process'
import chalk from 'chalk'

const sha1 = /\b[0-9a-f]{5,40}\b/g
const todayDate = new Date()
const today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`

function exec(command, silent) {
  if (!silent) console.log(chalk.green('Executing: ') + command)
  const result = execSync(command, { encoding: 'utf8' })
  if (!silent) console.log(result)
  return result
}

inquirer
  .prompt([
    {
      type: 'checkbox',
      name: 'targets',
      message: 'Where do you want to deploy?',
      choices: [
        'sandoz/test',
        'sandoz/qa',
        'sandoz/qa-markets',
        'training',
        'prod',
      ],
    },
    {
      type: 'input',
      name: 'commits',
      message: "What commits do you want to deploy?",
      validate(input) {
        if (sha1.test(input)) {
          return true;
        }

        throw Error('Please provide a valid git commit(s) SHA.');
      },
      filter(input) {
        return input.match(sha1)
      }
    },{
      type: 'input',
      name: 'branch',
      message: 'What should be the unique branch name of your deploy branch(es)?',
      default: today,
      transformer(answer) {
        return `deploy/${answer || today}_to_<env>`
      },
    },
  ])
  .then((answers) => {
    const prUrls = []
    const repo = exec('git config --get remote.origin.url', true).trim().split('.git')[0].split(':')[1]
    const initialBranch = exec('git rev-parse --abbrev-ref HEAD', true).trim()

    const isRepoClean = exec('git status', true).trim().includes('nothing to commit')
    if (!isRepoClean) {
      console.log(chalk.red('You have uncommitted changes. Please stash them before continuing to ensure you don\'t loose any work.'))
      return
    }

    answers.targets.forEach((target) => {
      const featureBranch = `deploy/${answers.branch}_to_${target}`

      exec(`git checkout ${target}`)
      exec(`git pull`)
      exec(`git checkout ${featureBranch}`)
      answers.commits.forEach((commitHash) => {
        exec(`git cherry-pick ${commitHash}`)
      })
      exec(`git push -u origin ${featureBranch}`)

      prUrls.push(`https://github.com/${repo}/compare/${target}...${featureBranch}`)
    })

    console.log('\n\n\n')
    console.log(chalk.green('You can create your release PRs (CMD + Click to open):'))
    console.log(chalk.green('==================================='))
    prUrls.forEach((url) => {
      console.log(chalk.blue(url))
    })
    console.log('\n\n\n')

    exec(`git checkout ${initialBranch}`, true)
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log(chalk.red('Error!'))
      console.log(chalk.red('==================================='))
      console.log(error)
    }
  });