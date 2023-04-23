import { MetadataKeys } from './metadata-keys';
import 'reflect-metadata'
import { IOptions } from './routes';

const Controller = (basePath: string, options?: IOptions): ClassDecorator => {
  return (target) => {
    const payload = {basePath: basePath, controllerOptions: options}
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, payload, target);
  };
}
export default Controller;