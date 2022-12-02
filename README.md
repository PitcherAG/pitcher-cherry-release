# Pitcher Cherry Release
Command line utility to help with deploying commits to customer enviornments by doing cherry-picks.
While we know cherry-picking for release is not the best way to do it, it is required in some cases. This package makes the process of creating release feature-branches and cherry-picks faster, easier and less error prone.

## Usage

You can execute cherry-release iinside any git repository with `npx`. Use `--help` to find out about the options
```
npx @pitcher/cherry-release --help
```

```
Usage: cherry-release [options]

Options:
  -t, --targets <branch-names...>  Where do you want to deploy? Provide target release branch names.
                                   You can provide many branch names separated by spaces.
  -b, --branch-name <branch-name>  What should be the unique branch name of your deploy branch(es)? Provide the core of the release feature
                                   branch name that will be used with this template `deploy/<branch-name>_to_<target>`. (default: "2022-12-2")
  -c, --commits <commits...>       What commits do you want to deploy? Provide space-separated SHAs of the commits you want to cherry-pick.
                                   If both commits and search options are provided, they will be merged.
  -s, --search <string>            What JIRA issues do you want to deploy? Specify keyword to search for in the commit messages and
                                   interactively pick them from the list. Case insensitive.
  -np, --no-push                   You don't want to push yet? Disable pushing new branches to the remote repository.
  -h, --help                       display help for command
```
