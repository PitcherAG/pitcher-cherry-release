module.exports = {
  branches: [{ name: 'release' }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'revert', release: 'patch' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: true, pkgRoot: '.' }],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        releasedLabels: [
          // eslint-disable-next-line max-len
          'released<%= nextRelease.channel ? ` on ${nextRelease.channel}@${nextRelease.version}` : "" %> from <%= branch.name %>',
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): set `package.json` to ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}
