import ISubscriber = require('contracts/iSubscriber');

interface INotifier {
    subscribe(subscriber: ISubscriber): void;
}

export = INotifier;