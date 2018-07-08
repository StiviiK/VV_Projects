package stivik.vv.p02.communitcator;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.communitcator.targets.*;

import javax.jms.*;
import java.io.Serializable;
import java.util.List;

public class ActiveMQCommunicator {

    private Connection connection;

    public ActiveMQCommunicator(String url) throws JMSException {
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(url);
        ((ActiveMQConnectionFactory) connectionFactory).setTrustedPackages(List.of("stivik.vv.p02"));

        connection = connectionFactory.createConnection();
        connection.start();
    }

    public <T extends Serializable> ActiveMQQueueTarget<T> queueTarget(Class<T> type, String queue) throws JMSException {
        return new ActiveMQQueueTarget<>(type, connection, queue);
    }

    public <T extends Serializable> ActiveMQTopicTarget<T> topicTarget(Class<T> type, String topic) throws JMSException {
        return new ActiveMQTopicTarget<>(type, connection, topic);
    }

    public void close() throws JMSException {
        connection.close();
    }
}
