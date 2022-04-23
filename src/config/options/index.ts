// @index('./**/*.options.ts', (f, _) => `export { default as ${_.pascalCase(f.path)} } from '${f.path}';`)
export { default as ConfigModuleOptions } from './config.module.options';
export { default as MongooseModuleOptions } from './mongoose.module.options';
export { default as ServeStaticModuleOptions } from './serve-static.module.options';
// @endindex
