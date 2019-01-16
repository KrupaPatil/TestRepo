import { SocketMessageModel } from '../../models/socket-message.model';

export interface SocketEventHandlerInterface {

  created(socketMessage: SocketMessageModel);

  deleted(socketMessage: SocketMessageModel);

  updated(socketMessage: SocketMessageModel);

}
