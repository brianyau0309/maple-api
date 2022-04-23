// @index('./**/*.dto.ts', (f, _) => `export { default as ${_.pascalCase(f.path)} } from '${f.path}';`)
export { default as AllMusicDto } from './all-music.dto';
export { default as MusicDetailDto } from './music-detail.dto';
export { default as SyncMusicDto } from './sync-music.dto';
// @endindex
