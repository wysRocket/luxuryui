import { describe, expect, it, vi } from 'vitest';
import { createStitchClient, DEFAULT_STITCH_DEVICE_TYPE } from '../lib/stitchClient.mjs';

describe('createStitchClient', () => {
  it('uses an explicit apiKey via StitchToolClient instead of relying on the singleton env config', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const projects = vi.fn().mockResolvedValue([{ projectId: 'project-123' }]);
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
        projects,
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
    await expect(client.projects()).resolves.toEqual([{ projectId: 'project-123' }]);
    expect(projects).toHaveBeenCalledTimes(1);

    const projectId = await client.createProject('Monzo Kit');
    const screen = await client.project(projectId).generate('Build the kit');

    expect(projectId).toBe('project-123');
    expect(project).toHaveBeenCalledWith('project-123');
    expect(generate).toHaveBeenCalledWith('Build the kit', DEFAULT_STITCH_DEVICE_TYPE);
    await client.close();
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('fails clearly when project listing is not exposed by the SDK', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const StitchToolClient = vi.fn(function StitchToolClientMock() {
      return { close };
    });
    const Stitch = vi.fn(function StitchMock() {
      return {
        createProject: vi.fn(),
        project: vi.fn(),
      };
    });

    const client = await createStitchClient({
      apiKey: 'explicit-key',
      sdkModule: {
        Stitch,
        StitchToolClient,
      },
    });

    await expect(client.projects()).rejects.toThrow('Stitch project listing is not available in this SDK.');
  });
});
