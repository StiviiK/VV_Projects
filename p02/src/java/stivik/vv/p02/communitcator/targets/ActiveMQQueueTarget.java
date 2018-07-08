package stivik.vv.p02.communitcator.targets;

import javax.jms.*;
import java.io.Serializable;

public class ActiveMQQueueTarget<T extends Serializable> extends ActiveMQTarget<T> {
    public ActiveMQQueueTarget(Class<T> type, Connection connection, String queue) throws JMSException {
        super(type, connection);

        Destination destination = session.createQueue(queue);
        producer = session.createProducer(destination);
        consumer = session.createConsumer(destination);
    }
}
