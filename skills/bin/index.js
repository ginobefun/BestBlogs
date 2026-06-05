#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const GITHUB_RAW = 'https://raw.githubusercontent.com/ginobefun/BestBlogs/main/skills';

const ALL_SKILLS = [
  'bestblogs-profile',
  'bestblogs-discover',
  'bestblogs-read',
  'bestblogs-capture',
  'bestblogs-explain',
];

const VERSION_MARKER = '.bestblogs-version';

const CLIENTS = {
  claude: {
    label: 'Claude Code',
    defaultDir: () => process.env.CLAUDE_SKILLS_DIR || path.join(os.homedir(), '.claude', 'skills'),
  },
  codex: {
    label: 'Codex',
    defaultDir: () => process.env.CODEX_SKILLS_DIR || path.join(os.homedir(), '.codex', 'skills'),
  },
};

function expandHome(input) {
  if (input === '~') return os.homedir();
  if (input.startsWith('~/')) return path.join(os.homedir(), input.slice(2));
  return input;
}

function getTargets({ dir, client }) {
  if (dir) {
    return [{
      id: 'custom',
      label: 'Custom',
      dir: path.resolve(expandHome(dir)),
    }];
  }

  const selected = client || process.env.BESTBLOGS_SKILLS_CLIENT || 'all';
  const ids = selected === 'all' ? Object.keys(CLIENTS) : [selected];
  const unknown = ids.find((id) => !CLIENTS[id]);
  if (unknown) {
    throw new Error(`Unsupported client "${unknown}". Use all, claude, or codex.`);
  }

  return ids.map((id) => ({
    id,
    label: CLIENTS[id].label,
    dir: CLIENTS[id].defaultDir(),
  }));
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function getInstalledVersion(skillsDir) {
  try {
    return fs.readFileSync(path.join(skillsDir, VERSION_MARKER), 'utf8').trim();
  } catch {
    return null;
  }
}

function saveVersion(skillsDir, version) {
  fs.mkdirSync(skillsDir, { recursive: true });
  fs.writeFileSync(path.join(skillsDir, VERSION_MARKER), version + '\n', 'utf8');
}

async function fetchLatestVersion() {
  const text = await fetchText(`${GITHUB_RAW}/VERSION`);
  return text.trim();
}

async function installSkill(name, skillsDir) {
  const content = await fetchText(`${GITHUB_RAW}/${name}/SKILL.md`);
  const dest = path.join(skillsDir, name);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'SKILL.md'), content, 'utf8');
}

async function doInstall({ targets, skills, force }) {
  const toInstall = skills || ALL_SKILLS;

  let latest;
  try {
    latest = await fetchLatestVersion();
  } catch (err) {
    console.error(`✗ Could not reach GitHub: ${err.message}`);
    process.exit(1);
  }

  const installedVersions = targets.map((target) => ({
    target,
    installed: getInstalledVersion(target.dir),
  }));

  if (!force && installedVersions.every(({ installed }) => installed === latest)) {
    console.log(`✓ BestBlogs Skills v${latest} already up to date in all selected clients.`);
    console.log('  Use --force to reinstall.');
    return;
  }

  for (const { target, installed } of installedVersions) {
    if (!force && installed === latest) {
      console.log(`✓ ${target.label}: v${latest} already up to date (${target.dir})`);
      continue;
    }

    if (installed && installed !== latest) {
      console.log(`Upgrading ${target.label}: BestBlogs Skills v${installed} -> v${latest}`);
    } else {
      console.log(`Installing ${target.label}: BestBlogs Skills v${latest}`);
    }

    fs.mkdirSync(target.dir, { recursive: true });

    for (const skill of toInstall) {
      process.stdout.write(`  ${skill}... `);
      try {
        await installSkill(skill, target.dir);
        process.stdout.write('✓\n');
      } catch (err) {
        process.stdout.write(`✗ (${err.message})\n`);
      }
    }

    saveVersion(target.dir, latest);
    console.log(`✓ ${toInstall.length} skill(s) installed to ${target.dir}`);
    console.log('');
  }

  console.log('Please restart the selected agent(s) to activate the new skills.');
  console.log('Codex built-in skills (~/.codex/skills/.system) and gstack skills (~/.codex/skills/gstack) are not modified.');
  console.log('');
  console.log('Try asking: "今天 BestBlogs 有什么值得读的？"');
}

