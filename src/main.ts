#!/usr/bin/env node

import inquirer from 'inquirer'
import { execSync } from 'node:child_process'
import chalk from 'chalk'
import { Command } from 'commander'

const program = new Command()
const sha1 = /\b[0-9a-f]{5,40}\b/g
const todayDate = new Date()
const today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`

function exec(command: string, silent: boolean = false) {
  if (!silent) {
    console.log(chalk.green('Executing: ') + command)
  }
  const result = execSync(command, { encoding: 'utf8' })
  if (!silent) {
    console.log(result)
  }
  return result.trim()
}

function execSilently(command: string) {
  return exec(command, true)
}

function checkPreconditions() {
  const isGitRepo = execSilently('git rev-parse --is-inside-work-tree').includes('true')
  if (!isGitRepo) {
    console.log(chalk.red('This directory is not a git repository.'))
    process.exit()
  }

  const isRepoClean = execSilently('git status').includes('nothing to commit')
  if (!isRepoClean) {
    console.log(chalk.red('You have uncommitted changes. Please stash them before continuing to ensure you don\'t loose any work.'))
    process.exit()
  }
}

(async () => {
  program
    .requiredOption('-t, --targets <branch-names...>', 'Where do you want to deploy? Provide target release branch names.')
    .requiredOption('-b, --branch-name <branch-name>', 'What should be the unique branch name of your deploy branch(es)? Provide the core of the release feature branch name that will be used with this template `deploy/<branch-name>_to_<target>`.', today)
    .option('-c, --commits <commits...>', 'What commits do you want to deploy? Provide commit SHAs that you want to cherry-pick. If both commits and search options are provided, they will be merged.', [])
    .option('-s, --search <string>', 'What JIRA issues do you want to deploy? Specify keyword to search for in the commit messages and interactively pick them from the list. Case insensitive.', '')
    .option('-np, --no-push', 'You don\'t want to push yet? Disable pushing new branches to the remote repository.')
    .parse()

  const options = program.opts()
  checkPreconditions()

  const showRecentCommitsByUsingEmptySearch = options.commits.length === 0 && options.search === ''
  if (options.search || showRecentCommitsByUsingEmptySearch) {
    const commitList = execSilently(`git log -i --grep="${options.search}" --pretty="format:%h<|>%ad<|>%aN<|>%s" --date=format-local:"%Y-%m-%d %H:%M:%S" --max-count=30`)
      .split('\n')
      .map(line => {
        const [sha, date, author, message] = line.split('<|>')
        return { sha, date, author, message }
      })

    if (commitList.length > 0) {
      const inquiry = await inquirer
        .prompt([
          {
            type: 'checkbox',
            name: 'commits',
            message: 'Which of the matching commits from the current branch do you want to deploy?',
            loop: false,
            pageSize: 20,
            choices: commitList.map((c) => ({
              value: c.sha,
              name: `${chalk.yellow(c.sha)} ${chalk.magenta(c.date)}  ${c.message}  ${chalk.green(c.author)}`,
              disabled: c.message.startsWith('Merge') ? chalk.redBright('Merge commits not supported') : false,
            })),
          },
        ])
      options.commits = [
        ...options.commits,
        ...inquiry.commits.reverse() // we want the oldest commits first
      ]
    }
  }

  if (options.commits.length === 0) {
    console.log(chalk.red('No commits provided to be released. Either use -c to provide SHAs to cherry-pick or -s <search> to manually select commits matching criteria.'))
    process.exit()
  }

  console.log('Options: ', program.opts())


  const prUrls: string[] = []
  const repo = execSilently('git config --get remote.origin.url').split('.git')[0].split(':')[1]
  const initialBranch = execSilently('git rev-parse --abbrev-ref HEAD')

  options.targets.forEach((target: string) => {
    const featureBranch = `deploy/${options.branchName}_to_${target}`

    exec(`git checkout ${target}`)
    exec(`git pull`)
    exec(`git switch -c ${featureBranch}`)
    options.commits.forEach((commitHash: string) => {
      exec(`git cherry-pick ${commitHash}`)
    })
    if (options.push) {
      exec(`git push -u origin ${featureBranch}`)
    }

    prUrls.push(`https://github.com/${repo}/compare/${target}...${featureBranch}`)
  })

  console.log('\n\n')
  console.log(chalk.green('You can create your release PRs (CMD + Click to open):'))
  console.log(chalk.green('==================================='))
  prUrls.forEach((url) => {
    console.log(chalk.blue(url))
  })
  console.log('\n\n')

  execSilently(`git checkout ${initialBranch}`)
})()