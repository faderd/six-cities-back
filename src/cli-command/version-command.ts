import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', { encoding: 'utf8' });
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    console.log(version);
  }
}