import ISubscriber = require('./iSubscriber');

interface INotifier {
    subscribe(subscriber: ISubscriber): void;
}

export = INotifier;