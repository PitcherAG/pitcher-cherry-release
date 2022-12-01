module.exports = {
  branches: [{ name: 'main' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: true, pkgRoot: '.' }],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        releasedLabels: [
          'released<%= nextRelease.channel ? ` on ${nextRelease.channel}@${nextRelease.version}` : "" %> from <%= branch.name %>',
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['dist/pitcher-cherry-release.js', 'CHANGELOG.md', 'package.json'],
        message: 'chore(release): set `package.json` to ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}
