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

function getSkillsDir() {
  return process.env.CLAUDE_SKILLS_DIR || path.join(os.homedir(), '.claude', 'skills');
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

async function doInstall({ skillsDir, skills, force }) {
  const toInstall = skills || ALL_SKILLS;
  const installed = getInstalledVersion(skillsDir);

  let latest;
  try {
    latest = await fetchLatestVersion();
  } catch (err) {
    console.error(`✗ Could not reach GitHub: ${err.message}`);
    process.exit(1);
  }

  if (!force && installed === latest) {
    console.log(`✓ BestBlogs Skills v${latest} already up to date.`);
    console.log(`  Use --force to reinstall, or run: npx bestblogs-skills upgrade`);
    return;
  }

  if (installed && installed !== latest) {
    console.log(`Upgrading BestBlogs Skills: v${installed} → v${latest}`);
  } else {
    console.log(`Installing BestBlogs Skills v${latest}...`);
  }

  fs.mkdirSync(skillsDir, { recursive: true });

  for (const skill of toInstall) {
    process.stdout.write(`  ${skill}... `);
    try {
      await installSkill(skill, skillsDir);
      process.stdout.write('✓\n');
    } catch (err) {
      process.stdout.write(`✗ (${err.message})\n`);
    }
  }

  saveVersion(skillsDir, latest);
  console.log('');
  console.log(`✓ ${toInstall.length} skill(s) installed to ${skillsDir}`);
  console.log('  Please restart Claude Code to activate the new skills.');
  console.log('');
  console.log('  Try asking: "今天 BestBlogs 有什么值得读的？"');
}

async function doUpgrade({ skillsDir, skills }) {
  const installed = getInstalledVersion(skillsDir);

  let latest;
  try {
    latest = await fetchLatestVersion();
  } catch (err) {
    console.error(`✗ Could not reach GitHub: ${err.message}`);
    process.exit(1);
  }

  if (installed === latest) {
    console.log(`✓ Already up to date (v${latest})`);
    return;
  }

  await doInstall({ skillsDir, skills, force: true });
}

async function doList({ skillsDir }) {
  const installed = getInstalledVersion(skillsDir);

  let latest = null;
  try {
    latest = await fetchLatestVersion();
  } catch {
    // offline, skip
  }

  console.log('BestBlogs Skills');
  console.log(`  Installed : ${installed || '(not installed)'}`);
  if (latest) {
    const status = installed === latest ? '✓ up to date' : `→ v${latest} available`;
    console.log(`  Latest    : ${latest} ${status}`);
  }
  console.log(`  Directory : ${skillsDir}`);
  console.log('');

  for (const skill of ALL_SKILLS) {
    const exists = fs.existsSync(path.join(skillsDir, skill, 'SKILL.md'));
    console.log(`  ${exists ? '✓' : '✗'} ${skill}`);
  }

  if (latest && installed !== latest) {
    console.log('');
    console.log(`  Run \`npx bestblogs-skills upgrade\` to update to v${latest}.`);
  }
}

function printHelp() {
  console.log(`
bestblogs-skills — BestBlogs Skills installer for Claude Code

Usage:
  npx bestblogs-skills [command] [options]

Commands:
  install (default)   Install or upgrade skills
  upgrade             Check for updates and upgrade if available
  list                Show installed skills and version status

Options:
  --skill <name>      Only install/upgrade a specific skill
  --dir <path>        Custom skills directory (default: ~/.claude/skills)
  --force             Force reinstall even if version matches

Examples:
  npx bestblogs-skills
  npx bestblogs-skills upgrade
  npx bestblogs-skills list
  npx bestblogs-skills install --skill bestblogs-discover
  npx bestblogs-skills install --dir /custom/path/skills
`);
}

// CLI entry
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const cmd = args.find((a) => !a.startsWith('-')) || 'install';
const force = args.includes('--force');

const skillIdx = args.indexOf('--skill');
const skills = skillIdx >= 0 && args[skillIdx + 1] ? [args[skillIdx + 1]] : null;

const dirIdx = args.indexOf('--dir');
const skillsDir = dirIdx >= 0 && args[dirIdx + 1] ? args[dirIdx + 1] : getSkillsDir();

const handlers = {
  install: () => doInstall({ skillsDir, skills, force }),
  upgrade: () => doUpgrade({ skillsDir, skills }),
  list: () => doList({ skillsDir }),
};

const handler = handlers[cmd];
if (!handler) {
  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

handler().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