async function doUpgrade({ targets, skills }) {
  await doInstall({ targets, skills, force: false });
}

async function doList({ targets }) {
  let latest = null;
  try {
    latest = await fetchLatestVersion();
  } catch {
    // offline, skip
  }

  console.log('BestBlogs Skills');
  if (latest) {
    console.log(`  Latest    : ${latest}`);
  }
  console.log('');

  for (const target of targets) {
    const installed = getInstalledVersion(target.dir);
    const status = latest && installed === latest ? '✓ up to date' : (installed || '(not installed)');
    console.log(`${target.label}`);
    console.log(`  Installed : ${status}`);
    console.log(`  Directory : ${target.dir}`);

    for (const skill of ALL_SKILLS) {
      const exists = fs.existsSync(path.join(target.dir, skill, 'SKILL.md'));
      console.log(`  ${exists ? '✓' : '✗'} ${skill}`);
    }
    console.log('');
  }

  if (latest && targets.some((target) => getInstalledVersion(target.dir) !== latest)) {
    console.log(`Run \`npx @bestblogs/skills upgrade\` to update selected clients to v${latest}.`);
  }
}

function printHelp() {
  console.log(`
@bestblogs/skills — BestBlogs Skills installer for Claude Code and Codex

Usage:
  npx @bestblogs/skills [command] [options]

Commands:
  install (default)   Install or upgrade skills
  upgrade             Check for updates and upgrade if available
  list                Show installed skills and version status

Options:
  --skill <name>      Only install/upgrade a specific skill
  --client <name>     Target client: all, claude, or codex (default: all)
  --dir <path>        Custom skills directory (overrides --client)
  --force             Force reinstall even if version matches

Examples:
  npx @bestblogs/skills
  npx @bestblogs/skills install --client codex
  npx @bestblogs/skills install --client claude
  npx @bestblogs/skills upgrade
  npx @bestblogs/skills list
  npx @bestblogs/skills install --skill bestblogs-discover
  npx @bestblogs/skills install --dir /custom/path/skills
`);
}

// CLI entry
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const options = {
  cmd: 'install',
  cmdSet: false,
  force: false,
  skills: null,
  dir: null,
  client: process.env.BESTBLOGS_SKILLS_CLIENT || 'all',
};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];

  if (arg === '--force') {
    options.force = true;
  } else if (arg === '--skill') {
    const value = args[i + 1];
    if (!value || value.startsWith('-')) {
      console.error('Missing value for --skill');
      process.exit(1);
    }
    options.skills = [value];
    i += 1;
  } else if (arg === '--dir') {
    const value = args[i + 1];
    if (!value || value.startsWith('-')) {
      console.error('Missing value for --dir');
      process.exit(1);
    }
    options.dir = value;
    i += 1;
  } else if (arg === '--client') {
    const value = args[i + 1];
    if (!value || value.startsWith('-')) {
      console.error('Missing value for --client');
      process.exit(1);
    }
    options.client = value;
    i += 1;
  } else if (arg.startsWith('-')) {
    console.error(`Unknown option: ${arg}`);
    printHelp();
    process.exit(1);
  } else if (!options.cmdSet) {
    options.cmd = arg;
    options.cmdSet = true;
  } else {
    console.error(`Unexpected argument: ${arg}`);
    printHelp();
    process.exit(1);
  }
}

let targets;
try {
  targets = getTargets({ dir: options.dir, client: options.client });
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

const handlers = {
  install: () => doInstall({ targets, skills: options.skills, force: options.force }),
  upgrade: () => doUpgrade({ targets, skills: options.skills }),
  list: () => doList({ targets }),
};

const handler = handlers[options.cmd];
if (!handler) {
  console.error(`Unknown command: ${options.cmd}`);
  printHelp();
  process.exit(1);
}

handler().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
