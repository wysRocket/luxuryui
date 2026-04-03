const renderBulletList = (items) => items.map((item) => `- ${item}`).join('\n');
const renderNumberedList = (items) => items.map((item, index) => `${index + 1}. ${item}`).join('\n');

export const buildCommercialKitPrompt = ({
  appName,
  flow,
  screenshots,
  renameRules,
  components,
  tokens,
}) => {
  return [
    '# App',
    `Name: ${appName}`,
    '',
    '# Flow',
    `ID: ${flow.id}`,
    `Title: ${flow.title}`,
    `Objective: ${flow.objective}`,
    `Steps:\n${renderNumberedList(flow.steps)}`,
    '',
    '# Reference Screenshots',
    renderBulletList(screenshots),
    '',
    '# Rename Rules',
    renderBulletList(renameRules),
    '- Do not mirror source branding, icons, copy, or exact layouts.',
    '',
    '# Components To Reconstruct',
    renderBulletList(components),
    '',
    '# Design Tokens',
    renderBulletList(tokens),
    '',
    '# Required Output',
    'Produce an original commercial-kit output that is safe to sell as a transformed kit.',
    'Required output structure:',
    '- Cover',
    '- 6-8 transformed flow screens',
    '- Shared component patterns',
    '- Token direction',
  ].join('\n');
};

export const buildStitchPrompt = buildCommercialKitPrompt;
