package stivik.vv.p02.helper;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.TelematicMessage;

import javax.jms.*;
import java.io.Serializable;
import java.util.List;

public class ActiveMQCommunicator<T extends Serializable> {

    private Connection connection;
    private Session session;
    private MessageProducer producer;
    private MessageConsumer consumer;

    private Class<T> messageType;

    public ActiveMQCommunicator(Class<T> type, String url, String queue) throws JMSException {
        ConnectionFactory factory = new ActiveMQConnectionFactory(url);
        ((ActiveMQConnectionFactory) factory).setTrustedPackages(List.of("stivik.vv.p02"));
        connection = factory.createConnection();
        connection.start();

        session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

        Destination destination = session.createQueue(queue);
        producer = session.createProducer(destination);
        consumer = session.createConsumer(destination);

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

    public void close() throws JMSException {
        connection.close();
    }
}
