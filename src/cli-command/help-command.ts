import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
      Программа для подготовки данных для REST API сервера.

      Пример:
        main.js --<command> [--arguments]

      Команды:
        --version:                      # выводит номер версии
        --help:                         # печатает этот текст
        --import <filepath> <login>
            <password> <db-host>
            <db-name> <salt>:           # импортирует данные из TSV
        --generate <n> <filepath> <url> # генерирует произольное количество тестовых данных. n - количество генерируемых предложений, filepath - путь для сохранения файла, url - адрес сервера, с которого взять данные
    `);
  }
}
