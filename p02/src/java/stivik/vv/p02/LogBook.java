package stivik.vv.p02;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.communitcator.ActiveMQCommunicator;
import stivik.vv.p02.communitcator.targets.ActiveMQTarget;
import stivik.vv.p02.models.TelematicMessage;

import javax.jms.JMSException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class LogBook implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(LogBook.class.getName());

    private ActiveMQCommunicator communicator;
    private ActiveMQTarget<TelematicMessage> messageTopic;

    private Map<Integer, List<TelematicMessage>> book;

    private boolean running = true;

    public LogBook(String listeningTopic) throws JMSException {
        communicator = new ActiveMQCommunicator(ActiveMQConnectionFactory.DEFAULT_BROKER_URL);
        messageTopic = communicator.topicTarget(TelematicMessage.class, listeningTopic);

        book = new HashMap<>();
    }

    @Override
    public void run() {
        try {
            while (running) {
                TelematicMessage message = messageTopic.receive();
                book.computeIfAbsent(message.getUnitId(), k -> new LinkedList<>()).add(message);

                LOGGER.log(Level.INFO, String.format("Inserted message [%s] into LogBook!", message));
            }

            communicator.close();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }

    public int getUnitDistance(int unitId) {
        int distance = 0;
        List<TelematicMessage> list = book.get(unitId);

        if(list != null) {
            distance = list.stream().mapToInt((TelematicMessage::getDistance)).sum();
        }

        return distance;
    }

    public static void main(String[] args) {
        try {
            new Thread(new LogBook("verteiler")).start();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
