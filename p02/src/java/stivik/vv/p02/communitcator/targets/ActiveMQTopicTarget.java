package stivik.vv.p02.communitcator.targets;

import javax.jms.*;
import java.io.Serializable;

public class ActiveMQTopicTarget<T extends Serializable> extends ActiveMQTarget<T> {
    public ActiveMQTopicTarget(Class<T> type, Connection connection, String topic) throws JMSException {
        super(type, connection);

        Destination destination = session.createTopic(topic);
        producer = session.createProducer(destination);
        consumer = session.createConsumer(destination);
    }
}
