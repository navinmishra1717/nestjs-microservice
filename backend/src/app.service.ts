import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './events/create-user.event';

@Injectable()
export class AppService {
  private users: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest) {
    this.users.push(createUserRequest);
    console.log(this.users, 'user');
    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
    this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
  }

  getAnalytics() {
    return this.analyticsClient.send({ cmd: 'get_analytics' }, {});
  }
}
