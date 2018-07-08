package stivik.vv.p02.communitcator.targets;

import javax.jms.*;
import java.io.Serializable;

public abstract class ActiveMQTarget<T extends Serializable> {
    private Class<T> messageType;

    Session session;
    MessageProducer producer;
    MessageConsumer consumer;

    ActiveMQTarget(Class<T> type, Connection connection) throws JMSException {
        session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

        messageType = type;
    }

    public void send(T message) throws JMSException {
        producer.send(session.createObjectMessage(message));
    }

    public T receive() throws JMSException {
        Message message = consumer.receive();
        if (message instanceof ObjectMessage) {
            Serializable object = ((ObjectMessage) message).getObject();

            if (messageType.isInstance(object)) {
                return messageType.cast(object);
            }
        }

        return null;
    }
}
