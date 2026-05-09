import fs from 'node:fs';
import path from 'node:path';

export interface CommandInfo {
  name: string;
  description: string;
  name_localizations: Record<string, string>;
  description_localizations: Record<string, string>;
  category: string;
  subcommands?: CommandInfo[];
}

const COMMANDS_DIR = path.join(process.cwd(), '../src/commands');

function extractInfo(
  content: string
): { name: string; description: string; name_localizations: Record<string, string>; description_localizations: Record<string, string> } | null {
  const nameMatch = content.match(/\.setName\(['"](.+?)['"]\)/);
  const descMatch = content.match(/\.setDescription\(['"](.+?)['"]\)/);

  if (nameMatch && descMatch) {
    const info = {
      name: nameMatch[1],
      description: descMatch[1],
      name_localizations: {} as Record<string, string>,
      description_localizations: {} as Record<string, string>
    };

    // Extract Name Localizations
    const nameLocBlock = content.match(/\.setNameLocalizations\(\s*({[\s\S]*?})\s*\)/);
    if (nameLocBlock) {
      const koMatch = nameLocBlock[1].match(/ko:\s*['"](.+?)['"]/);
      if (koMatch) info.name_localizations['ko'] = koMatch[1];
    }

    // Extract Description Localizations
    const descLocBlock = content.match(/\.setDescriptionLocalizations\(\s*({[\s\S]*?})\s*\)/);
    if (descLocBlock) {
      const koMatch = descLocBlock[1].match(/ko:\s*['"](.+?)['"]/);
      if (koMatch) info.description_localizations['ko'] = koMatch[1];
    }

    return info;
  }
  return null;
}

export function getCommands(): Record<string, CommandInfo[]> {
  const commands: Record<string, CommandInfo[]> = {};

  if (!fs.existsSync(COMMANDS_DIR)) {
    console.warn(`Commands directory not found at: ${COMMANDS_DIR}`);
    return {};
  }

  const categories = fs.readdirSync(COMMANDS_DIR, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;

    const categoryPath = path.join(COMMANDS_DIR, category.name);
    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
    const categoryCommands: CommandInfo[] = [];

    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry.name);

      if (entry.isDirectory()) {
        // Subcommand directory: read parent .ts file and subcommand files
        const parentFile = path.join(categoryPath, `${entry.name}.ts`);
        if (!fs.existsSync(parentFile)) continue;

        const parentContent = fs.readFileSync(parentFile, 'utf-8');
        const parentInfo = extractInfo(parentContent);
        if (!parentInfo) continue;

        const subFiles = fs.readdirSync(entryPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
        const subcommands: CommandInfo[] = [];

        for (const subFile of subFiles) {
          const subContent = fs.readFileSync(path.join(entryPath, subFile), 'utf-8');
          const subInfo = extractInfo(subContent);
          if (subInfo) {
            subcommands.push({ ...subInfo, category: category.name });
          }
        }

        categoryCommands.push({
          ...parentInfo,
          category: category.name,
          subcommands: subcommands.length > 0 ? subcommands : undefined
        });
        continue;
      }

      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.js')) continue;
      // Skip parent command files that have a matching directory
      const baseName = entry.name.replace(/\.(ts|js)$/, '');
      if (entries.some((e) => e.isDirectory() && e.name === baseName)) continue;

      const content = fs.readFileSync(entryPath, 'utf-8');
      const info = extractInfo(content);
      if (info) {
        categoryCommands.push({ ...info, category: category.name });
      }
    }

    if (categoryCommands.length > 0) {
      commands[category.name] = categoryCommands;
    }
  }

  return commands;
}
