import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../common/config/config.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { Component } from '../types/component.types.js';
import DatabaseService from '../common/database-client/database.service.js';
import { getURI } from '../utils/db.js';
import express, { Express } from 'express';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';

@injectable()
export default class Application {
  private expressApp: Express;
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseService,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.OfferController) private offerController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.registerRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
