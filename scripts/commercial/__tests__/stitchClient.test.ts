import { describe, expect, it, vi } from 'vitest';
import { createStitchClient, DEFAULT_STITCH_DEVICE_TYPE } from '../lib/stitchClient.mjs';

describe('createStitchClient', () => {
  it('uses an explicit apiKey via StitchToolClient instead of relying on the singleton env config', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const generate = vi.fn().mockResolvedValue({
      getHtml: vi.fn().mockResolvedValue('https://example.com/screen.html'),
      getImage: vi.fn().mockResolvedValue('https://example.com/screen.png'),
      variants: vi.fn(),
    });
    const createProject = vi.fn().mockResolvedValue({ projectId: 'project-123' });
    const project = vi.fn().mockReturnValue({ generate });
    const StitchToolClient = vi.fn(function StitchToolClientMock() {
      return { close };
    });
    const Stitch = vi.fn(function StitchMock() {
      return {
        createProject,
        project,
      };
    });

    const client = await createStitchClient({
      apiKey: 'explicit-key',
      sdkModule: {
        Stitch,
        StitchToolClient,
      },
    });

    expect(StitchToolClient).toHaveBeenCalledWith({ apiKey: 'explicit-key' });

    const projectId = await client.createProject('Monzo Kit');
    const screen = await client.project(projectId).generate('Build the kit');

    expect(projectId).toBe('project-123');
    expect(project).toHaveBeenCalledWith('project-123');
    expect(generate).toHaveBeenCalledWith('Build the kit', DEFAULT_STITCH_DEVICE_TYPE);
    await client.close();
    expect(close).toHaveBeenCalledTimes(1);
  });
});
